package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
)

type contextKey string

const (
	ContextUserID    contextKey = "userID"
	ContextUserEmail contextKey = "userEmail"
)

func AuthMiddleware(cfg config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get Authorization header
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				helpers.ApiError(w, http.StatusUnauthorized, "Missing or invalid Authorization header")
				return
			}

			// Get token string
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")

			// Validate JWT token
			claims, err := helpers.ValidateJwtToken(tokenString, cfg.JwtSecret)
			if err != nil {
				helpers.ApiError(w, http.StatusUnauthorized, "Invalid or expired token")
				return
			}

			// Add user details to context
			ctx := context.WithValue(r.Context(), ContextUserID, claims.Id)
			ctx = context.WithValue(ctx, ContextUserEmail, claims.Email)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
