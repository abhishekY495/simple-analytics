package models

type ApiResponse struct {
	Status        string `json:"status"`
	StatusMessage string `json:"status_message"`
	Data          any    `json:"data,omitempty"`
}
