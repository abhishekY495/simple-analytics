package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
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
			helpers.SendError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		var req SignupRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.SendError(w, 200, "Invalid request body")
			return
		}

		req.FullName = strings.TrimSpace(req.FullName)
		req.Email = strings.TrimSpace(req.Email)

		if req.FullName == "" || req.Email == "" || req.Password == "" {
			helpers.SendError(w, 200, "full_name, email, and password are required")
			return
		}
		if len(req.Password) < 6 {
			helpers.SendError(w, 200, "password must be at least 6 characters")
			return
		}

		hashedPassword, err := helpers.HashPassword(req.Password)
		if err != nil {
			helpers.SendError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		_, err = pool.Exec(
			context.Background(),
			`INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3)`,
			req.FullName, req.Email, hashedPassword,
		)
		if err != nil {
			if strings.Contains(err.Error(), "unique") {
				helpers.SendError(w, 200, "Email already in use")
				return
			}
			helpers.SendError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		helpers.SendSuccess(w, http.StatusCreated, "User created successfully", nil)
	}
}
