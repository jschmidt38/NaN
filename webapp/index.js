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
});


document.addEventListener("DOMContentLoaded", function(event) {
	var ping = document.querySelector("#ping");

	ping.addEventListener("click", function(event,arg) {
		console.log("clicked");
		ipc.send("pingtest", "204.2.229.9");
	});
	console.log("loaded");
});

ipc.on("pingtest-reply", (event, arg) => {
	console.log(arg);

});