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

    document.querySelector("#ping")
        .addEventListener("click", function () {
        ipc.send("load-pingchart");
    });
});
