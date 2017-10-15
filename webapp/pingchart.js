"use strict";

const {shell} = require('electron')

var ipc = require("electron").ipcRenderer;
var path = require("path");

var key = "Ah-fxnT1s5WVvzbmH-OZNl7AeUF4pLpNMfgz4WYn5WOnH9cyQDJCKksgWvYNhmo-";
var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map";

var loginButton = document.querySelector("#login");
var regButton = document.querySelector("#register");
var greetingString = document.querySelector("#greeting");

document.addEventListener("DOMContentLoaded", function(event) { 

	ipc.on("loginSwap", (event, arg) => {
    	if (arg == null) {
    		loginButton.style.display = '';
    		regButton.style.display = '';
    		greetingString.style.display = 'none';
    	} else {
    		loginButton.style.display = 'none';
    		regButton.style.display = 'none';
    		greetingString.style.display = '';
    	}
    });
    ipc.emit("tokenManage");
	
    document.querySelector("#truelogin")
        .addEventListener("click", function () {
        //ipc.send("load-login");
        console.log("Login clicked");

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

    document.querySelector("#home")
        .addEventListener("click", function () {
        ipc.send("load-home");
    });

    document.querySelector("#regionchart")
        .addEventListener("click", function () {
        ipc.send("load-regionchart");
    });

    document.querySelector("#twitter")
        .addEventListener("click", function () {
        shell.openExternal("https://twitter.com/RandalfTheGreat");
    });
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