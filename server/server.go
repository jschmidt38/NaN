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

	// Get list of games and datacenters for the game
	http.HandleFunc("/regions/all", allRegionHandler)
	http.HandleFunc("/regions/forgame", regionForGameHandler)

	http.HandleFunc("/games/all", allGameHandler)

	// Datacenters/ip
	http.HandleFunc("/datacenters/all", allDataCenterHandler)
	http.HandleFunc("/datacenters/forid", dataCenterForIDHandler)
	http.HandleFunc("/datacenters/forgame", dataCenterForGameHandler)

	http.HandleFunc("/test/post", postResultsHandler)

	go http.ListenAndServe(":8080", nil)
	fmt.Println("HTTP server listening on port 8080")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello world XD")
}
