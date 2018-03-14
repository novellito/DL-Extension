const { app, ipcMain, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// require('electron-context-menu')(); for inspect element


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

exports.handleForm = function handleForm(targetWindow, firstname) {
  console.log("this is the firstname from the form ->", firstname);
  targetWindow.webContents.send('form-received', "we got it");
};


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, resizable:false});
  // mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
}


ipcMain.on('form-submission', function (event, firstname) {
  console.log("this is the firstname from the form ->", firstname)
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})
