package models

import "time"

type User struct {
	Id         string    `json:"id"`
	Full_name  string    `json:"full_name" validate:"required"`
	Email      string    `json:"email" validate:"required, min=2"`
	Password   string    `json:"password" validate:"required, min=6"`
	Created_at time.Time `json:"created_at"`
	Updated_at time.Time `json:"updated_at"`
}
