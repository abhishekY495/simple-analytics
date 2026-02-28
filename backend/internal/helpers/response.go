package helpers

import (
	"encoding/json"
	"net/http"

	"github.com/abhishekY495/simple-analytics/backend/internal/models"
)

func ApiJSON(w http.ResponseWriter, statusCode int, status string, message string, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(models.ApiResponse{
		Status:        status,
		StatusMessage: message,
		Data:          data,
	})
}

func ApiError(w http.ResponseWriter, statusCode int, message string) {
	ApiJSON(w, statusCode, "error", message, nil)
}

func ApiSuccess(w http.ResponseWriter, statusCode int, message string, data any) {
	ApiJSON(w, statusCode, "success", message, data)
}
