package models

import "time"

type User struct {
	Id        string    `json:"id"`
	FullName  string    `json:"full_name" validate:"required"`
	Email     string    `json:"email" validate:"required, min=2"`
	Password  string    `json:"password" validate:"required, min=6"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
