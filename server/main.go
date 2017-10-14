package main

import (
	"os"
	"os/signal"
)

func main() {
	startHTTPServer()

	ch := make(chan os.Signal)
	signal.Notify(ch, os.Interrupt, os.Kill)
	<-ch
}
