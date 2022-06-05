'use strict'

const { ipcRenderer } = require('electron')

process.once('loaded', function () {
  // Forward data from window to main process
  window.addEventListener('message', (event) => {
    if (event.source !== window) return
    if (event.origin !== 'file://') return
    if (event.data?.dst !== 'level') return

    ipcRenderer.send('level', event.data.message)
  })

  // Forward data from main process to window
  ipcRenderer.on('level', (event, message) => {
    window.postMessage({ src: 'level', message })
  })
})
