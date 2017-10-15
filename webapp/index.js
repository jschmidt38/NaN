// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";

const {shell} = require('electron')

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

var datacenterDropdown = document.querySelector("#serverDiv");
var pingButton = document.querySelector("#pingDiv");

var modal = null;  
var html = null;

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
    		loginButton.style.display = '';
    		regButton.style.display = '';
    		greetingString.style.display = 'none';
    	} else {
    		loginButton.style.display = 'none';
    		regButton.style.display = 'none';
    		greetingString.style.display = '';
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

    // document.querySelector("#pingchart")
    //     .addEventListener("click", function () {
    //     ipc.send("load-pingchart");
    // });

    document.querySelector("#regionchart")
        .addEventListener("click", function () {
        ipc.send("load-regionchart");
    });

    document.querySelector("#twitter")
        .addEventListener("click", function () {
        shell.openExternal("https://twitter.com/RandalfTheGreat");
    });

});

function handleGame() {
	for (var i = datacenter_drop.length - 1; i > 0; i--) {
		datacenter_drop.remove(i);
	}
    gameID = document.getElementById("game_dropdown").value;
    if(gameID !=null){
	    ipc.send("game-selected", gameID);
    }
	datacenterDropdown.classList.remove('is-paused');
}

var datacenter_drop = document.querySelector("#datacenter_dropdown");
ipc.on("game-selected-reply", function(event, arg) {

    var  dataCenterList = arg.dataCenters;
    removePins();
    populateMap(dataCenterList);
    for(var i = 0; i <  dataCenterList.length; i++)  {
        var opt = document.createElement("option");
        var x =  dataCenterList[i].dataCenterID;
        var y =  dataCenterList[i].centerName;
        opt.value = x;
        opt.innerHTML = y;
        datacenter_drop.appendChild(opt);

	//update map display
};});

function handleDataCenter() {
	console.log("reached Datacenter");
	var val = document.getElementById("datacenter_dropdown").value;
	ipc.send("datacenter-selected", val);
	pingButton.classList.remove('is-paused');
}

ipc.on("datacenter-selected-reply", (event, data) => {
	pingAddr = data;
	console.log(pingAddr);
});

document.addEventListener("DOMContentLoaded", function(event) {
	var ping = document.querySelector("#ping");

	ping.addEventListener("click", function(event, pingAddress) {
		ping.classList.add('is-loading');
		ipc.send("test", pingAddr);
	});
});

ipc.on("test-reply", (event, pingResults) => {
	console.log(pingResults);

	var ping = document.querySelector("#ping");
	ping.classList.remove('is-loading');

	modal = document.querySelector('.modal');  
	html = document.querySelector('html');
	modal.classList.add('is-active');
	html.classList.add('is-clipped');

	modal.querySelector('#exit').addEventListener('click', function(e) {
		e.preventDefault();
		modal.classList.remove('is-active');
		html.classList.remove('is-clipped');
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

var map;
function loadMap() {
    map = new Microsoft.Maps.Map(document.querySelector("#myMap"), {
        credentials: key,
        zoom: 10
    });
}

function populateMap(dataCenterList) {
	for (var i = 0; i < dataCenterList.length; i++) {
		var lat = dataCenterList[i].latitude;
		var long = dataCenterList[i].longitude;
		var pushpin = new Microsoft.Maps.Pushpin( {altitude: 0, altitudeReference: -1, latitude: lat, longitude: long} , { icon : 'img/defaultPushpin.png',
	 			anchor: new Microsoft.Maps.Point(12, 39)});
		map.entities.push(pushpin);	
	}
}

function removePins() {
    for (var i = map.entities.getLength() - 1; i >= 0; i--) {
        var pushpin = map.entities.get(i);
        if (pushpin instanceof Microsoft.Maps.Pushpin) {
            map.entities.removeAt(i);
        }
    }
}