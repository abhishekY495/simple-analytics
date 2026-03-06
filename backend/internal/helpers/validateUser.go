package helpers

import (
	"errors"
	"strings"
)

// Update Full Name Request and Response
type UpdateFullNameRequest struct {
	FullName string `json:"full_name"`
}

func ValidateUpdateFullNameRequest(req UpdateFullNameRequest) error {
	req.FullName = strings.TrimSpace(req.FullName)

	if req.FullName == "" {
		return errors.New("full_name is required")
	}

	return nil
}

// Update Email Request and Response
type UpdateEmailRequest struct {
	Email string `json:"email"`
}

func ValidateUpdateEmailRequest(req UpdateEmailRequest) error {
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.Email == "" {
		return errors.New("email is required")
	}

	if !ValidateEmail(req.Email) {
		return errors.New("invalid email")
	}

	return nil
}

// Update Password Request and Response
type UpdatePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
}

func ValidateUpdatePasswordRequest(req UpdatePasswordRequest) error {
	req.CurrentPassword = strings.TrimSpace(req.CurrentPassword)
	req.NewPassword = strings.TrimSpace(req.NewPassword)

	if req.CurrentPassword == "" || req.NewPassword == "" {
		return errors.New("current_password and new_password are required")
	}

	if len(req.NewPassword) < 6 {
		return errors.New("Password must be at least 6 characters")
	}

	return nil
}

// Delete User Request and Response
type DeleteUserRequest struct {
	Delete string `json:"delete"`
}

func ValidateDeleteUserRequest(req DeleteUserRequest) error {
	req.Delete = strings.TrimSpace(req.Delete)

	if req.Delete == "" {
		return errors.New("delete is required")
	}

	if req.Delete != "DELETE" {
		return errors.New("delete must be DELETE")
	}

	return nil
}
