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
		country := helpers.GetCountryFromIP(req.Hostname)

		// Add visitor
		visitor, err := repo.AddVisitor(r.Context(), repository.AddVisitorParams{
			WebsiteID:   websiteID,
			VisitorHash: visitorHash,
			Country:     country,
		})
		if err != nil {
			errorMessage := "Failed to add visitor: " + err.Error()
			if strings.Contains(err.Error(), "unique") {
				errorMessage = "Visitor already exists"
			}
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Add visit
		visit, err := repo.AddVisit(r.Context(), repository.AddVisitParams{
			WebsiteID: websiteID,
			VisitorID: visitor.ID,
			Referrer:  req.Referrer,
		})
		if err != nil {
			helpers.ApiError(w, 200, "Failed to add visit")
			return
		}

		// Get browser and OS from user agent
		browser, os, deviceType := helpers.GetDeviceInfo(req.UserAgent)

		// Add pageview
		_, err = repo.AddPageview(r.Context(), repository.AddPageviewParams{
			WebsiteID:  websiteID,
			VisitorID:  visitor.ID,
			VisitID:    visit.ID,
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

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Analytics collected successfully", nil)
	}
}
