package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type userResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Token   string `json:"token,omitempty"`
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	var resp *userResponse
	email := r.Header.Get("email")
	password := r.Header.Get("password")

	if email == "" || password == "" {
		resp = &userResponse{Success: false,
			Message: "malformed request",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			panic("error marshalling in registration")
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(b)
		return
	}

	db, err := getDB()
	if err != nil {
		log.Panic("error:", err.Error())
	}
	defer db.Close()

	stmt, err := db.Prepare("INSERT INTO users VALUES(?, ?)")
	if err != nil {
		log.Panic("error:", err.Error())
	}
	defer stmt.Close()

	// TODO: hash password
	_, err = stmt.Exec(email, password)
	if err != nil {
		resp = &userResponse{Success: false,
			Message: "email already exists",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			panic("error marshalling in registration")
		}
		w.Write(b)
		return
	}

	// TODO: generate user token/cookie
	resp = &userResponse{Success: true,
		Token: "random token",
	}

	b, err := json.Marshal(resp)
	if err != nil {
		panic("error in registration")
	}
	w.Write(b)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var resp *userResponse
	email := r.Header.Get("email")
	password := r.Header.Get("password")

	if email == "" || password == "" {
		resp = &userResponse{Success: false,
			Message: "malformed request",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			panic("error marshalling in login")
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(b)
		return
	}

	db, err := getDB()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Panic("error:", err.Error())
	}
	defer db.Close()

	var (
		emailRes string
	)
	err = db.QueryRow("SELECT email FROM users WHERE email = ? AND password = ?", email, password).Scan(&emailRes)
	if err != nil || emailRes == "" {
		resp = &userResponse{Success: false,
			Message: "bad email/password",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			panic("error marshalling in login")
		}
		w.Write(b)
		return
	}

	resp = &userResponse{Success: true,
		Token: "random token",
	}

	b, err := json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		panic("error in login")
	}
	w.Write(b)
}
