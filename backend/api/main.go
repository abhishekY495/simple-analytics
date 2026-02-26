package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/abhishekY495/simple-analytics/backend/db"
	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/go-chi/chi/v5"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "env error: %v\n", err)
		os.Exit(1)
	}

	pool, err := db.Connect(cfg)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error connecting to database: %v\n", err)
		os.Exit(1)
	}
	defer pool.Close()

	r := chi.NewRouter()

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World"))
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		response := map[string]string{
			"status": "All Gooda",
		}

		json.NewEncoder(w).Encode(response)
	})

	log.Println("Server running on :" + cfg.Port)
	http.ListenAndServe(":"+cfg.Port, r)
}
