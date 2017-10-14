const electron = require('electron');  
var {app, BrowserWindow, ipcMain} = electron;
var ping = require('ping');
var traceroute = require('nodejs-traceroute');

// Module to control application life.
//const app = electron.app
// Module to create native browser window.
//const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

//to reach databasee
var ipAddr = "104.45.146.84";
var PORT = 8080;



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
var loginWindow = null;
var pingchartWindow = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 768, frame: true})

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


ipcMain.on('load-login', function () {
  if (loginWindow) {
      return;
  }

  loginWindow = new BrowserWindow({
      height: 200,
      resizable: false,
      width: 200
  });

  loginWindow.setMenu(null);

  loginWindow.loadUrl('file://' + __dirname + '../webapp/login.html');

  loginWindow.on('closed', function () {
      loginWindow = null;
  });
});

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

ipcMain.on('test', (event, arg) => {
  console.log(arg);
  var ping_traceroute = [];
  ping.promise.probe(arg)
    .then(function (res) {
      ping_traceroute.push(res);
      console.log("starting tracert");
      const tracer = new traceroute();
      var count = 0;
      tracer.on('destination', (destination) => {
                //console.log(`destination: ${destination}`);
            })
            .on('hop', (hop) => {
                //console.log(`hop: ${JSON.stringify(hop)}`);
                count++;
            })
            .on('close', (code) => {
                //console.log(`close: code ${code}`);
                ping_traceroute.push(count);
                event.sender.send('test-reply', ping_traceroute);
            });
      tracer.trace(res.host);
    });
});

//Post register data
//implement verification + end case in the future
function register(emailGiven, passwordGiven) {

  
  var request = require("..");
  request.post(ipAddr+":"+PORT+"/user/register")
        .send({email: emailGiven, password: passwordGiven})
        .set("accept", "json")
        .end((err,res) => {
            if(err) {
                //
            }
            //res is always in json


        });
}

function login(error, msg,tok){
  var request;  
  request.post(ipAddr+":"+PORT+"/user/register")
        .send({errorbool: error, message:msg, token: token})
        .set("accept","json")
        .end((err,res) => {
          if(err) {
              //
          }
          //res is always in json
  });
}