package server

import (
	"net/http"

	"github.com/abhishekY495/simple-analytics/backend/internal/handlers"
)

func NewRouter() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/", handlers.Root)
	mux.HandleFunc("/health", handlers.Health)

	return mux
}
