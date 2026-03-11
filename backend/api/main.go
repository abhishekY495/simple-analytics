package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/abhishekY495/simple-analytics/backend/internal/db"
	"github.com/abhishekY495/simple-analytics/backend/internal/helpers"
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
	db.SyncSchema(pool)
	defer pool.Close()

	helpers.InitGeoDB("./GeoLite2-Country.mmdb")
	helpers.InitUaParser()

	router := server.NewRouter(pool, cfg)
	addr := fmt.Sprintf(":%s", cfg.Port)

	log.Printf("Starting server on %s", addr)

	err = http.ListenAndServe(addr, router)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
