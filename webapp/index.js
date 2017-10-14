// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';

var ipc = require('electron').ipcRenderer;
var remote = require('remote');
var Tray = remote.require('tray');
var Menu = remote.require('menu');
var path = require('path');

var login = document.querySelector('.button.is-link');
login.addEventListener('click', function () {
    ipc.send('load-login');
});

