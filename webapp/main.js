const electron = require('electron');
var { app, BrowserWindow, ipcMain } = electron;
var traceroute = require('nodejs-traceroute');
const request = require('superagent');

var isp;
var token = null;

var status = false; //log in status
var userName = null;

// Module to control application life.
//const app = electron.app
// Module to create native browser window.
//const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

//to reach databasee
var ipAddr = "104.45.146.84";
var PORT = "8080";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
var loginWindow = null;
var pingchartWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: true,
    icon: path.join(__dirname, 'img/icons/64x64.png')
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.setMenu(null);
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// ipcMain.on('load-login', function () {
//   if (loginWindow) {
//       return;
//   }

//   loginWindow = new BrowserWindow({
//       height: 200,
//       resizable: false,
//       width: 200
//   });

//   loginWindow.setMenu(null);

//   loginWindow.loadUrl('file://' + __dirname + '../webapp/login.html');

//   loginWindow.on('closed', function () {
//       loginWindow = null;
//   });
// });

ipcMain.on('load-pingchart', function () {

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'pingchart.html'),
    protocol: 'file:',
    slashes: true
  }))

});

ipcMain.on('load-home', function () {

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

});

ipcMain.on('load-regionchart', function () {

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'regionchart.html'),
    protocol: 'file:',
    slashes: true
  }))

});

ipcMain.on("game-selected", (event, game) => {

  var lat_long = [];
  request.post(ipAddr + ":" + PORT + "/datacenters/forgame")
    .set({ id: game })
    .end((err, res) => {
      //console.log(res.text);
      if (err) {
        //todo error
      } else {
        var data = JSON.parse(res.text);
        //lat_long.push(data.latitude);
        //lat_long.push(data.longitude);
        event.sender.send("game-selected-reply", data);
      }
    });
});

ipcMain.on("datacenter-selected", (event, datacenter) => {
  console.log(datacenter);
  request.post(ipAddr + ":" + PORT + "/datacenters/forid")
    .set({ id: datacenter })
    .end((err, res) => {
      var data = JSON.parse(res.text);
      if (!data.success) {
        //todo error
      } else {
        //console.log(data);
        event.sender.send("datacenter-selected-reply", data.ipAddr);
      }
    });
});

ipcMain.on('test', (event, pingAddr) => {
  console.log(pingAddr);
  var ping_traceroute = [];

  const tracer = new traceroute();
  var timeoutCount, rtt1, rtt2, rtt3, count = 0;
  var rtt1S, rtt2S, rtt3S;
  tracer.on('hop', (hop) => {
    //console.log(`hop: ${JSON.stringify(hop)}`);
    if (hop.rtt1 === "*") {
      timeoutCount++;
    } else {
      count++;
      rtt1S = hop.rtt1;
      rtt2S = hop.rtt2;
      rtt3S = hop.rtt3;
      rtt1S = rtt1S.substring(0, rtt1S.indexOf(" "));
      rtt2S = rtt2S.substring(0, rtt2S.indexOf(" "));
      rtt3S = rtt3S.substring(0, rtt3S.indexOf(" "));
      timeoutCount = 0;
    }
   
    if (timeoutCount == 3) {
      //somehow break out of this
      var sum = parseInt(rtt1S, 10) + parseInt(rtt2S, 10) + parseInt(rtt3S);
      var divided = sum / 3;
      var avg = Math.trunc(divided);

      ping_traceroute.push(avg);
      ping_traceroute.push(count);
      event.sender.send('test-reply', ping_traceroute);
      return;
    }
  }).on('close', (code) => {
    //console.log(`close: code ${code}`);
    var sum = parseInt(rtt1S, 10) + parseInt(rtt2S, 10) + parseInt(rtt3S);
    var divided = sum / 3;
    var avg = Math.trunc(divided);
    ping_traceroute.push(avg);
    ping_traceroute.push(count);
    event.sender.send('test-reply', ping_traceroute);
  });
  tracer.trace(pingAddr);

});

//Post register data
//implement verification + end case in the future
ipcMain.on("login", (event, emailGiven, passwordGiven) => {
  request.post(ipAddr + ":" + PORT + "/user/login")
    .set({ email: emailGiven, password: passwordGiven })
    .end((err, res) => {
      if (err) {
        // alert("Oh no! Login error");
        console.log(err);
      }
      //res is always in json
      else {
        var data = JSON.parse(res.text);
        console.log(data.success);
        if (data.success) {
          token = data.token;
          event.sender.send("loginSwap",token);
        }
      }

    });
});

ipcMain.on("register", (event, emailGiven, passwordGiven) => {
  request.post(ipAddr + ":" + PORT + "/user/register")
    .set({ email: emailGiven, password: passwordGiven })
    .end((err, res) => {
      if (err) {
        // alert("Oh no! Login error");
        console.log(err);
      }
      //res is always in json
      else {
        var data = JSON.parse(res.text);
        if (data.success) {
          token = data.token;
          event.sender.send("loginSwap",token);
        }
      }

    });
});

ipcMain.on("loadAllGames", (event) => {
  request.get(ipAddr + ":" + PORT + "/games/all", function (err, res) {
    if (err) {
      // alert("Oh no! Login error");
      console.log(err);
    } else {
      var data = JSON.parse(res.text);
      event.sender.send("gamesReturn", data);
    }
  });
});

ipcMain.on("loadAllRegions", (event, arg) => {
  request.get(ipAddr + ":" + PORT + "/regions/all", function (err, res) {
    if (err) {
      // alert("Oh no! Login error");
      console.log(err);
    } else {
      var data = JSON.parse(res.text);
      event.sender.send("regionReturn", data);
    }
  });
});

ipcMain.on("loadDataCenterForGame", (event, arg) => {
  request.post(ipAddr + ":" + PORT + "/datacenters/forgame")
  .set({ id: arg })
  .end((err, res) => {
    if (err) {
      // alert("Oh no! Login error");
      console.log(err);
    } else {
      var data = JSON.parse(res.text);
      event.sender.send("dataCenterForGameReturn", data);
    }
  });
});

ipcMain.on("loadHistoricalData", (event, arg) => {
  request.post(ipAddr + ":" + PORT + "/historical")
  .set({ dataCenterID: arg[1], regionID: arg[0] })
  .end((err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.text);
      var data = JSON.parse(res.text);
      event.sender.send("historicalDataReturn", data);
    }
  });
});

ipcMain.on("gamePop", (event, arg) => {
  request.get(ipAddr + ":" + PORT + "/games/all", function (err, res) {
    if (err) {
      // alert("Oh no! Login error");
      console.log(err);
    } else {
      var data = JSON.parse(res.text);
      event.sender.send("gamesReturn", data);
    }
  });
});

ipcMain.on("tokenManage", (event,arg) => {
  event.sender.send("loginSwap",token);
});


ipcMain.on("tokenGrab", (event,arg) => {
  console.log("reach grab");
  event.sender.send("tokenRetrieve",token);
});

