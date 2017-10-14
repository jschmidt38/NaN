package main

import (
	"database/sql"
	"flag"
	"fmt"

	_ "github.com/denisenkom/go-mssqldb"
)

var (
	password = flag.String("password", "Hackgt123!", "the database password")
	port     = flag.Int("port", 1433, "the database port")
	server   = flag.String("server", "hackgt4-nan.database.windows.net", "the database server")
	database = flag.String("database", "hackgt4-nan", "database to connect to")
	user     = flag.String("user", "team-nan@hackgt4-nan", "the database user")
)

func getDB() (conn *sql.DB, err error) {
	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%d", *server, *user, *password, *port)

	conn, err = sql.Open("mssql", connString)
	return
}
