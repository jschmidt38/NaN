package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

type dataCenterSuccess struct {
	Success      bool    `json:"success"`
	Message      string  `json:"message,omitempty"`
	DataCenterID int     `json:"dataCenterID,omitempty"`
	GameID       int     `json:"gameID,omitempty"`
	RegionID     int     `json:"regionID,omitempty"`
	CenterName   string  `json:"centerName,omitempty"`
	IPAddr       string  `json:"ipAddr,omitempty"`
	Latitude     float32 `json:"latitude,omitempty"`
	Longitude    float32 `json:"longitude,omitempty"`
}

type dataCenter struct {
	Message      string  `json:"message,omitempty"`
	DataCenterID int     `json:"dataCenterID,omitempty"`
	GameID       int     `json:"gameID,omitempty"`
	RegionID     int     `json:"regionID,omitempty"`
	CenterName   string  `json:"centerName,omitempty"`
	IPAddr       string  `json:"ipAddr,omitempty"`
	Latitude     float32 `json:"latitude,omitempty"`
	Longitude    float32 `json:"longitude,omitempty"`
}

type dataCenters struct {
	Success     bool         `json:"success"`
	Message     string       `json:"message,omitempty"`
	DataCenters []dataCenter `json:"dataCenters,omitempty"`
}

func allDataCenterHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello world XD")
}

func dataCenterForGameHandler(w http.ResponseWriter, r *http.Request) {
	var (
		resp = &dataCenters{}
		b    []byte
		rows *sql.Rows
		db   *sql.DB
	)
	gameIDStr := r.Header.Get("id")
	if gameIDStr == "" {
		resp = &dataCenters{Success: false,
			Message: "malformed request",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			panic(err.Error())
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(b)
		return
	}
	gameID, err := strconv.Atoi(gameIDStr)
	if err != nil {
		log.Println(err.Error())
		goto internal500
	}
	db, err = getDB()
	if err != nil {
		goto internal500
	}
	defer db.Close()

	rows, err = db.Query("SELECT * FROM Datacenters where gameID = ?", gameID)
	if err != nil {
		log.Println(err.Error())
		goto internal500
	}
	defer rows.Close()

	resp.Success = true
	for rows.Next() {
		dCenter := dataCenter{}
		rows.Scan(&dCenter.DataCenterID, &dCenter.GameID, &dCenter.RegionID,
			&dCenter.CenterName, &dCenter.IPAddr, &dCenter.Latitude, &dCenter.Longitude)
		resp.DataCenters = append(resp.DataCenters, dCenter)
	}
	b, err = json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		panic("error marshalling in login")
	}
	w.Write(b)
	return

internal500:
	resp = &dataCenters{Success: false, Message: "internal error"}
	b, err = json.Marshal(resp)
	if err != nil {
		panic("error marshalling in login")
	}
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(b)
	return
}

func dataCenterForIDHandler(w http.ResponseWriter, r *http.Request) {
	var (
		resp = &dataCenterSuccess{}
		b    []byte
		db   *sql.DB
	)

	dataCenterIDStr := r.Header.Get("id")
	if dataCenterIDStr == "" {
		resp = &dataCenterSuccess{Success: false,
			Message: "malformed request",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			panic(err.Error())
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(b)
		return
	}
	dataCenterID, err := strconv.Atoi(dataCenterIDStr)
	if err != nil {
		goto internal500
	}

	db, err = getDB()
	if err != nil {
		goto internal500
	}
	defer db.Close()

	err = db.QueryRow("SELECT * FROM Datacenters WHERE id = ?", dataCenterID).
		Scan(&resp.DataCenterID, &resp.GameID, &resp.RegionID, &resp.CenterName, &resp.IPAddr, &resp.Latitude, &resp.Longitude)
	if err != nil {
		goto internal500
	}
	resp.Success = true
	b, err = json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		panic(err.Error())
	}
	w.Write(b)
	return

internal500:
	resp = &dataCenterSuccess{Success: false,
		Message: "malformed request",
	}
	b, err = json.Marshal(resp)
	if err != nil {
		panic(err.Error())
	}
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(b)
}
