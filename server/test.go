package main

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type resultsResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
}

func postResultsHandler(w http.ResponseWriter, r *http.Request) {
	userToken := r.Header.Get("userToken")
	dataCenter, err := strconv.Atoi(r.Header.Get("dataCenter"))
	if err != nil {
		goto badQuery
	}
	avgPing, err := strconv.Atoi(r.Header.Get("avgPing"))
	if err != nil {
		goto badQuery
	}
	hopCount, err := strconv.Atoi(r.Header.Get("hopCount"))
	if err != nil {
		goto badQuery
	}

	if err != nil || userToken == "" {
	badQuery:
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

}
