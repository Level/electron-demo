const { app, BrowserWindow } = require('electron')
const path = require('path')

app.on('window-all-closed', function () {
  app.quit()
})

app.on('ready', function () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Security-wise this is not recommended
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  window.loadURL('file://' + path.join(__dirname, 'index.html'))
  window.openDevTools()
})
