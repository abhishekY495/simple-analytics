package helpers

import (
	"errors"
	"strings"

	"github.com/google/uuid"
)

// Signup Request and Response

type SignupRequest struct {
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignupResponse struct {
	Id          uuid.UUID `json:"id"`
	FullName    string    `json:"full_name"`
	Email       string    `json:"email"`
	AccessToken string    `json:"access_token"`
}

func ValidateSignupRequest(req SignupRequest) error {
	req.FullName = strings.TrimSpace(req.FullName)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.FullName == "" || req.Email == "" || req.Password == "" {
		return errors.New("full_name, email, and password are required")
	}
	if !ValidateEmail(req.Email) {
		return errors.New("invalid email")
	}
	if len(req.Password) < 6 {
		return errors.New("password must be at least 6 characters")
	}
	return nil
}

// Login Request and Response

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Id          uuid.UUID `json:"id"`
	FullName    string    `json:"full_name"`
	Email       string    `json:"email"`
	AccessToken string    `json:"access_token"`
}

func ValidateLoginRequest(req LoginRequest) error {
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.Email == "" || req.Password == "" {
		return errors.New("email and password are required")
	}
	if !ValidateEmail(req.Email) {
		return errors.New("invalid email")
	}
	return nil
}

// Refresh Token Response
type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}
