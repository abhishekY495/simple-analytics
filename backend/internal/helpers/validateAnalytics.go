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
	Visitors                    int64 `json:"visitors"`
	Visits                      int64 `json:"visits"`
	Views                       int64 `json:"views"`
	AvgVisitDurationSeconds     any   `json:"avg_visit_duration_seconds"`
	PrevVisitors                int64 `json:"prev_visitors"`
	PrevVisits                  int64 `json:"prev_visits"`
	PrevViews                   int64 `json:"prev_views"`
	PrevAvgVisitDurationSeconds any   `json:"prev_avg_visit_duration_seconds"`
}

// Get Chart Data
type ChartDataPoint struct {
	PeriodStart any   `json:"period_start"`
	Visitors    int64 `json:"visitors"`
	Views       int64 `json:"views"`
}

func ValidateGetChartDataRequest(startDate, endDate string) error {
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

func ValidateGetChartDataDateRange(startDate, endDate time.Time) error {
	if startDate.After(endDate) {
		return errors.New("invalid date range")
	}
	return nil
}

type GetChartDataResponse struct {
	Visitors int64    `json:"visitors"`
	Views    []int64  `json:"views"`
	Dates    []string `json:"dates"`
}
