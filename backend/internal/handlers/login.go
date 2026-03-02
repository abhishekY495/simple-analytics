package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/abhishekY495/simple-analytics/backend/utils"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LoginResponse struct {
	Id          uuid.UUID `json:"id"`
	FullName    string    `json:"full_name"`
	Email       string    `json:"email"`
	AccessToken string    `json:"access_token"`
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
		user, err := repo.GetUserByEmail(r.Context(), req.Email)
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
		accessToken, refreshToken, hashedRefreshToken, err := helpers.GenerateJwtToken(user.ID.String(), user.Email, cfg.JwtSecret)
		if err != nil {
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Hashed Refresh token stored in DB
		_, err = repo.CreateSession(r.Context(), repository.CreateSessionParams{
			UserID:           user.ID,
			RefreshTokenHash: hashedRefreshToken,
			ExpiresAt:        time.Now().Add(utils.RefreshTokenExpiresIn),
		})
		if err != nil {
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Set refresh token as HttpOnly cookie
		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    refreshToken,
			HttpOnly: true,
			Secure:   !cfg.IsDev,
			SameSite: http.SameSiteStrictMode,
			Path:     "/auth/refresh-token",
			MaxAge:   int(utils.RefreshTokenExpiresIn.Seconds()),
		})

		res := LoginResponse{
			Id:          user.ID,
			FullName:    user.FullName,
			Email:       user.Email,
			AccessToken: accessToken,
		}
		helpers.ApiSuccess(w, http.StatusOK, "Login successful", res)
	}
}
