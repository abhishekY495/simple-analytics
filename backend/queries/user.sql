-- name: CreateUser :one
INSERT INTO users (full_name, email, password) 
VALUES ($1, $2, $3) 
RETURNING id, full_name, email, created_at, updated_at;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: UpdateFullName :exec
UPDATE users SET full_name = $1 WHERE id = $2;

-- name: CheckEmailExists :one
SELECT COUNT(*) FROM users WHERE email = $1;

-- name: UpdateEmail :exec
UPDATE users SET email = $1 WHERE id = $2;

-- name: UpdatePassword :exec
UPDATE users SET password = $1 WHERE id = $2;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;