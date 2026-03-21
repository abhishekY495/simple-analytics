package helpers

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
)

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

type GetWebsitesResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Domain    string    `json:"domain"`
	CreatedAt time.Time `json:"created_at"`
}

type GetWebsiteByIDResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Domain    string    `json:"domain"`
	CreatedAt time.Time `json:"created_at"`
	IsPublic  bool      `json:"is_public"`
}

type UpdateWebsiteRequest struct {
	Name   string `json:"name"`
	Domain string `json:"domain"`
}

type UpdateWebsiteResponse struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Domain    string    `json:"domain"`
	CreatedAt time.Time `json:"created_at"`
}

func ValidateUpdateWebsiteRequest(req UpdateWebsiteRequest) error {
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
