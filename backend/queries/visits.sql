-- name: AddVisit :one
INSERT INTO visits (website_id, visitor_id, referrer)
VALUES ($1, $2, $3)
RETURNING id, website_id, visitor_id, referrer, started_at, ended_at;