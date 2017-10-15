package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

type daily struct {
	date        string
	avgPing     int
	avgHopCount int
}

func historicalResultsHandler(w http.ResponseWriter, r *http.Request) {
	var (
		rows *sql.Rows
		b    []byte

		avgPing int
		avgHops int
		date    string
	)

	dataCenterID, err := strconv.Atoi(r.Header.Get("dataCenterID"))

	if err != nil {
		resp := &resultsResponse{Success: false,
			Message: "error 400: bad request",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			panic("error marshalling in login")
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(b)
		return
	}

	db, err := getDB()
	if err != nil {
		goto internal500
	}
	defer db.Close()

	rows, err = db.Query(`SELECT AVG(r.avgPing) avgPing, AVG(r.hopCount) hopCount, 
		dateadd(DAY,0, datediff(day,0, r.testDate))
	 	FROM Results r 
		LEFT JOIN Regions reg ON r.regionID = reg.id WHERE r.dataCenterID = ?
		GROUP BY dateadd(DAY,0, datediff(day,0, r.testDate))`, dataCenterID)
	if err != nil {
		goto internal500
	}

	for rows.Next() {
		rows.Scan(&avgPing, &avgHops, &date)
		fmt.Println(avgPing, avgHops, date)
	}

	return
internal500:
	resp := &resultsResponse{Success: false,
		Message: "error 500: internal error",
	}
	b, err = json.Marshal(resp)
	if err != nil {
		panic("error marshalling in test")
	}
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(b)
}
