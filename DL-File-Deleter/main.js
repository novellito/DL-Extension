const { app, ipcMain, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

exports.handleForm = async function handleForm(targetWindow, data) {
  data.files ? await targetWindow.webContents.send('send-files', data) 
    : await targetWindow.webContents.send('send-folders', data);
};

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 900, resizable:false});
  // mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', function () { mainWindow = null; });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
