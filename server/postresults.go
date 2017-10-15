package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type resultsResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
}

func postResultsHandler(w http.ResponseWriter, r *http.Request) {
	var failed bool
	userToken := r.Header.Get("userToken")
	dataCenter, err := strconv.Atoi(r.Header.Get("dataCenter"))
	if err != nil {
		failed = true
	}
	avgPing, err := strconv.Atoi(r.Header.Get("avgPing"))
	if err != nil {
		failed = true
	}
	hopCount, err := strconv.Atoi(r.Header.Get("hopCount"))
	if err != nil {
		failed = true
	}

	if err != nil || failed || userToken == "" {
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
		resp := &resultsResponse{Success: false,
			Message: "error 500: internal error",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			panic("error marshalling in test")
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(b)
		return
	}
	defer db.Close()

	var (
		userID          int
		ispID           int
		userIP          string
		dataCenterVerif int
		resp            *resultsResponse
		b               []byte
	)

	db.QueryRow("SELECT id, ipAddr, ispID, FROM Users WHERE token = ?", userToken).Scan(&userID, &ispID, &userIP)
	if userIP == "" || len(userIP) == 0 || userID <= 0 {
		goto badRequest400
	}
	db.QueryRow("SELECT id FROM Datacenters WHERE id = ?", dataCenter).Scan(&dataCenterVerif)
	if dataCenterVerif != dataCenter {
		goto badRequest400
	}

	_, err = db.Exec(`INSERT INTO Results(userID, dataCenterID, testDate, ipAddr, avgPing, hopCount, ispID) 
		VALUES(?, ?, GETDATE(), ?, ?, ?, ?)`, userID, dataCenter, userIP, avgPing, hopCount, ispID)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Panic(err.Error())
	}
	resp = &resultsResponse{Success: true}
	b, err = json.Marshal(resp)
	if err != nil {
		panic("error marshalling in test")
	}
	w.Write(b)
	return

badRequest400:
	resp = &resultsResponse{Success: false,
		Message: "error 400: bad authorization",
	}
	b, err = json.Marshal(resp)
	if err != nil {
		panic("error marshalling in test")
	}
	w.WriteHeader(http.StatusBadRequest)
	w.Write(b)
	return
}
