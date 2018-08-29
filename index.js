var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow

var mainWindow = null

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })
  mainWindow.loadURL('file://' + __dirname + '/index.html') // eslint-disable-line

  mainWindow.openDevTools()

  mainWindow.on('closed', function () { mainWindow = null })
})
