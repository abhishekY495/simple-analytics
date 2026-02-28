package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LoginResponse struct {
	Id       uuid.UUID `json:"id"`
	FullName string    `json:"full_name"`
	Email    string    `json:"email"`
	Token    string    `json:"token"`
}

func Login(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPost {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Validate request body
		var req helpers.LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateLoginRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Get user by email
		repo := repository.New(pool)
		user, err := repo.GetUserByEmail(context.Background(), req.Email)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid email or password")
			return
		}

		// Verify password
		if !helpers.VerifyPassword(req.Password, user.Password) {
			helpers.ApiError(w, 200, "Invalid email or password")
			return
		}

		// Generate JWT token
		tokenString, err := helpers.GenerateJwtToken(user.ID.String(), user.Email, cfg.JwtSecret, time.Hour*24)
		if err != nil {
			helpers.ApiError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		// Return response
		res := LoginResponse{
			Id:       user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Token:    tokenString,
		}
		helpers.ApiSuccess(w, http.StatusOK, "Login successful", res)
	}
}
