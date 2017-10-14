// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";
var ipc = require("electron").ipcRenderer;
var path = require("path");


var key = "Ah-fxnT1s5WVvzbmH-OZNl7AeUF4pLpNMfgz4WYn5WOnH9cyQDJCKksgWvYNhmo-";
var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map";

document.addEventListener("DOMContentLoaded", function(event) { 
    document.querySelector("#ping")
        .addEventListener("click", function () {
        ipc.send("load-login");
    });

});
var map;
function loadMap() {
    map = new Microsoft.Maps.Map(document.querySelector("#myMap"), {
        credentials: key
    });
}