package helpers

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/utils"
	"github.com/golang-jwt/jwt"
)

func GenerateJwtToken(id string, email string, secret string) (string, string, string, error) {
	// Access Token
	claims := jwt.MapClaims{
		"id":    id,
		"email": email,
		"exp":   time.Now().Add(utils.AccessTokenExpiresIn).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	accessToken, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", "", "", err
	}

	// Refresh Token
	b := make([]byte, 32) // 256-bit token
	_, err = rand.Read(b)
	if err != nil {
		return "", "", "", err
	}

	refreshToken := base64.URLEncoding.EncodeToString(b)

	// Hash Refresh Token (for DB storage)
	hash := sha256.Sum256([]byte(refreshToken))
	hashedRefreshToken := hex.EncodeToString(hash[:])

	return accessToken, refreshToken, hashedRefreshToken, nil
}
