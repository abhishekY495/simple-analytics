package helpers

import (
	"crypto/sha256"
	"encoding/hex"
	"net"
	"net/http"
	"net/netip"
	"strings"
	"time"

	"github.com/abhishekY495/simple-analytics/backend/utils"
	"github.com/google/uuid"
)

func GenerateVisitorHash(websiteID uuid.UUID, userAgent string) (string, error) {
	hash := sha256.Sum256([]byte(websiteID.String() + userAgent))
	return hex.EncodeToString(hash[:]), nil
}

func GetCountryFromIP(ip string) string {
	addr, err := netip.ParseAddr(ip)
	if err != nil {
		return "unknown"
	}

	record, err := GeoDB.Country(addr)
	if err != nil || record.Country.ISOCode == "" {
		return "unknown"
	}

	return record.Country.ISOCode
}

func GetDeviceInfo(userAgent string) (string, string, string) {
	agent := UaParser.Parse(userAgent)

	browser := agent.Browser().String()
	os := agent.OS().String()
	deviceType := agent.Device().String()

	if browser == "" {
		browser = "unknown"
	}
	if os == "" {
		os = "unknown"
	}
	if deviceType == "" {
		deviceType = "unknown"
	}

	return browser, os, deviceType

}

func GetIPFromRequest(r *http.Request) string {
	// Check known headers in order
	for _, header := range utils.IP_ADDRESS_HEADERS {
		value := strings.TrimSpace(r.Header.Get(header))
		if value == "" {
			continue
		}

		var candidate string

		// Forwarded headers can contain multiple IPs: take the first
		if strings.EqualFold(header, "x-forwarded-for") ||
			strings.EqualFold(header, "forwarded") ||
			strings.EqualFold(header, "x-forwarded") {
			parts := strings.SplitSeq(value, ",")
			for part := range parts {
				ip := strings.TrimSpace(part)
				if ip != "" {
					candidate = ip
					break
				}
			}
		} else {
			candidate = value
		}

		if candidate == "" {
			continue
		}

		// Only accept if it parses as a valid IP
		if _, err := netip.ParseAddr(candidate); err == nil {
			return candidate
		}
	}

	// Fallback to RemoteAddr if it's a valid IP:port
	if host, _, err := net.SplitHostPort(r.RemoteAddr); err == nil && host != "" {
		if _, err := netip.ParseAddr(host); err == nil {
			return host
		}
	}

	// If nothing valid found, explicitly return "unknown"
	return "unknown"
}

func GetBucketSize(start, end time.Time) string {
	diff := end.Sub(start)
	switch {
	case diff <= 48*time.Hour:
		return "hour" // last 24h, or custom <= 2 days
	case diff <= 90*24*time.Hour:
		return "day" // last 7/30/90 days, this week, this month
	default:
		return "month" // this year
	}
}
