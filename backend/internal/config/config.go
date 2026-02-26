package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort  string
	DatabaseUrl string
}

func LoadConfig() (Config, error) {
	err := godotenv.Load()
	if err != nil {
		return Config{}, fmt.Errorf("Failed to load .env")
	}

	databaseUrl, err := extractEnv("DATABASE_URL")
	if err != nil {
		return Config{}, err
	}
	serverPort, err := extractEnv("SERVER_PORT")
	if err != nil {
		return Config{}, err
	}

	return Config{
		ServerPort:  serverPort,
		DatabaseUrl: databaseUrl,
	}, nil
}

func extractEnv(key string) (string, error) {
	val := os.Getenv(key)
	if val == "" {
		return "", fmt.Errorf("requested env not found")
	}
	return val, nil
}
