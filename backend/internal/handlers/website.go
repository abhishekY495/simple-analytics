package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/middleware"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Add Website Handler
func AddWebsite(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPost {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Validate request body
		var req helpers.AddWebsiteRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateAddWebsiteRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		// Add website
		repo := repository.New(pool)
		website, err := repo.AddWebsite(r.Context(), repository.AddWebsiteParams{
			UserID: uuid.MustParse(userID),
			Name:   req.Name,
			Domain: req.Domain,
		})
		if err != nil {
			helpers.ApiError(w, 200, "Failed to add website")
			return
		}

		res := helpers.AddWebsiteResponse{
			ID:        website.ID,
			Name:      website.Name,
			Domain:    website.Domain,
			CreatedAt: website.CreatedAt,
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusCreated, "Website added successfully", res)
	}
}

// Get Websites Handler
func GetWebsites(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodGet {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		// Get websites by user ID
		repo := repository.New(pool)
		websites, err := repo.GetWebsitesByUserID(r.Context(), uuid.MustParse(userID))
		if err != nil {
			helpers.ApiError(w, 200, "Failed to get websites")
			return
		}

		res := []helpers.GetWebsitesResponse{}
		for _, website := range websites {
			res = append(res, helpers.GetWebsitesResponse{
				ID:        website.ID,
				Name:      website.Name,
				Domain:    website.Domain,
				CreatedAt: website.CreatedAt,
			})
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Websites fetched successfully", res)
	}
}

// Get Website By ID Handler
func GetWebsiteByID(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodGet {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Get website ID from path
		websiteID, err := uuid.Parse(r.PathValue("id"))
		if err != nil {
			helpers.ApiError(w, 200, "Invalid website ID")
			return
		}

		repo := repository.New(pool)
		website, err := repo.GetWebsiteByID(r.Context(), websiteID)
		if err != nil {
			helpers.ApiError(w, 200, "Website not found")
			return
		}

		if !website.IsPublic {
			// Get user from context
			userID, ok := r.Context().Value(middleware.ContextUserID).(string)
			if !ok {
				helpers.ApiError(w, 200, "Unauthorized")
				return
			}
			// Verify the website exists and belongs to the user
			if website.UserID.String() != userID {
				helpers.ApiError(w, http.StatusForbidden, "Forbidden")
				return
			}
		}

		res := helpers.GetWebsiteByIDResponse{
			ID:        website.ID,
			Name:      website.Name,
			Domain:    website.Domain,
			CreatedAt: website.CreatedAt,
			IsPublic:  website.IsPublic,
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Website fetched successfully", res)
	}
}

// Delete Website By ID Handler
func DeleteWebsite(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodDelete {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
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

		// Delete website
		err = repo.DeleteWebsiteByID(r.Context(), websiteID)
		if err != nil {
			helpers.ApiError(w, 200, "Failed to delete website")
			return
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Website deleted successfully", nil)
	}
}

// Update Website By ID Handler
func UpdateWebsite(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPut {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		typeStr := r.URL.Query().Get("type")
		if typeStr == "" {
			helpers.ApiError(w, 200, "type is required")
			return
		}

		if typeStr != "details" && typeStr != "is_public" {
			helpers.ApiError(w, 200, "Invalid type")
			return
		}

		if typeStr == "details" {
			var req helpers.UpdateWebsiteDetailsRequest
			// Validate request body
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				helpers.ApiError(w, 200, "Invalid request body")
				return
			}

			// Validate request body fields
			if err := helpers.ValidateUpdateWebsiteDetailsRequest(req); err != nil {
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

			// Update website
			err = repo.UpdateWebsiteByID(r.Context(), repository.UpdateWebsiteByIDParams{
				ID:     websiteID,
				Name:   req.Name,
				Domain: req.Domain,
			})
			if err != nil {
				helpers.ApiError(w, 200, "Failed to update website")
				return
			}
		}
		if typeStr == "is_public" {
			var req helpers.UpdateWebsiteIsPublicRequest
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				helpers.ApiError(w, 200, "Invalid request body")
				return
			}
			if err := helpers.ValidateUpdateWebsiteIsPublicRequest(req); err != nil {
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

			// Update website
			err = repo.UpdateWebsiteIsPublicByID(r.Context(), repository.UpdateWebsiteIsPublicByIDParams{
				ID:       websiteID,
				IsPublic: *req.IsPublic,
			})
			if err != nil {
				helpers.ApiError(w, 200, "Failed to update website")
				return
			}
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "Website updated successfully", nil)
	}
}
