# README

Live demo: https://ashy-island-008420303.4.azurestaticapps.net/

## Setup

Make sure to have `wasm-tools` workload installed:

```bash
cd dotnet
dotnet workload restore
```

### Linux

Long version, from root:

``` bash
# builds the dotnet project, creating build artifacts in dist/dotnet
dotnet publish -c Debug ./dotnet/QRGenerator.csproj
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

The React application runs in the main thread, that has access to DOM. It imports functions for launching a .NET runtime on a Web Worker from a WebAssembly (WASM) application (refer to [client.js](react/src/client.js)) and executes them. These functions establish a Web Worker using the [worker.js](dotnet/wwwroot/worker.js) file. Web Worker can perform heavy tasks without blocking the UI, however it does not have direct control over DOM and relies on communication with main thread for changes to UI. Communication between the Web Worker and the main thread occurs through message passing. The demo includes a few simple examples of passing information from dotnet to React frontend and the other way.

From react to dotnet - QR generation request.

From dotnet to react - populating frontend element with data.

      +-----------------------------------------------+              +---------------------+
      | React App                                     |              | WASM App            |
      | (Main Thread)                                 |              | (WebWorker Thread)  |
      |+-----------------+          +----------------+|              | +------------------+|
      || QrImage         |          | client.js      ||              | |  C#'s exports    ||
      || Component       |          |                || Message      | |  (QR Generation) ||
      ||                 | client   |                || Passing      | |                  ||
      ||+--------------+ | API      | +-------------+|| -----------> | +------------------+|
      ||| Button       | | Call     | | generate()  |||              |                     |
      ||| onClick      | | -------> | | function    ||| Message      |   ^   Built-in   |  |
      ||+--------------+ |          | |             ||| Passing      |   |   interop    V  |
      ||+--------------+ |          | |             ||| Transferable |                     |
      |||              | | update   | |             ||| <----------- | +------------------+|
      ||| <img src=..> | | <------- | |             |||  IMAGE       | |  JS's imports    ||
      |||              | |          | |             |||              | |                  ||
      ||+--------------+ |          | +-------------+||              | |                  ||
      |+-----------------+          +----------------+|              | +------------------+|
      +-----------------------------------------------+              +---------------------+
