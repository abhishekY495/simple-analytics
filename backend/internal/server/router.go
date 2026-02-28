package server

import (
	"net/http"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/handlers"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewRouter(pool *pgxpool.Pool, cfg config.Config) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/", handlers.Root)
	mux.HandleFunc("/health", handlers.Health)

	// Auth routes
	mux.HandleFunc("/signup", handlers.Signup(pool, cfg))
	mux.HandleFunc("/login", handlers.Login(pool, cfg))

	return mux
}
