package models

type APIResponse struct {
	Status        string `json:"status"`
	StatusMessage string `json:"statusMessage"`
	Data          any    `json:"data,omitempty"`
}
