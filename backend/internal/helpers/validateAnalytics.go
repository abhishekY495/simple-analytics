package helpers

import (
	"errors"
	"strings"
	"time"
)

type CollectAnalyticsRequest struct {
	VisitID   string `json:"visit_id"`
	Path      string `json:"path"`
	Referrer  string `json:"referrer"`
	UserAgent string `json:"user_agent"`
}

type CollectAnalyticsResponse struct {
	VisitID string `json:"visit_id"`
}

func ValidateCollectAnalyticsRequest(req CollectAnalyticsRequest) error {
	req.VisitID = strings.TrimSpace(req.VisitID)
	req.Path = strings.TrimSpace(req.Path)
	req.Referrer = strings.TrimSpace(req.Referrer)
	req.UserAgent = strings.TrimSpace(req.UserAgent)

	if req.Path == "" {
		return errors.New("path is required")
	}
	if req.Referrer == "" {
		return errors.New("referrer is required")
	}
	if req.UserAgent == "" {
		return errors.New("user_agent is required")
	}
	return nil
}

type HeartbeatRequest struct {
	VisitID string `json:"visit_id"`
}

func ValidateHeartbeatRequest(req HeartbeatRequest) error {
	req.VisitID = strings.TrimSpace(req.VisitID)

	if req.VisitID == "" {
		return errors.New("visit_id is required")
	}
	return nil
}

type GetMetricsRequest struct {
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

func ValidateGetMetricsRequest(req GetMetricsRequest) error {
	if req.StartDate.IsZero() {
		return errors.New("start_date is required")
	}
	if req.EndDate.IsZero() {
		return errors.New("end_date is required")
	}
	return nil
}

type GetChartDataRequest struct {
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

func ValidateGetChartDataRequest(req GetChartDataRequest) error {
	if req.StartDate.IsZero() {
		return errors.New("start_date is required")
	}
	if req.EndDate.IsZero() {
		return errors.New("end_date is required")
	}
	return nil
}
