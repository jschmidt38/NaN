package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type region struct {
	RegionID   int    `json:"regionID,omitempty"`
	RegionName string `json:"regionName,omitempty"`
}

type regions struct {
	Success bool     `json:"success"`
	Message string   `json:"message,omitempty"`
	Region  []region `json:"regions,omitempty"`
}

func allRegionHandler(w http.ResponseWriter, r *http.Request) {
	var (
		resp       = &regions{}
		regionID   int
		regionName string
		b          []byte
		rows       *sql.Rows
	)
	db, err := getDB()
	if err != nil {
		goto internal500
	}
	defer db.Close()

	rows, err = db.Query("SELECT id, regionName FROM Regions")
	if err != nil {
		goto internal500
	}
	defer rows.Close()

	resp.Success = true
	for rows.Next() {
		rows.Scan(&regionID, &regionName)
		resp.Region = append(resp.Region, region{regionID, regionName})
	}
	b, err = json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		panic("error marshalling in login")
	}
	w.Write(b)
	return

internal500:
	resp = &regions{Success: false, Message: "internal error"}
	b, err = json.Marshal(resp)
	if err != nil {
		panic("error marshalling in login")
	}
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(b)
	return
}

func regionForGameHandler(w http.ResponseWriter, r *http.Request) {

}
