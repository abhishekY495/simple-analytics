package helpers

import (
	"github.com/medama-io/go-useragent"
)

var UaParser *useragent.Parser

func InitUaParser() {
	UaParser = useragent.NewParser()
}
