package helpers

import (
	"encoding/json"
	"net/http"

	"github.com/abhishekY495/simple-analytics/backend/internal/models"
)

func SendJSON(w http.ResponseWriter, statusCode int, status string, message string, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(models.APIResponse{
		Status:        status,
		StatusMessage: message,
		Data:          data,
	})
}

func SendError(w http.ResponseWriter, statusCode int, message string) {
	SendJSON(w, statusCode, "error", message, nil)
}

func SendSuccess(w http.ResponseWriter, statusCode int, message string, data any) {
	SendJSON(w, statusCode, "success", message, data)
}
