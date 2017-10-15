package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	geo "github.com/kellydunn/golang-geo"
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

// return -1 if it can't find it
func getRegionFromIP(ip string) int {
	if strings.Index(ip, ":") >= 0 {
		ip = extractIPAddr(ip)
	}
	resp, err := http.Get(fmt.Sprintf("http://ip-api.com/json/%s", ip))
	if err != nil {
		return -1
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	var data interface{}
	json.Unmarshal(body, &data)

	m := data.(map[string]interface{})
	userLat := m["lat"].(float64)
	userLon := m["lon"].(float64)

	var bestFit *regionFence
	var bestDist float64

	for _, fence := range regionFences {
		if fence == nil {
			continue
		}
		userPoint := geo.NewPoint(userLat, userLon)
		fencePoint := geo.NewPoint(fence.lat, fence.lon)
		if bestFit == nil {
			bestFit = fence
			bestDist = userPoint.GreatCircleDistance(fencePoint)
			continue
		}

		dist := userPoint.GreatCircleDistance(fencePoint)
		if dist < bestDist {
			bestFit = fence
			bestDist = dist
		}
	}
	if bestFit.radius*69 < (bestDist + 100) {
		return -1
	}

	return bestFit.id
}

type regionFence struct {
	id  int
	lat float64
	lon float64

	// in miles
	radius float64
}

var regionFences = make([]*regionFence, 8)

func init() {
	loadGeoFences()
}

func loadGeoFences() {
	db, err := getDB()
	if err != nil {
		return
	}

	rows, err := db.Query("SELECT id, latitude, longitude, radius FROM Regions")
	if err != nil {
		return
	}

	for rows.Next() {
		fence := &regionFence{}
		rows.Scan(&fence.id, &fence.lat, &fence.lon, &fence.radius)
		regionFences = append(regionFences, fence)
	}
	log.Println("Finished init of geo-fences. Length:", len(regionFences))
}
