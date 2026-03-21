-- name: AddWebsite :one
INSERT INTO websites (user_id, name, domain)
VALUES ($1, $2, $3)
RETURNING id, user_id, name, domain, created_at;

-- name: GetWebsitesByUserID :many
SELECT id, user_id, name, domain, created_at FROM websites WHERE user_id = $1;

-- name: GetWebsiteByID :one
SELECT id, user_id, name, domain, is_public, created_at FROM websites WHERE id = $1;

-- name: DeleteWebsiteByID :exec
DELETE FROM websites WHERE id = $1;

-- name: UpdateWebsiteByID :exec
UPDATE websites SET name = $1, domain = $2 WHERE id = $3;