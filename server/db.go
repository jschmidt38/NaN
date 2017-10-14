package main

import (
	"database/sql"
	"flag"
	"fmt"

	_ "github.com/denisenkom/go-mssqldb"
)

var (
	password = flag.String("password", "", "the database password")
	port     = flag.Int("port", 1433, "the database port")
	server   = flag.String("server", "", "the database server")
	user     = flag.String("user", "", "the database user")
)

func getDB() (conn *sql.DB, err error) {
	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%d", *server, *user, *password, *port)

	conn, err = sql.Open("mssql", connString)
	return
}