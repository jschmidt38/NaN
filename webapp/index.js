// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";
var ipc = require("electron").ipcRenderer;
var path = require("path");


var key = "Ah-fxnT1s5WVvzbmH-OZNl7AeUF4pLpNMfgz4WYn5WOnH9cyQDJCKksgWvYNhmo-";
var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map";

document.addEventListener("DOMContentLoaded", function(event) { 
	
    document.querySelector("#truelogin")
        .addEventListener("click", function () {
        //ipc.send("load-login");
        console.log("Login clicked");
        var mail = document.querySelector("#emailLogin");
        var pass = document.querySelector("#passwordLogin");
        console.log(mail.value + pass.value);
        ipc.send("login",mail.value,pass.value);



        


    });

    document.querySelector("#trueregister")
        .addEventListener("click", function () {
        //ipc.send("load-login");
        console.log("Register clicked");

    });

    tippy('#login', {
        html: document.querySelector('#insideDivLogin'),
        arrow: true,
        animation: 'fade',
        trigger: 'click'
    })

    tippy('#register', {
        html: document.querySelector('#insideDivRegister'),
        arrow: true,
        animation: 'fade',
        trigger: 'click'
    })

    document.querySelector("#pingchart")
        .addEventListener("click", function () {
        ipc.send("load-pingchart");
    });

    document.querySelector("#regionchart")
        .addEventListener("click", function () {
        ipc.send("load-regionchart");
    });

});

document.addEventListener("DOMContentLoaded", function(event) {
	var ping = document.querySelector("#ping");

	ping.addEventListener("click", function(event,arg) {
		ipc.send("test", "204.2.229.9");
	});
});

ipc.on("test-reply", (event, arg) => {
	console.log(arg);
});

document.addEventListener('DOMContentLoaded', function () {

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});

var map;
function loadMap() {
    map = new Microsoft.Maps.Map(document.querySelector("#myMap"), {
        credentials: key
    });
}