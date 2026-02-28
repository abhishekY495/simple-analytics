package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SignupRequest struct {
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Signup(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		var req SignupRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		req.FullName = strings.TrimSpace(req.FullName)
		req.Email = strings.TrimSpace(req.Email)

		if req.FullName == "" || req.Email == "" || req.Password == "" {
			helpers.ApiError(w, 200, "full_name, email, and password are required")
			return
		}
		if !helpers.ValidateEmail(req.Email) {
			helpers.ApiError(w, 200, "Invalid email")
			return
		}
		if len(req.Password) < 6 {
			helpers.ApiError(w, 200, "password must be at least 6 characters")
			return
		}

		hashedPassword, err := helpers.HashPassword(req.Password)
		if err != nil {
			helpers.ApiError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

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
		helpers.ApiSuccess(w, http.StatusCreated, "User created successfully", user)
	}
}
