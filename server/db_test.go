package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	"testing"
)

func TestDatabaseConnection(t *testing.T) {
	db, err := getDB()
	if err != nil {
		t.Error(err.Error())
	}
	defer db.Close()

	rows, err := db.Query("SELECT email FROM Users")
	if err != nil {
		t.Error(err.Error())
	}
	defer rows.Close()
	for rows.Next() {
		var email string
		rows.Scan(&email)
		fmt.Println(email)
	}
}

func TestAllGames(t *testing.T) {
	var (
		resp     = &games{}
		gameID   int
		gameName string
	)
	db, err := getDB()
	if err != nil {
		t.Error(err.Error())
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Games")
	defer rows.Close()

	for rows.Next() {
		rows.Scan(&gameID, &gameName)
		resp.Game = append(resp.Game, game{gameID, gameName})
	}
	_, err = json.Marshal(resp)
	if err != nil {
		t.Error(err.Error())
	}
}

func TestAllRegions(t *testing.T) {
	var (
		resp       = &regions{}
		regionID   int
		regionName string
	)
	db, err := getDB()
	if err != nil {
		t.Error(err.Error())
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Regions")
	defer rows.Close()

	for rows.Next() {
		rows.Scan(&regionID, &regionName)
		resp.Region = append(resp.Region, region{regionID, regionName})
	}
	_, err = json.Marshal(resp)
	if err != nil {
		t.Error(err.Error())
	}
}

func TestDatacenterID(t *testing.T) {
	var (
		resp = &dataCenterSuccess{}
		b    []byte
	)

	dataCenterIDStr := "1"
	dataCenterID, err := strconv.Atoi(dataCenterIDStr)
	if err != nil {
		t.Error(err)
	}

	db, err := getDB()
	if err != nil {
		t.Error(err)
	}
	defer db.Close()

	err = db.QueryRow("SELECT * FROM Datacenters WHERE id = ?", dataCenterID).
		Scan(&resp.DataCenterID, &resp.GameID, &resp.RegionID, &resp.CenterName, &resp.IPAddr, &resp.Latitude, &resp.Longitude)
	if err != nil {
		t.Error(err)
	}
	resp.Success = true
	b, err = json.Marshal(resp)
	if err != nil {
		t.Error(err.Error())
	}
	fmt.Println(string(b))
}

func TestDataCenterGame(t *testing.T) {
	var (
		resp = &dataCenters{}
		b    []byte
		rows *sql.Rows
		db   *sql.DB
	)
	gameIDStr := "3"

	gameID, err := strconv.Atoi(gameIDStr)
	if err != nil {
		t.Error(err.Error())
	}
	db, err = getDB()
	if err != nil {
		t.Error(err.Error())
	}
	defer db.Close()

	rows, err = db.Query("SELECT * FROM Datacenters where gameID = ?", gameID)
	if err != nil {
		t.Error(err.Error())
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
		t.Error(err.Error())
	}
	fmt.Println(string(b))
}
