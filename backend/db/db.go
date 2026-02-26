package db

import (
	"context"
	"fmt"
	"os"

	"github.com/abhishekY495/simple-analytics/backend/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(cfg config.Config) (*pgxpool.Pool, error) {
	ctx := context.Background()

	// Connect to the database
	pool, err := pgxpool.New(ctx, cfg.DatabaseUrl)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Connection established")
	return pool, nil
}
