package helpers

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
)

// Add Website
type AddWebsiteRequest struct {
	Name   string `json:"name"`
	Domain string `json:"domain"`
}
type AddWebsiteResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Domain    string    `json:"domain"`
	CreatedAt time.Time `json:"created_at"`
}

func ValidateAddWebsiteRequest(req AddWebsiteRequest) error {
	req.Name = strings.TrimSpace(req.Name)
	req.Domain = strings.TrimSpace(req.Domain)

	if req.Name == "" || req.Domain == "" {
		return errors.New("name and domain are required")
	}

	if !ValidateDomain(req.Domain) {
		return errors.New("invalid domain")
	}

	return nil
}

// Get Websites
type GetWebsitesResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Domain    string    `json:"domain"`
	CreatedAt time.Time `json:"created_at"`
}

// Get Website By ID
type GetWebsiteByIDResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Domain    string    `json:"domain"`
	CreatedAt time.Time `json:"created_at"`
	IsPublic  bool      `json:"is_public"`
}

// Update Website
type UpdateWebsiteDetailsRequest struct {
	Name   string `json:"name"`
	Domain string `json:"domain"`
}
type UpdateWebsiteDetailsResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Domain    string    `json:"domain"`
	CreatedAt time.Time `json:"created_at"`
}

func ValidateUpdateWebsiteDetailsRequest(req UpdateWebsiteDetailsRequest) error {
	req.Name = strings.TrimSpace(req.Name)
	req.Domain = strings.TrimSpace(req.Domain)

	if req.Name == "" || req.Domain == "" {
		return errors.New("name and domain are required")
	}

	if !ValidateDomain(req.Domain) {
		return errors.New("invalid domain")
	}

	return nil
}

// Update Website Is Public
type UpdateWebsiteIsPublicRequest struct {
	IsPublic *bool `json:"is_public"`
}

func ValidateUpdateWebsiteIsPublicRequest(req UpdateWebsiteIsPublicRequest) error {
	if req.IsPublic == nil {
		return errors.New("is_public is required and must be a boolean")
	}

	if *req.IsPublic != true && *req.IsPublic != false {
		return errors.New("is_public must be a boolean")
	}

	return nil
}
