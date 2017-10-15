package main

import (
	"fmt"
	"testing"
)

func TestUUID(t *testing.T) {
	fmt.Println(generateUUID())
}

func TestISP(t *testing.T) {
	fmt.Println(getISPFromIP("143.215.121.9"))
}
