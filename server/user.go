package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type userResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Token   string `json:"token,omitempty"`
}

// TODO: handle sanitization
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

	stmt, err := db.Prepare("INSERT INTO Users(email, pass, ipAddr, token) VALUES(?, ?, ?, ?)")
	if err != nil {
		log.Panic("error:", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	// hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Panic("error:", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	token := generateUUID()
	ip := extractIPAddr(r.RemoteAddr)
	_, err = stmt.Exec(email, string(hash), ip, token)
	if err != nil {
		fmt.Println(err)
		resp = &userResponse{Success: false,
			Message: "email already exists",
		}
		b, err := json.Marshal(resp)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			panic("error marshalling in registration")
		}
		w.Write(b)
		return
	}

	resp = &userResponse{Success: true,
		Token: token,
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
		hash  string
		b     []byte
		token string
	)
	err = db.QueryRow("SELECT pass FROM Users WHERE email = ?", email).Scan(&hash)
	if err != nil || hash == "" {
		log.Println(err)
		goto badUserPass
	}
	if err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		log.Println(err)
		goto badUserPass
	}

	token = generateUUID()
	_, err = db.Exec("UPDATE Users SET token = ?, ipAddr = ? WHERE email = ?", token, extractIPAddr(r.RemoteAddr), email)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		panic("error in login")
	}

	resp = &userResponse{Success: true,
		Token: token,
	}

	b, err = json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		panic("error in login")
	}
	w.Write(b)
	return

badUserPass:
	resp = &userResponse{Success: false,
		Message: "bad email/password",
	}
	b, err = json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		panic("error marshalling in login")
	}
	w.Write(b)
	return
}
