// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";

var ipc = require("electron").ipcRenderer;
var path = require("path");




document.addEventListener("DOMContentLoaded", function(event) { 
	
    document.querySelector("#login")
        .addEventListener("click", function () {
        ipc.send("load-login");
    });

    document.querySelector("#pingchart")
        .addEventListener("click", function () {
        ipc.send("load-pingchart");
    });
});

document.addEventListener("DOMContentLoaded", function(event) {
	var ping = document.querySelector("#ping");

	ping.addEventListener("click", function(event,arg) {
		console.log("clicked");
		ipc.send("test", "204.2.229.9");
	});
	console.log("loaded");
});

ipc.on("test-reply", (event, arg) => {
	console.log(arg);
});