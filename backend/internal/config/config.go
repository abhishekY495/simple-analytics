package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseUrl string
	JwtSecret   string
	IsDev       bool
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
	jwtSecret, err := extractEnv("JWT_SECRET")
	if err != nil {
		return Config{}, err
	}
	isDev, err := extractEnv("IS_DEV")
	if err != nil {
		return Config{}, err
	}
	isDevBool, err := strconv.ParseBool(isDev)
	if err != nil {
		return Config{}, err
	}

	return Config{
		Port:        port,
		DatabaseUrl: databaseUrl,
		JwtSecret:   jwtSecret,
		IsDev:       isDevBool,
	}, nil
}

func extractEnv(key string) (string, error) {
	val := os.Getenv(key)
	if val == "" {
		return "", fmt.Errorf("environment variable %s not found", key)
	}
	return val, nil
}
