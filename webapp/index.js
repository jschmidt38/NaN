// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";

const {shell} = require('electron')

var ipc = require("electron").ipcRenderer;
var path = require("path");
const request = require('superagent');
var pingAddr;
var dataCenterID;
var gameID;


var key = "Ah-fxnT1s5WVvzbmH-OZNl7AeUF4pLpNMfgz4WYn5WOnH9cyQDJCKksgWvYNhmo-";
var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map";

var token = null;

var loginButton = document.querySelector("#login");
var regButton = document.querySelector("#register");
var greetingString = document.querySelector("#greeting");

var datacenterDropdown = document.querySelector("#serverDiv");
var pingButton = document.querySelector("#pingDiv");

var mapBox = document.querySelector("#mapDiv");

var pingError = document.querySelector('#errorMessage');

var modal = null;  
var html = null;
ipc.emit("tokenManage");
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
        token = arg;
        console.log(token);
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
	dataCenterID = document.getElementById("datacenter_dropdown").value;
	ipc.send("datacenter-selected", dataCenterID);
	pingButton.classList.remove('is-paused');
}

ipc.on("datacenter-selected-reply", (event, data) => {
	pingAddr = data;
});

document.addEventListener("DOMContentLoaded", function(event) {
	var ping = document.querySelector("#ping");

    
	ping.addEventListener("click", function(event, pingAddress) {
        dataCenterID = document.getElementById("datacenter_dropdown").value;
        if (dataCenterID != "null") {
            ping.classList.add('is-loading');
		    ipc.send("test", pingAddr);
        }
	});
   
});

var token;
ipc.on("tokenRetrieve", (event, arg) => {
    token = arg;
    console.log("Got token: " + arg);
});

ipc.on("test-reply", (event, pingResults) => {
    var ping = document.querySelector("#ping");
    var pingCount = document.querySelector("#pingcount");
    var hopCount = document.querySelector("#hopcount");

    pingCount.innerHTML = pingResults[0];
    hopCount.innerHTML = pingResults[1];

	ping.classList.remove('is-loading');

	modal = document.querySelector('.modal');  
	html = document.querySelector('html');
	modal.classList.add('is-active');
	html.classList.add('is-clipped');
	mapBox.classList.add('is-paused');

	modal.querySelector('#exit').addEventListener('click', function(e) {
		e.preventDefault();
		modal.classList.remove('is-active');
		html.classList.remove('is-clipped');
		mapBox.classList.remove('is-paused');
    });
    
    if (token == null) {
        return;
    }

    request.post("104.45.146.84:8080/test/post")
    .set({userToken : token, dataCenter : dataCenterID, avgPing : pingResults[0], hopCount : pingResults[1]})
    .end((err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
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
  ipc.emit("tokenManage");
});

var map;
function loadMap() {
    map = new Microsoft.Maps.Map(document.querySelector("#myMap"), {
        credentials: key,
        zoom: 10
    });
}

var infobox;
function populateMap(dataCenterList) {
	var locs = [];
	var lat;
	var long;
	var centerName;
	var ipAddr;
	var location;
	for (var i = 0; i < dataCenterList.length; i++) {
		lat = dataCenterList[i].latitude;
		long = dataCenterList[i].longitude;
		location = new Microsoft.Maps.Location(lat, long);
		locs.push(location);
		centerName = dataCenterList[i].centerName;
		ipAddr = dataCenterList[i].ipAddr;
		var pushpin = new Microsoft.Maps.Pushpin(location , { icon : 'img/defaultPushpin.png',
	 			anchor: new Microsoft.Maps.Point(12, 39)});
		pushpin.metadata = {
			title: centerName,
			description: ipAddr
		};
		infobox = new Microsoft.Maps.Infobox(location, {visible: false });
		infobox.setMap(map);
		Microsoft.Maps.Events.addHandler(pushpin, 'click', pushpinClicked);
		map.entities.push(pushpin);
	}
	var bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
	map.setView({bounds:bounds, padding: 100});
}

function pushpinClicked(e) {
	if (e.target.metadata) {
		infobox.setOptions({ 
    		location: e.target.getLocation(),
    		title: e.target.metadata.title,
    		description: e.target.metadata.description,
    		visible: true 
    	});
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
