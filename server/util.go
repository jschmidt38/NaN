package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
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

func getISPFromIP(ip string) string {
	if strings.Index(ip, ":") >= 0 {
		ip = extractIPAddr(ip)
	}
	resp, err := http.Get(fmt.Sprintf("http://ip-api.com/json/%s", ip))
	if err != nil {
		return "n/a"
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	var data interface{}
	json.Unmarshal(body, &data)

	m := data.(map[string]interface{})
	return m["isp"].(string)
}
