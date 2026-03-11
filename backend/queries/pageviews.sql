-- name: AddPageview :one
INSERT INTO pageviews (website_id, visitor_id, visit_id, path, referrer, browser, os, device_type, country)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id, website_id, visitor_id, visit_id, path, referrer, browser, os, device_type, country, created_at;