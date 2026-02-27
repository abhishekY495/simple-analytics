package db

import (
	"context"
	"log"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(cfg config.Config) (*pgxpool.Pool, error) {
	ctx := context.Background()

	// Connect to the database
	pool, err := pgxpool.New(ctx, cfg.DatabaseUrl)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	log.Println("Connection established")
	return pool, nil
}
