package main

import (
	"fmt"
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
