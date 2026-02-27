package db

import (
	"context"
	"log"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(cfg config.Config) (*pgxpool.Pool, error) {
	ctx := context.Background()
	config, err := pgxpool.ParseConfig(cfg.DatabaseUrl)

	if err != nil {
		log.Printf("Unable to parse database URL: %v", err)
		return nil, err
	}

	// Connect to the database
	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Printf("Unable to connect to database: %v", err)
		pool.Close()
		return nil, err
	}

	err = pool.Ping(ctx)
	if err != nil {
		log.Printf("Unable to ping database: %v", err)
		pool.Close()
		return nil, err
	}

	log.Println("Connection established")
	return pool, nil
}
