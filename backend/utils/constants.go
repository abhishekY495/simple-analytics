package utils

import "time"

const AccessTokenExpiresIn = time.Hour * 1       // 1 hour
const RefreshTokenExpiresIn = time.Hour * 24 * 7 // 7 days

var IP_ADDRESS_HEADERS = []string{
	"true-client-ip",            // CDN
	"cf-connecting-ip",          // Cloudflare
	"fastly-client-ip",          // Fastly
	"x-nf-client-connection-ip", // Netlify
	"do-connecting-ip",          // Digital Ocean
	"x-real-ip",                 // Reverse proxy
	"x-appengine-user-ip",       // Google App Engine
	"x-forwarded-for",
	"forwarded",
	"x-client-ip",
	"x-cluster-client-ip",
	"x-forwarded",
}
