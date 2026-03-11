package helpers

import (
	"log"

	"github.com/oschwald/geoip2-golang/v2"
)

var GeoDB *geoip2.Reader

func InitGeoDB(path string) {
	db, err := geoip2.Open(path)
	if err != nil {
		log.Fatalf("Failed to open GeoDB: %v", err)
	}
	GeoDB = db
}
