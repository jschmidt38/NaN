"use strict";

const {shell} = require('electron')

var ipc = require("electron").ipcRenderer;
var path = require("path");

const electron = require('electron'); 
var ipcMain = electron;

var key = "Ah-fxnT1s5WVvzbmH-OZNl7AeUF4pLpNMfgz4WYn5WOnH9cyQDJCKksgWvYNhmo-";
var url = "http://dev.virtualearth.net/REST/v1/Imagery/Map";

var btn = document.querySelector('.js-btn');
var el = document.querySelector('.js-fade');

var loginButton = document.querySelector("#login");
var regButton = document.querySelector("#register");
var greetingString = document.querySelector("#greeting");

var modal = null;  
var html = null;

// btn.addEventListener('click', function(e){
//   el.classList.remove('is-paused');
// });

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

  // document.querySelector("#pingchart")
  //     .addEventListener("click", function () {
  //     ipc.send("load-pingchart");
  // });

  //fade listeners
  document.querySelector("#nne")
      .addEventListener("click", function () {
      el.classList.remove('is-paused');
  });

  document.querySelector("#nse")
      .addEventListener("click", function () {
      el.classList.remove('is-paused');
  });

  document.querySelector("#nmw")
      .addEventListener("click", function () {
      el.classList.remove('is-paused');
  });

  document.querySelector("#nnw")
      .addEventListener("click", function () {
      el.classList.remove('is-paused');
  });

  document.querySelector("#nsw")
      .addEventListener("click", function () {
      el.classList.remove('is-paused');
  });

  document.querySelector("#ee")
      .addEventListener("click", function () {
      el.classList.remove('is-paused');
  });

  document.querySelector("#ew")
      .addEventListener("click", function () {
      el.classList.remove('is-paused');
  });

  document.querySelector("#oce")
      .addEventListener("click", function () {
      el.classList.remove('is-paused');
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

document.querySelector('#lol').addEventListener('click', function(event) {
  event.preventDefault();
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

document.querySelector('#ffxiv').addEventListener('click', function(event) {
  event.preventDefault();
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

document.querySelector('#wow').addEventListener('click', function(event) {
  event.preventDefault();
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