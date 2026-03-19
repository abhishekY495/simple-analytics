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

// Get Stats
func ValidateGetStatsRequest(startDate, endDate string) error {
	startDate = strings.TrimSpace(startDate)
	endDate = strings.TrimSpace(endDate)

	if startDate == "" {
		return errors.New("start is required")
	}
	if endDate == "" {
		return errors.New("end is required")
	}
	return nil
}

func ValidateGetStatsDateRange(startDate, endDate time.Time) error {
	if startDate.After(endDate) {
		return errors.New("invalid date range")
	}
	return nil
}

type GetStatsResponse struct {
	TotalVisitors        int64 `json:"total_visitors"`
	TotalVisits          int64 `json:"total_visits"`
	TotalViews           int64 `json:"total_views"`
	AvgVisitDuration     int32 `json:"avg_visit_duration"`
	PrevTotalVisitors    int64 `json:"prev_total_visitors"`
	PrevTotalVisits      int64 `json:"prev_total_visits"`
	PrevTotalViews       int64 `json:"prev_total_views"`
	PrevAvgVisitDuration int32 `json:"prev_avg_visit_duration"`
}

// Get Chart Data
func ValidateGetChartDataRequest(startDate, endDate string) error {
	startDate = strings.TrimSpace(startDate)
	endDate = strings.TrimSpace(endDate)

	if startDate == "" {
		return errors.New("start is required")
	}
	if endDate == "" {
		return errors.New("end is required")
	}
	return nil
}

func ValidateGetChartDataDateRange(startDate, endDate time.Time) error {
	if startDate.After(endDate) {
		return errors.New("invalid date range")
	}
	return nil
}

type GetChartDataRow struct {
	Time     time.Time `json:"time"`
	Views    int64     `json:"views"`
	Visitors int64     `json:"visitors"`
}

// Get Analytics
func ValidateGetAnalyticsRequest(startDate, endDate, limit, typeStr string) error {
	startDate = strings.TrimSpace(startDate)
	endDate = strings.TrimSpace(endDate)
	limit = strings.TrimSpace(limit)
	typeStr = strings.TrimSpace(typeStr)

	if startDate == "" {
		return errors.New("start is required")
	}
	if endDate == "" {
		return errors.New("end is required")
	}
	if limit == "" {
		return errors.New("limit is required")
	}
	if typeStr == "" {
		return errors.New("type is required")
	}
	return nil
}

func ValidateGetAnalyticsDateRange(startDate, endDate time.Time) error {
	if startDate.After(endDate) {
		return errors.New("invalid date range")
	}
	return nil
}

// Get Page Visitors
type GetPageVisitorsRow struct {
	Path     string `json:"path"`
	Visitors int64  `json:"visitors"`
}

// Get Referrer Visitors
type GetReferrerVisitorsRow struct {
	Referrer string `json:"referrer"`
	Visitors int64  `json:"visitors"`
}

// Get Country Visitors
type GetCountryVisitorsRow struct {
	Country  string `json:"country"`
	Visitors int64  `json:"visitors"`
}
