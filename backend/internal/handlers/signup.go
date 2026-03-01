package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/abhishekY495/simple-analytics/backend/utils"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SignupResponse struct {
	Id          uuid.UUID `json:"id"`
	FullName    string    `json:"full_name"`
	Email       string    `json:"email"`
	AccessToken string    `json:"access_token"`
}

func Signup(pool *pgxpool.Pool, cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate request method
		if r.Method != http.MethodPost {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		// Validate request body
		var req helpers.SignupRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		// Validate request body fields
		if err := helpers.ValidateSignupRequest(req); err != nil {
			helpers.ApiError(w, 200, err.Error())
			return
		}

		// Hash password
		hashedPassword, err := helpers.HashPassword(req.Password)
		if err != nil {
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Create user
		repo := repository.New(pool)
		user, err := repo.CreateUser(r.Context(), repository.CreateUserParams{
			FullName: req.FullName,
			Email:    req.Email,
			Password: hashedPassword,
		})
		if err != nil {
			if strings.Contains(err.Error(), "unique") {
				helpers.ApiError(w, 200, "Email already in use")
				return
			}
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
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
			Path:     "/auth/refresh",
			MaxAge:   int(utils.RefreshTokenExpiresIn.Seconds()),
		})

		// Return response
		res := SignupResponse{
			Id:          user.ID,
			FullName:    user.FullName,
			Email:       user.Email,
			AccessToken: accessToken,
		}
		helpers.ApiSuccess(w, http.StatusCreated, "User created successfully", res)
	}
}
