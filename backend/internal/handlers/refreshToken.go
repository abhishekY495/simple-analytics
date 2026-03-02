package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/abhishekY495/simple-analytics/backend/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

func RefreshToken(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPost {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Get refresh token from cookie
		cookie, err := r.Cookie("refresh_token")
		if err != nil {
			errorMessage := "Missing refresh token: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Hash refresh token
		hash := sha256.Sum256([]byte(cookie.Value))
		hashedRefreshToken := hex.EncodeToString(hash[:])

		// Get session by hashed refresh token
		repo := repository.New(pool)
		session, err := repo.GetSessionByToken(r.Context(), hashedRefreshToken)
		if err != nil {
			errorMessage := "Invalid refresh token: " + err.Error()
			helpers.ApiError(w, http.StatusUnauthorized, errorMessage)
			return
		}

		// Check if refresh token has expired
		if time.Now().After(session.ExpiresAt) {
			errorMessage := "Refresh token expired"
			helpers.ApiError(w, http.StatusUnauthorized, errorMessage)
			return
		}

		// Get user by ID
		userRepo := repository.New(pool)
		user, err := userRepo.GetUserByID(r.Context(), session.UserID)
		if err != nil {
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Generate new JWT token
		accessToken, refreshToken, hashedRefreshToken, err := helpers.GenerateJwtToken(user.ID.String(), user.Email, cfg.JwtSecret)
		if err != nil {
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Create new session
		_, err = userRepo.CreateSession(r.Context(), repository.CreateSessionParams{
			UserID:           user.ID,
			RefreshTokenHash: hashedRefreshToken,
			ExpiresAt:        time.Now().Add(utils.RefreshTokenExpiresIn),
		})
		if err != nil {
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Set new refresh token as HttpOnly cookie
		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    refreshToken,
			HttpOnly: true,
			Secure:   !cfg.IsDev,
			SameSite: http.SameSiteStrictMode,
			Path:     "/auth/refresh-token",
			MaxAge:   int(utils.RefreshTokenExpiresIn.Seconds()),
		})

		// Return new access token
		res := RefreshTokenResponse{
			AccessToken: accessToken,
		}
		helpers.ApiSuccess(w, http.StatusOK, "New access token generated", res)
	}
}
