# electron-demo

**Demo app loading LevelDB into an Electron context.**

[![level badge][level-badge]](https://github.com/Level/awesome)
[![Test](https://img.shields.io/github/workflow/status/Level/electron-demo/Test?label=test)](https://github.com/Level/electron-demo/actions/workflows/test.yml)
[![Standard](https://img.shields.io/badge/standard-informational?logo=javascript&logoColor=fff)](https://standardjs.com)
[![Donate](https://img.shields.io/badge/donate-orange?logo=open-collective&logoColor=fff)](https://opencollective.com/level)

## Get started

```bash
git clone https://github.com/Level/electron-demo.git
cd electron-demo
npm install
npm start
```

You're now ready to use LevelDB. Try running `await db.put('key', 2)` in the devtools console of the Electron window, followed by `await db.get('key')`!

## Architecture

The main process ([`main.js`](./main.js)) opens a LevelDB database using [`level`](https://github.com/Level/level) and exposes it to renderer processes ([`renderer.js`](./renderer.js)) using [`many-level`](https://github.com/Level/many-level). The processes communicate using [Electron IPC](https://www.electronjs.org/docs/latest/api/ipc-main). This approach is a secure default that allows renderer processes to be [sandboxed](https://www.electronjs.org/docs/latest/tutorial/sandbox). As a consequence, `require()` is not available, so we use `browserify` to bundle the JavaScript into a single file.

Alternatively you can enable the potentially insecure [`nodeIntegration` option](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions) and do the following in a renderer process:

```js
const { Level } = require('level')
const db = new Level('./db')
```

But then only one process can open the database at the same time. Another alternative is to use [`browser-level`](https://github.com/Level/browser-level) in renderer processes, if you want each process to have its own database backed by IndexedDB.

As this is a demo, the implementation here (specifically the IPC) is not optimized and does not handle errors. The demo also does not include scripts to package up the Electron app for production (e.g. using `electron-builder`) which will require a few additional steps (e.g. `asarUnpack` in the case of `electron-builder`) due to the use of Node.js native addons.

## Contributing

[`Level/electron-demo`](https://github.com/Level/electron-demo) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

Support us with a monthly donation on [Open Collective](https://opencollective.com/level) and help us continue our work.

## License

[MIT](LICENSE)

[level-badge]: https://leveljs.org/img/badge.svg
