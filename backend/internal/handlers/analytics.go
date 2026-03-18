package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/middleware"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

func CollectAnalytics(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPost {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Get website ID from path
		websiteID, err := uuid.Parse(r.PathValue("id"))
		if err != nil {
			helpers.ApiError(w, 200, "Invalid website ID")
			return
		}

		// Validate request body
		var req helpers.CollectAnalyticsRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateCollectAnalyticsRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Verify the website exists
		repo := repository.New(pool)
		_, err = repo.GetWebsiteByID(r.Context(), websiteID)
		if err != nil {
			helpers.ApiError(w, 200, "Website not found")
			return
		}

		// Generate visitor hash
		visitorHash, err := helpers.GenerateVisitorHash(websiteID, req.UserAgent)
		if err != nil {
			helpers.ApiError(w, 200, "Failed to generate visitor hash")
			return
		}

		// Get country from IP
		ip := helpers.GetIPFromRequest(r)
		country := helpers.GetCountryFromIP(ip)

		// Add visitor (or load existing)
		visitor, err := repo.AddVisitor(r.Context(), repository.AddVisitorParams{
			WebsiteID:   websiteID,
			VisitorHash: visitorHash,
			Country:     country,
		})
		visitorWasCreated := true
		if err != nil {
			if strings.Contains(err.Error(), "unique") {
				visitorWasCreated = false
				visitor, err = repo.GetVisitorByHash(r.Context(), repository.GetVisitorByHashParams{
					WebsiteID:   websiteID,
					VisitorHash: visitorHash,
				})
				if err != nil {
					helpers.ApiError(w, http.StatusInternalServerError, "Failed to load existing visitor")
					return
				}
			} else {
				errorMessage := "Failed to add visitor: " + err.Error()
				helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
				return
			}
		}

		// Determine visit ID: reuse existing visit when appropriate, otherwise create one
		var visitID uuid.UUID
		if !visitorWasCreated && strings.TrimSpace(req.VisitID) != "" {
			visitID, err = uuid.Parse(strings.TrimSpace(req.VisitID))
			if err != nil {
				helpers.ApiError(w, 200, "Invalid visit ID")
				return
			}
		} else {
			visit, err := repo.AddVisit(r.Context(), repository.AddVisitParams{
				WebsiteID: websiteID,
				VisitorID: visitor.ID,
				Referrer:  req.Referrer,
			})
			if err != nil {
				helpers.ApiError(w, 200, "Failed to add visit")
				return
			}
			visitID = visit.ID
		}

		// Get browser and OS from user agent
		browser, os, deviceType := helpers.GetDeviceInfo(req.UserAgent)

		// Add pageview
		_, err = repo.AddPageview(r.Context(), repository.AddPageviewParams{
			WebsiteID:  websiteID,
			VisitorID:  visitor.ID,
			VisitID:    visitID,
			Path:       req.Path,
			Referrer:   req.Referrer,
			Browser:    browser,
			Os:         os,
			DeviceType: deviceType,
			Country:    country,
		})
		if err != nil {
			errorMessage := "Failed to add pageview: " + err.Error()
			helpers.ApiError(w, 200, errorMessage)
			return
		}

		res := helpers.CollectAnalyticsResponse{
			VisitID: visitID.String(),
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Analytics collected successfully", res)
	}
}

func Heartbeat(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPost {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Validate request body
		var req helpers.HeartbeatRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateHeartbeatRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Parse visit ID
		visitID, err := uuid.Parse(strings.TrimSpace(req.VisitID))
		if err != nil {
			helpers.ApiError(w, 200, "Invalid visit ID")
			return
		}

		repo := repository.New(pool)

		// Get visit to find visitor_id
		visit, err := repo.GetVisitByID(r.Context(), visitID)
		if err != nil {
			helpers.ApiError(w, 200, "Visit not found")
			return
		}

		// Update visit ended_at
		err = repo.UpdateVisitEndedAt(r.Context(), visitID)
		if err != nil {
			helpers.ApiError(w, 200, "Failed to update visit: "+err.Error())
			return
		}

		// Update visitor last_seen
		err = repo.UpdateVisitorLastSeen(r.Context(), visit.VisitorID)
		if err != nil {
			helpers.ApiError(w, 200, "Failed to update visitor: "+err.Error())
			return
		}

		helpers.ApiSuccess(w, http.StatusOK, "Heartbeat received", nil)
	}
}

func GetMetrics(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodGet {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		startStr := r.URL.Query().Get("start")
		endStr := r.URL.Query().Get("end")

		// Validate request body fields
		if err := helpers.ValidateGetMetricsRequest(startStr, endStr); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		start, err := time.Parse(time.RFC3339, startStr)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid start date")
			return
		}
		end, err := time.Parse(time.RFC3339, endStr)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid end date")
			return
		}

		// Validate date range
		if err := helpers.ValidateGetMetricsDateRange(start, end); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Get website ID from path
		websiteID, err := uuid.Parse(r.PathValue("id"))
		if err != nil {
			helpers.ApiError(w, 200, "Invalid website ID")
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		repo := repository.New(pool)

		// Verify the website exists and belongs to the user
		website, err := repo.GetWebsiteByID(r.Context(), websiteID)
		if err != nil {
			helpers.ApiError(w, 200, "Website not found")
			return
		}
		if website.UserID.String() != userID {
			helpers.ApiError(w, http.StatusForbidden, "Forbidden")
			return
		}

		duration := end.Sub(start)
		prevStart := start.Add(-duration)
		prevEnd := end.Add(-duration)

		// Get metrics
		metrics, err := repo.GetMetrics(r.Context(), repository.GetMetricsParams{
			WebsiteID:   websiteID,
			StartedAt:   start,
			StartedAt_2: end,
			StartedAt_3: prevStart,
			StartedAt_4: prevEnd,
		})
		if err != nil {
			helpers.ApiError(w, 200, "Failed to get metrics: "+err.Error())
			return
		}

		res := helpers.GetMetricsResponse{
			TotalVisitors:        metrics.TotalVisitors,
			TotalVisits:          metrics.TotalVisits,
			TotalViews:           metrics.TotalViews,
			AvgVisitDuration:     metrics.AvgVisitDuration,
			PrevTotalVisitors:    metrics.PrevTotalVisitors,
			PrevTotalVisits:      metrics.PrevTotalVisits,
			PrevTotalViews:       metrics.PrevTotalViews,
			PrevAvgVisitDuration: metrics.PrevAvgVisitDuration,
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Analytics fetched successfully", res)
	}
}

func GetChartData(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodGet {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		startStr := r.URL.Query().Get("start")
		endStr := r.URL.Query().Get("end")

		// Validate request body fields
		if err := helpers.ValidateGetChartDataRequest(startStr, endStr); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		start, err := time.Parse(time.RFC3339, startStr)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid start date")
			return
		}
		end, err := time.Parse(time.RFC3339, endStr)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid end date")
			return
		}

		// Validate date range
		if err := helpers.ValidateGetChartDataDateRange(start, end); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Get website ID from path
		websiteID, err := uuid.Parse(r.PathValue("id"))
		if err != nil {
			helpers.ApiError(w, 200, "Invalid website ID")
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		repo := repository.New(pool)

		// Verify the website exists and belongs to the user
		website, err := repo.GetWebsiteByID(r.Context(), websiteID)
		if err != nil {
			helpers.ApiError(w, 200, "Website not found")
			return
		}
		if website.UserID.String() != userID {
			helpers.ApiError(w, http.StatusForbidden, "Forbidden")
			return
		}

		timePeriod := helpers.GetTimePeriod(start, end)
		var chartData []helpers.GetChartDataRow

		if timePeriod == "hour" {
			rows, err := repo.GetChartDataByHour(r.Context(), repository.GetChartDataByHourParams{
				WebsiteID: websiteID,
				Column2:   start,
				Column3:   end,
			})
			if err != nil {
				helpers.ApiError(w, 200, "Failed to get chart data: "+err.Error())
				return
			}
			for _, row := range rows {
				chartData = append(chartData, helpers.GetChartDataRow{
					Time:     row.Time.(time.Time).UTC(),
					Views:    row.Views,
					Visitors: row.Visitors,
				})
			}
		}
		if timePeriod == "day" {
			rows, err := repo.GetChartDataByDay(r.Context(), repository.GetChartDataByDayParams{
				WebsiteID: websiteID,
				Column2:   start,
				Column3:   end,
			})
			if err != nil {
				helpers.ApiError(w, 200, "Failed to get chart data: "+err.Error())
				return
			}
			for _, row := range rows {
				chartData = append(chartData, helpers.GetChartDataRow{
					Time:     row.Time.(time.Time).UTC(),
					Views:    row.Views,
					Visitors: row.Visitors,
				})
			}
		}
		if timePeriod == "month" {
			rows, err := repo.GetChartDataByMonth(r.Context(), repository.GetChartDataByMonthParams{
				WebsiteID: websiteID,
				Column2:   start,
				Column3:   end,
			})
			if err != nil {
				helpers.ApiError(w, 200, "Failed to get chart data: "+err.Error())
				return
			}
			for _, row := range rows {
				chartData = append(chartData, helpers.GetChartDataRow{
					Time:     row.Time.(time.Time).UTC(),
					Views:    row.Views,
					Visitors: row.Visitors,
				})
			}
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Chart data fetched successfully", chartData)
	}
}

func GetPageVisitors(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodGet {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		startStr := r.URL.Query().Get("start")
		endStr := r.URL.Query().Get("end")
		limitStr := r.URL.Query().Get("limit")

		if err := helpers.ValidateGetPageVisitorsRequest(startStr, endStr, limitStr); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Parse start and end dates
		start, err := time.Parse(time.RFC3339Nano, startStr)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid start format, expected ISO")
			return
		}
		end, err := time.Parse(time.RFC3339Nano, endStr)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid end format, expected ISO")
			return
		}

		// Validate date range
		if err := helpers.ValidateGetPageVisitorsDateRange(start, end); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}
		if start.After(end) {
			helpers.ApiError(w, 200, "Invalid date range")
			return
		}

		// Get website ID from path
		websiteID, err := uuid.Parse(r.PathValue("id"))
		if err != nil {
			helpers.ApiError(w, 200, "Invalid website ID")
			return
		}

		// Parse limit
		limitInt, err := strconv.Atoi(limitStr)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid limit format, expected integer")
			return
		}

		if limitInt <= 0 {
			helpers.ApiError(w, 200, "Limit must be greater than 0")
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		repo := repository.New(pool)

		// Verify the website exists and belongs to the user
		website, err := repo.GetWebsiteByID(r.Context(), websiteID)
		if err != nil {
			helpers.ApiError(w, 200, "Website not found")
			return
		}
		if website.UserID.String() != userID {
			helpers.ApiError(w, http.StatusForbidden, "Forbidden")
			return
		}

		rows, err := repo.GetPageVisitors(r.Context(), repository.GetPageVisitorsParams{
			WebsiteID:   websiteID,
			CreatedAt:   start,
			CreatedAt_2: end,
			Limit:       int32(limitInt),
		})

		if err != nil {
			helpers.ApiError(w, 200, "Failed to get page visitors: "+err.Error())
			return
		}

		var pageVisitors []helpers.GetPageVisitorsRow
		for _, row := range rows {
			pageVisitors = append(pageVisitors, helpers.GetPageVisitorsRow{Path: row.Path, Visitors: row.Visitors})
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Page visitors fetched successfully", pageVisitors)
	}
}
