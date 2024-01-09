# README

Live demo: https://ashy-island-008420303.4.azurestaticapps.net/

## Setup

### Linux

Long version, from root:

``` bash
# builds the dotnet project, creating build artifacts in dist/dotnet
dotnet publish -c Debug ./dotnet/qr.csproj
cd react
# installs node packages:
npm install
# cleans the previous dotnet artifacts and copies build output into './public/qr'
npm run integrate
# builds react app
npm run build
# launches
npm run start
```

Short version, from `react` directory:

``` bash
npm install
npm run build:all:debug
npm run start
```

### Windows

Same as Linux but with `Win` suffix, e.g. `npm run integrateWin`, `buildWin:all:debug`.

## Communication

The React application runs in the main thread, that has access to DOM. It imports functions for launching a .NET runtime on a Web Worker from a WebAssembly (WASM) application (refer to [index.js](master/react/src/index.js) and [main.js](master/react/src/main.js)) and executes them. These functions establish a Web Worker using the [dotnetWorker.js](master/dotnet/dotnetWorker.js) file. Web Worker can perform heavy tasks without blocking the UI, however it does not have direct control over DOM and relies on communication with main thread for changes to UI. Communication between the Web Worker and the main thread occurs through message passing. The demo includes a few simple examples of passing information from dotnet to React frontend and the other way.

From react to dotnet - QR generation request.
From dotnet to react - populating frontend element with data.

      +------------------+          +--------------------------------------------------------------+
      | React App        |          | WASM App                          +-------------------------+|
      | (Main Thread)    |          | (Main Thread)                     | Web Worker file         ||
      |  +--------------+|          | +------------------+              | (WebWorker Thread)      ||
      |  | QrImage      ||          | | file with        |              |  +--------------------+ ||
      |  | Component    ||          | | imports to React |              |  |   C#'s exports     | ||
      |  |              || Imported | |                  | Message      |  |   (QR Generation)  | ||
      |  | +----------+ || Function | | +------------+   | Passing      |  +--------------------+ ||
      |  | | Button   | || Call     | | | generate() |   | -----------> |                         ||
      |  | | onClick  | || -------> | | | function   |   |              |    ^   Built-in   |     ||
      |  | +----------+ ||          | | +------------+   | Message      |    |   interop    V     ||
      |  | +----------+ || Access   | | +------------+   | Passing      |                         ||
      |  | | QR Image | || DOM      | | | Set qrImage|   | Transferable |  +--------------------+ ||
      |  | | Display  | || <------- | | | src        |   | <----------- |  |   JS's imports     | ||
      |  | +----------+ ||          | | +------------+   |              |  +--------------------+ ||
      |  +--------------+|          | +------------------+              +-------------------------+|
      +------------------+          +--------------------------------------------------------------+

From dotnet to react - exports ready.

      +-------------------+          +--------------------------------------------------------+
      | React App         |          | WASM App                      +-----------------------+|
      | (Main Thread)     |          | (Main Thread)                 | Web Worker file       ||
      |+-----------------+|          | +------------------+          | (WebWorker Thread)    ||
      || QrImage         ||          | | file with        |          |                       ||
      || Component       ||          | | imports to React |          |                       ||
      ||                 ||          | |                  |          |                       ||
      || +-------------+ ||          | | +-------------+  | Message  | +------------------+  ||
      || |             | ||  Event   | | |             |  | Passing  | |                  |  ||
      || | EventEmitter| || <------- | | | EventEmitter|  | <------  | | JS               |  ||
      || | on('READY') | ||          | | | emit()      |  |  READY   | | (starting dotnet)|  ||
      || | re-render   | ||          | | |             |  |          | |                  |  ||
      || |             | ||          | | |             |  |          | |                  |  ||
      || +-------------+ ||          | | +-------------+  |          | +------------------+  ||
      |+-----------------+|          | +------------------+          +-----------------------+|
      +-------------------+          +--------------------------------------------------------+