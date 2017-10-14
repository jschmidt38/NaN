package main

import (
	"fmt"
	"net/http"
)

func startHTTPServer() {
	http.HandleFunc("/", indexHandler)

	// User register/login
	http.HandleFunc("/user/register", registerHandler)
	http.HandleFunc("/user/login", loginHandler)

	go http.ListenAndServe(":8080", nil)
	fmt.Println("HTTP server listening on port 8080")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello world XD")
}
