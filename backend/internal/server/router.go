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
	mux.Handle("POST /websites", auth(handlers.AddWebsite(pool, cfg)))
	mux.Handle("GET /websites", auth(handlers.GetWebsites(pool, cfg)))
	mux.Handle("DELETE /websites/{id}", auth(handlers.DeleteWebsite(pool, cfg)))
	mux.Handle("GET /websites/{id}", auth(handlers.GetWebsiteByID(pool, cfg)))
	mux.Handle("PUT /websites/{id}", auth(handlers.UpdateWebsite(pool, cfg)))

	return mux
}
