package server

import (
	"net/http"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/handlers"
	"github.com/abhishekY495/simple-analytics/backend/internal/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewRouter(pool *pgxpool.Pool, cfg config.Config) *http.ServeMux {
	mux := http.NewServeMux()
	auth := middleware.AuthMiddleware(cfg)

	mux.HandleFunc("/", handlers.Root)
	mux.HandleFunc("/health", handlers.Health)

	// Auth routes
	mux.HandleFunc("/auth/signup", handlers.Signup(pool, cfg))
	mux.HandleFunc("/auth/login", handlers.Login(pool, cfg))
	mux.HandleFunc("/auth/logout", handlers.Logout(pool, cfg))
	mux.HandleFunc("/auth/refresh-token", handlers.RefreshToken(pool, cfg))

	// Protected routes

	// Websites routes
	mux.Handle("POST /websites", auth(handlers.AddWebsite(pool, cfg)))
	mux.Handle("GET /websites", auth(handlers.GetWebsites(pool, cfg)))
	mux.Handle("GET /websites/{id}", auth(handlers.GetWebsiteByID(pool, cfg)))
	mux.Handle("PUT /websites/{id}", auth(handlers.UpdateWebsite(pool, cfg)))
	mux.Handle("DELETE /websites/{id}", auth(handlers.DeleteWebsite(pool, cfg)))

	// Account settings routes
	mux.Handle("PUT /account/full-name", auth(handlers.UpdateUserFullName(pool, cfg)))
	mux.Handle("PUT /account/email", auth(handlers.UpdateUserEmail(pool, cfg)))
	mux.Handle("PUT /account/password", auth(handlers.UpdateUserPassword(pool, cfg)))
	mux.Handle("DELETE /account", auth(handlers.DeleteUser(pool, cfg)))

	// Analytics routes
	// CORS only for analytics collection endpoint
	mux.Handle("OPTIONS /analytics/{id}", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusNoContent)
	}))

	mux.Handle("POST /analytics/{id}", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		handlers.CollectAnalytics(pool, cfg).ServeHTTP(w, r)
	}))

	mux.Handle("POST /analytics/heartbeat", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		handlers.Heartbeat(pool, cfg).ServeHTTP(w, r)
	}))

	return mux
}
