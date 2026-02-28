package models

type ApiResponse struct {
	Status        string `json:"status"`
	StatusMessage string `json:"statusMessage"`
	Data          any    `json:"data,omitempty"`
}
