'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const { Level } = require('level')
const { ManyLevelHost } = require('many-level')
const { pipeline, Duplex, PassThrough, Writable } = require('readable-stream')
const { join } = require('path')

const db = new Level('./db')
const host = new ManyLevelHost(db)

app.enableSandbox()
app.once('ready', function () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Enables renderer process to communicate with us
      preload: join(__dirname, 'preload.js')
    }
  })

  window.loadURL('file://' + join(__dirname, 'renderer.html'))
  window.openDevTools()

  // Wrap Electron IPC in a duplex Node.js stream
  const ipcStream = wrapIPC(window.webContents)

  pipeline(ipcStream, host.createRpcStream(), ipcStream, (err) => {
    // Called when streams close, with an optional error
    console.log('Disconnected', err)
  })
})

app.on('window-all-closed', function () {
  app.quit()
})

function wrapIPC (webContents) {
  const handleMessage = (event, msg) => {
    if (event.sender === webContents) {
      readable.write(msg)
    }
  }

  // Data sent from renderer to main process (via preload script)
  const readable = new PassThrough({
    construct (callback) {
      ipcMain.on('level', handleMessage)
      callback()
    },
    destroy (err, callback) {
      ipcMain.removeListener('level', handleMessage)
      callback(err)
    }
  })

  // Data sent from main process to renderer (via preload script)
  const writable = new Writable({
    write (chunk, _, next) {
      webContents.send('level', chunk)
      next()
    }
  })

  // TODO: destroy on window close
  return Duplex.from({ readable, writable })
}
