package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type game struct {
	GameID   int    `json:"gameID,omitempty"`
	GameName string `json:"gameName,omitempty"`
}

// get all games in json
type games struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Game    []game `json:"games,omitempty"`
}

func allGameHandler(w http.ResponseWriter, r *http.Request) {
	var (
		resp     = &games{}
		gameID   int
		gameName string
		b        []byte
		rows     *sql.Rows
	)
	db, err := getDB()
	if err != nil {
		goto internal500
	}
	defer db.Close()

	rows, err = db.Query("SELECT * FROM Games")
	if err != nil {
		goto internal500
	}
	defer rows.Close()

	resp.Success = true
	for rows.Next() {
		rows.Scan(&gameID, &gameName)
		resp.Game = append(resp.Game, game{gameID, gameName})
	}
	b, err = json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		panic("error marshalling in login")
	}
	w.Write(b)
	return

internal500:
	resp = &games{Success: false, Message: "internal error"}
	b, err = json.Marshal(resp)
	if err != nil {
		panic("error marshalling in login")
	}
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(b)
	return
}
