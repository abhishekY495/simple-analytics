-- name: CreateUser :one
INSERT INTO users (full_name, email, password) 
VALUES ($1, $2, $3) 
RETURNING id, full_name, email, created_at, updated_at;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;