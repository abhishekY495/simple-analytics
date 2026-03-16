package helpers

import (
	"errors"
	"strings"
	"time"
)

// Collect Analytics
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

// Heartbeat
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

// Get Metrics
func ValidateGetMetricsRequest(startDate, endDate string) error {
	startDate = strings.TrimSpace(startDate)
	endDate = strings.TrimSpace(endDate)

	if startDate == "" {
		return errors.New("start_date is required")
	}
	if endDate == "" {
		return errors.New("end_date is required")
	}
	return nil
}

func ValidateGetMetricsDateRange(startDate, endDate time.Time) error {
	if startDate.After(endDate) {
		return errors.New("invalid date range")
	}
	return nil
}

type GetMetricsResponse struct {
	TotalVisitors        int64 `json:"total_visitors"`
	TotalVisits          int64 `json:"total_visits"`
	TotalViews           int64 `json:"total_views"`
	AvgVisitDuration     int32 `json:"avg_visit_duration"`
	PrevTotalVisitors    int64 `json:"prev_total_visitors"`
	PrevTotalVisits      int64 `json:"prev_total_visits"`
	PrevTotalViews       int64 `json:"prev_total_views"`
	PrevAvgVisitDuration int32 `json:"prev_avg_visit_duration"`
}
