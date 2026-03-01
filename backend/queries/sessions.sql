-- name: CreateSession :one
INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetSessionByToken :one
SELECT * FROM user_sessions WHERE refresh_token_hash = $1;

-- name: DeleteSessionByToken :exec
DELETE FROM user_sessions WHERE refresh_token_hash = $1;