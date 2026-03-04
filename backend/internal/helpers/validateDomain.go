package helpers

import (
	"regexp"
	"strings"
)

var domainRegex = regexp.MustCompile(`^(?:[a-zA-Z0-9][a-zA-Z0-9-]{0,62}\.)+[a-zA-Z]{2,63}$`)

func ValidateDomain(domain string) bool {
	if len(domain) < 1 || len(domain) > 253 {
		return false
	}
	if strings.HasPrefix(domain, "-") || strings.HasSuffix(domain, "-") {
		return false
	}
	return domainRegex.MatchString(domain)
}
