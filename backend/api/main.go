package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/db"
	"github.com/abhishekY495/simple-analytics/backend/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("env error: %v", err)
	}

	pool, err := db.Connect(cfg)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer pool.Close()

	router := server.NewRouter()
	addr := fmt.Sprintf(":%s", cfg.Port)

	log.Printf("Starting server on http://localhost%s\n", addr)

	err = http.ListenAndServe(addr, router)
	if err != nil {
		log.Fatalf("Error starting server: %v\n", err)
	}
}
