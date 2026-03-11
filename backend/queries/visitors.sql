-- name: AddVisitor :one
INSERT INTO visitors (website_id, visitor_hash, country)
VALUES ($1, $2, $3)
RETURNING id, website_id, visitor_hash, country, first_seen, last_seen;