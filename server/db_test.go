package main

import "testing"

func TestDatabaseConnection(t *testing.T) {
	db, err := getDB()
	if err != nil {
		t.Error(err.Error())
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM users")
	if err != nil {
		t.Error(err.Error())
	}
	defer rows.Close()
}
