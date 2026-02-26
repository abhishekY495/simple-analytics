package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	port        string
	DatabaseUrl string
}

func Load() (Config, error) {
	err := godotenv.Load()
	if err != nil {
		return Config{}, fmt.Errorf("error loading .env file: %w", err)
	}

	databaseUrl, err := extractEnv("DATABASE_URL")
	if err != nil {
		return Config{}, err
	}
	port, err := extractEnv("PORT")
	if err != nil {
		return Config{}, err
	}

	return Config{
		port:        port,
		DatabaseUrl: databaseUrl,
	}, nil
}

func extractEnv(key string) (string, error) {
	val := os.Getenv(key)
	if val == "" {
		return "", fmt.Errorf("environment variable %s not set", key)
	}
	return val, nil
}
