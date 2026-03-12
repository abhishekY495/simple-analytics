-- name: AddVisitor :one
INSERT INTO visitors (website_id, visitor_hash, country)
VALUES ($1, $2, $3)
RETURNING id, website_id, visitor_hash, country, first_seen, last_seen;

-- name: GetVisitorByHash :one
SELECT id, website_id, visitor_hash, country, first_seen, last_seen
FROM visitors
WHERE website_id = $1 AND visitor_hash = $2;