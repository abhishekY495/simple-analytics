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

type JwtClaims struct {
	Id    string
	Email string
}

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

func ValidateJwtToken(tokenString string, secret string) (*JwtClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, jwt.ErrSignatureInvalid
	}

	id, ok := claims["id"].(string)
	if !ok {
		return nil, jwt.ErrSignatureInvalid
	}
	email, ok := claims["email"].(string)
	if !ok {
		return nil, jwt.ErrSignatureInvalid
	}

	return &JwtClaims{Id: id, Email: email}, nil
}
