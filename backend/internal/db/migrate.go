package db

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func SyncSchema(pool *pgxpool.Pool) {
	sqlBytes, err := os.ReadFile("schema/schema.sql")
	if err != nil {
		log.Fatalf("Could not read schema file: %v", err)
	}

	_, err = pool.Exec(context.Background(), string(sqlBytes))
	if err != nil {
		log.Fatalf("Schema sync failed: %v", err)
	}

	log.Println("Schema synced successfully")
}
