package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SignupResponse struct {
	Id       uuid.UUID `json:"id"`
	FullName string    `json:"full_name"`
	Email    string    `json:"email"`
	Token    string    `json:"token"`
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
			helpers.ApiError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		// Create user
		repo := repository.New(pool)
		user, err := repo.CreateUser(context.Background(), repository.CreateUserParams{
			FullName: req.FullName,
			Email:    req.Email,
			Password: hashedPassword,
		})
		if err != nil {
			if strings.Contains(err.Error(), "unique") {
				helpers.ApiError(w, 200, "Email already in use")
				return
			}
			helpers.ApiError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		// Generate JWT token
		token, err := helpers.GenerateJwtToken(user.ID.String(), user.Email, cfg.JwtSecret, time.Hour*24)
		if err != nil {
			helpers.ApiError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		// Return response
		res := SignupResponse{
			Id:       user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Token:    token,
		}
		helpers.ApiSuccess(w, http.StatusCreated, "User created successfully", res)
	}
}
