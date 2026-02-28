package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Id        uuid.UUID `json:"id"`
	FullName  string    `json:"full_name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func Login(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			helpers.ApiError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.ApiError(w, 200, "Invalid request body")
			return
		}

		req.Email = strings.TrimSpace(req.Email)

		if req.Email == "" || req.Password == "" {
			helpers.ApiError(w, 200, "email and password are required")
			return
		}
		if !helpers.ValidateEmail(req.Email) {
			helpers.ApiError(w, 200, "Invalid email")
			return
		}

		repo := repository.New(pool)
		user, err := repo.GetUserByEmail(context.Background(), req.Email)
		if err != nil {
			helpers.ApiError(w, 200, "Invalid email or password")
			return
		}

		if !helpers.VerifyPassword(req.Password, user.Password) {
			helpers.ApiError(w, 200, "Invalid email or password")
			return
		}

		res := LoginResponse{
			Id:        user.ID,
			FullName:  user.FullName,
			Email:     user.Email,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		}
		helpers.ApiSuccess(w, http.StatusOK, "Login successful", res)
	}
}
