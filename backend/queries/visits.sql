-- name: AddVisit :one
INSERT INTO visits (website_id, visitor_id, referrer)
VALUES ($1, $2, $3)
RETURNING id, website_id, visitor_id, referrer, started_at, ended_at;

-- name: GetVisitByID :one
SELECT id, website_id, visitor_id, referrer, started_at, ended_at
FROM visits WHERE id = $1;

-- name: UpdateVisitEndedAt :exec
UPDATE visits SET ended_at = CURRENT_TIMESTAMP WHERE id = $1;