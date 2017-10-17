"use strict";

const { shell } = require('electron')

var ipc = require("electron").ipcRenderer;
var path = require("path");

const electron = require('electron');
var ipcMain = electron;

var key = "Ah-fxnT1s5WVvzbmH-OZNl7AeUF4pLpNMfgz4WYn5WOnH9cyQDJCKksgWvYNhmo-";
var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map";

var el = document.querySelector('#col2');
var el2 = document.querySelector('#col3');

var loginButton = document.querySelector("#login");
var regButton = document.querySelector("#register");
var greetingString = document.querySelector("#greeting");

var modal = null;
var html = null;

var currentRegion = 1;

document.addEventListener("DOMContentLoaded", function (event) {

    ipc.on("gamesReturn", (event, arg) => {
        var gameList = arg.games;
        var tableHtml = "<thead><tbody>";
        for (var i = 0; i < gameList.length; i++) {
            tableHtml += "<tr><td><a class=\"game_select\" id=" + gameList[i].gameID + ">" + gameList[i].gameName + "</a></td></tr>";
        }
        tableHtml += "</tbody>";
        document.getElementById("game_table").innerHTML = tableHtml;
        var selectors = document.querySelectorAll(".game_select");

        for (var i = 0; i < selectors.length; i++) {
            selectors[i].addEventListener("click", (event) => {
                var target = event.target || event.srcElement;
                var id = target.id
                el2.classList.remove("is-paused");
                console.log(id);
                ipc.send("loadDataCenterForGame", id, id)
            });
        }
    });

    ipc.send("loadAllRegions", "a");

    ipc.on("regionReturn", (event, arg) => {
        var regionList = arg.regions;
        var tableHtml = "<thead><tr><th>Select Region</th></tr></thead><tbody>";
        for (var i = 0; i < regionList.length; i++) {
            tableHtml += "<tr><td><a class=\"region_select\" id=" + regionList[i].regionID + ">" + regionList[i].regionName + "</a></td></tr>";
        }
        tableHtml += "</tbody>";

        document.getElementById("region_table").innerHTML = tableHtml;
        var selectors = document.querySelectorAll(".region_select");

        for (var i = 0; i < selectors.length; i++) {
            selectors[i].addEventListener("click", (event) => {
                var target = event.target || event.srcElement;
                var id = target.id
                el.classList.remove("is-paused");
                ipc.send("loadAllGames", "a");
                currentRegion = id;
            });
        }
    });

    ipc.on("dataCenterForGameReturn", (event, arg) => {
        var centerList = arg.dataCenters;
        var tableHtml = "<thead><tr><th>Select Datacenter</th></tr></thead><tbody>";
        for (var i = 0; i < centerList.length; i++) {
            tableHtml += "<tr><td><a class=\"datacenter_select\" id=" +
                centerList[i].dataCenterID + ">" + centerList[i].centerName + "</a></td></tr>";
        }
        tableHtml += "</tbody>";

        document.getElementById("datacenter_table").innerHTML = tableHtml;

        var selectors = document.querySelectorAll(".datacenter_select");

        for (var i = 0; i < selectors.length; i++) {
            selectors[i].addEventListener("click", (event) => {
                var target = event.target || event.srcElement;
                var id = target.id
                ipc.send("loadHistoricalData", [currentRegion, id]);
            });
        }
    });

    ipc.on("historicalDataReturn", (event, arg) => {
        modal = document.querySelector('.modal');
        html = document.querySelector('html');
        modal.classList.add('is-active');
        html.classList.add('is-clipped');
    
        modal.querySelector('#exit').addEventListener('click', function (e) {
            e.preventDefault();
            modal.classList.remove('is-active');
            html.classList.remove('is-clipped');
        });
    });

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

    document.querySelector("#home")
        .addEventListener("click", function () {
            ipc.send("load-home");
        });

    // document.querySelector("#pingchart")
    //     .addEventListener("click", function () {
    //     ipc.send("load-pingchart");
    // });

    //fade listeners
    document.querySelector(".region_select")
        .addEventListener("click", function () {
            el.classList.remove('is-paused');
            ipc.send("loadAllRegions");
        });


    document.querySelector("#twitter")
        .addEventListener("click", function () {
            shell.openExternal("https://twitter.com/RandalfTheGreat");
        });

    ipc.emit("tokenManage");
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

