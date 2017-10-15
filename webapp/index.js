// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";
var ipc = require("electron").ipcRenderer;
var path = require("path");
var pingAddr;
var gameID;


var key = "Ah-fxnT1s5WVvzbmH-OZNl7AeUF4pLpNMfgz4WYn5WOnH9cyQDJCKksgWvYNhmo-";
var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map";

var token = null;

var loginButton = document.querySelector("#login");
var regButton = document.querySelector("#register");
var greetingString = document.querySelector("#greeting");

document.addEventListener("DOMContentLoaded", function(event) { 
    var game_drop = document.querySelector("#game_dropdown");



    ipc.on("gamesReturn", (event, arg) => {

        var gameList = arg.games;
        for(var i = 0; i < gameList.length; i++)  {
            var opt = document.createElement("option");
            var x = gameList[i].gameID;
            var y = gameList[i].gameName;
            opt.value = x;
            opt.innerHTML = y;
            game_drop.appendChild(opt);


        };
    });
    ipc.send("gamePop",game_drop);

    ipc.on("loginSwap", (event, arg) => {
    	if (arg == null) {
    		loginButton.styleList.remove("display: none");
    		regButton.styleList.remove("display: none");
    		greetingString.styleList.add("display: none");
    	} else {
    		loginButton.styleList.add("display: none");
    		regButton.styleList.add("display: none");
    		greetingString.styleList.remove("display: none");
    	}
    });

    document.querySelector("#truelogin")
        .addEventListener("click", function () {
        //ipc.send("load-login");
        var mail = document.querySelector("#emailLogin");
        var pass = document.querySelector("#passwordLogin");
        ipc.send("login",mail.value,pass.value);
    });

    document.querySelector("#trueregister")
        .addEventListener("click", function () {

        var mail = document.querySelector("#regEmail");
        var pass = document.querySelector("#regPassword");
        ipc.send("register",mail.value,pass.value);

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

function handleGame() {
	console.log("reached Game");
	gameID = document.getElementById("game_dropdown").value;
	ipc.send("game-selected", gameID);
}

ipc.on("game-selected-reply", function(event, dataCenterLocs) {
	//update map display
})

function handleDataCenter() {
	console.log("reached Datacenter");
	var val = document.getElementById("datacenter_dropdown").value;
	ipc.send("datacenter-selected", val);
}

ipc.on("datacenter-selected-reply", (event, data) => {
	pingAddr = data;
	console.log(pingAddr);
});

document.addEventListener("DOMContentLoaded", function(event) {
	var ping = document.querySelector("#ping");

	ping.addEventListener("click", function(event, pingAddress) {
		ipc.send("test", pingAddr);
	});
});

ipc.on("test-reply", (event, pingResults) => {
	console.log(pingResults);
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
        credentials: key,
        zoom: 10
    });
    defaultPushpin();
}

function defaultPushpin() {
	var pushpin = new Microsoft.Maps.Pushpin( {altitude: 0, altitudeReference: -1, latitude: 41.8781, longitude: -87.6298} , { icon : 'img/defaultPushpin.png',
	 			anchor: new Microsoft.Maps.Point(12, 39)});
	map.entities.push(pushpin);
}

