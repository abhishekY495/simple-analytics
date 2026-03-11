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

func UpdateUserFullName(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPut {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Validate request body
		var req helpers.UpdateFullNameRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateUpdateFullNameRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		repo := repository.New(pool)
		user, err := repo.GetUserByID(r.Context(), uuid.MustParse(userID))
		if err != nil {
			helpers.ApiError(w, 200, "User not found")
			return
		}

		// Update user full name
		err = repo.UpdateFullName(r.Context(), repository.UpdateFullNameParams{
			FullName: req.FullName,
			ID:       user.ID,
		})
		if err != nil {
			helpers.ApiError(w, 200, "Failed to update user full name")
			return
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "full name updated successfully", nil)
	}
}

func UpdateUserEmail(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPut {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Validate request body
		var req helpers.UpdateEmailRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateUpdateEmailRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		repo := repository.New(pool)
		user, err := repo.GetUserByID(r.Context(), uuid.MustParse(userID))
		if err != nil {
			helpers.ApiError(w, 200, "User not found")
			return
		}

		// Check if email already exists
		emailExists, err := repo.CheckEmailExists(r.Context(), req.Email)
		if err != nil {
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}
		if emailExists > 0 {
			helpers.ApiError(w, 200, "Email already in use")
			return
		}

		// Update user email
		err = repo.UpdateEmail(r.Context(), repository.UpdateEmailParams{
			Email: req.Email,
			ID:    user.ID,
		})
		if err != nil {
			helpers.ApiError(w, 200, "Failed to update user email")
			return
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "email updated successfully", nil)
	}
}

func UpdateUserPassword(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPut {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Validate request body
		var req helpers.UpdatePasswordRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateUpdatePasswordRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		repo := repository.New(pool)
		user, err := repo.GetUserByID(r.Context(), uuid.MustParse(userID))
		if err != nil {
			helpers.ApiError(w, 200, "User not found")
			return
		}

		// Verify old password
		if !helpers.VerifyPassword(req.CurrentPassword, user.Password) {
			helpers.ApiError(w, 200, "Invalid current password")
			return
		}

		// Hash new password
		hashedPassword, err := helpers.HashPassword(req.NewPassword)
		if err != nil {
			helpers.ApiError(w, 200, "Failed to hash new password")
			return
		}

		// Update user password
		err = repo.UpdatePassword(r.Context(), repository.UpdatePasswordParams{
			Password: hashedPassword,
			ID:       user.ID,
		})
		if err != nil {
			helpers.ApiError(w, 200, "Failed to update user password")
			return
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "password updated successfully", nil)
	}
}

func DeleteUser(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodDelete {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Validate request body
		var req helpers.DeleteUserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateDeleteUserRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Get user from context
		userID, ok := r.Context().Value(middleware.ContextUserID).(string)
		if !ok {
			helpers.ApiError(w, 200, "Unauthorized")
			return
		}

		repo := repository.New(pool)
		user, err := repo.GetUserByID(r.Context(), uuid.MustParse(userID))
		if err != nil {
			helpers.ApiError(w, 200, "User not found")
			return
		}

		// Delete user
		err = repo.DeleteUser(r.Context(), user.ID)
		if err != nil {
			helpers.ApiError(w, 200, "Failed to delete user")
			return
		}

		// Return response
		helpers.ApiSuccess(w, http.StatusOK, "user deleted successfully", nil)
	}
}
