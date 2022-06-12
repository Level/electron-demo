'use strict'

const { ManyLevelGuest } = require('many-level')
const { pipeline, Duplex, PassThrough, Writable } = require('readable-stream')

async function main () {
  // Use database of main process as if it was a regular local database
  const db = new ManyLevelGuest({ valueEncoding: 'json' })

  // Wrap Electron IPC in a duplex Node.js stream
  const ipcStream = wrapIPC()

  pipeline(ipcStream, db.createRpcStream(), ipcStream, (err) => {
    // Called when streams close, with an optional error
    console.log('Disconnected', err)
  })

  await db.put('example', 'hello world')
  console.log(await db.get('example'))

  // Expose as global for easy access in devtools console
  window.db = db
}

main()

function wrapIPC () {
  const handleMessage = (event) => {
    if (event.source !== window) return
    if (event.origin !== 'file://') return
    if (event.data?.src !== 'level') return

    readable.write(event.data.message)
  }

  // Data sent from main process to renderer (via preload script)
  const readable = new PassThrough({
    construct (callback) {
      window.addEventListener('message', handleMessage)
      callback()
    },
    destroy (err, callback) {
      window.removeEventListener('message', handleMessage)
      callback(err)
    }
  })

  // Data sent from renderer to main process (via preload script)
  const writable = new Writable({
    write (chunk, _, next) {
      window.postMessage({ dst: 'level', message: chunk })
      next()
    }
  })

  return Duplex.from({ readable, writable })
}
