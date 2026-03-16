package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
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
