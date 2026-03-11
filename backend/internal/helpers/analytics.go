package helpers

import (
	"crypto/sha256"
	"encoding/hex"
	"net/netip"

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
