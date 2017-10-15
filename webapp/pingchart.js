"use strict";
var ipc = require("electron").ipcRenderer;
var path = require("path");


var key = "Ah-fxnT1s5WVvzbmH-OZNl7AeUF4pLpNMfgz4WYn5WOnH9cyQDJCKksgWvYNhmo-";
var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map";

document.addEventListener("DOMContentLoaded", function(event) { 
	
    document.querySelector("#login")
        .addEventListener("click", function () {
        //ipc.send("load-login");

    });

    tippy('#login', {
        html: document.querySelector('#insideDivLogin'),
        arrow: true,
        animation: 'fade',
        trigger: 'click'
    })

    document.querySelector("#home")
        .addEventListener("click", function () {
        ipc.send("load-home");
    });
});