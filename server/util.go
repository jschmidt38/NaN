package main

import (
	"log"
	"strings"

	uuid "github.com/nu7hatch/gouuid"
)

func generateUUID() string {
	uuid, err := uuid.NewV4()
	if err != nil {
		log.Panicf("error: %s", err.Error())
	}
	return uuid.String()
}

func extractIPAddr(ip string) string {
	portIdx := strings.Index(ip, ":")
	if portIdx >= 0 {
		return ip[:portIdx]
	}
	return ""
}
