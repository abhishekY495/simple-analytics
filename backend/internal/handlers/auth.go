package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/abhishekY495/simple-analytics/backend/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

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
			Path:     "/",
			MaxAge:   int(utils.RefreshTokenExpiresIn.Seconds()),
		})

		// Return response
		res := helpers.SignupResponse{
			Id:          user.ID,
			FullName:    user.FullName,
			Email:       user.Email,
			AccessToken: accessToken,
		}
		helpers.ApiSuccess(w, http.StatusCreated, "User created successfully", res)
	}
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
			Path:     "/",
			MaxAge:   int(utils.RefreshTokenExpiresIn.Seconds()),
		})

		res := helpers.LoginResponse{
			Id:          user.ID,
			FullName:    user.FullName,
			Email:       user.Email,
			AccessToken: accessToken,
		}
		helpers.ApiSuccess(w, http.StatusOK, "Login successful", res)
	}
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

		// Generate new access token only — session and refresh token cookie are unchanged
		accessToken, _, _, err := helpers.GenerateJwtToken(user.ID.String(), user.Email, cfg.JwtSecret)
		if err != nil {
			errorMessage := "Internal server error: " + err.Error()
			helpers.ApiError(w, http.StatusInternalServerError, errorMessage)
			return
		}

		// Return new access token
		res := helpers.RefreshTokenResponse{
			AccessToken: accessToken,
		}
		helpers.ApiSuccess(w, http.StatusOK, "New access token generated", res)
	}
}
