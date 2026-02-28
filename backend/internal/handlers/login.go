package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
	"github.com/abhishekY495/simple-analytics/backend/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			helpers.SendError(w, http.StatusMethodNotAllowed, "Method not allowed")
			return
		}

		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			helpers.SendError(w, 200, "Invalid request body")
			return
		}

		req.Email = strings.TrimSpace(req.Email)

		if req.Email == "" || req.Password == "" {
			helpers.SendError(w, 200, "email and password are required")
			return
		}

		var user models.User
		err := pool.QueryRow(
			context.Background(),
			`SELECT * FROM users WHERE email = $1`,
			req.Email,
		).Scan(&user.Id, &user.FullName, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			helpers.SendError(w, 200, "Invalid email or password")
			return
		}

		if !helpers.VerifyPassword(req.Password, user.Password) {
			helpers.SendError(w, 200, "Invalid email or password")
			return
		}

		user.Password = ""
		helpers.SendSuccess(w, http.StatusOK, "Login successful", user)
	}
}
