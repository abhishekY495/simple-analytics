package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseUrl string
}

func Load() (Config, error) {
	// Try loading .env locally, ignored in production
	_ = godotenv.Load()

	databaseUrl, err := extractEnv("DATABASE_URL")
	if err != nil {
		return Config{}, err
	}
	port, err := extractEnv("PORT")
	if err != nil {
		return Config{}, err
	}

	return Config{
		Port:        port,
		DatabaseUrl: databaseUrl,
	}, nil
}

func extractEnv(key string) (string, error) {
	val := os.Getenv(key)
	if val == "" {
		return "", fmt.Errorf("environment variable %s not found", key)
	}
	return val, nil
}
