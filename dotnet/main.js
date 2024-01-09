// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let dotnetWorker = null;
let exportsReady = false;

export async function setUpWorker() {
    dotnetWorker = new Worker('./qr/dotnetWorker.js', { type: "module" } );

    dotnetWorker.addEventListener('message', function(e) {
        switch (e.data.command)
        {
            case "exportsReady":
                exportsReady = true;
                console.log("Received exports ready");
                eventEmitter.emit('exportsReady');
                break;
            case "error":
                if (e.data.message === undefined)
                    new Error("Inner error, got empty error message from worker");
                eventEmitter.emit('errorOccurred', e.data.message);
                break;
            case "generateQRCodeResponse":
                if (e.data.image === undefined)
                    new Error("Inner error, got empty QR image from worker");
                let uint8Array = new Uint8Array(e.data.image);
                let binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
                let base64String = btoa(binaryString);
                document.getElementById("qrImage").src = `data:image/bmp;base64, ${base64String}`;
            default:
                console.log('Worker said: ', e.data);
            break;
        }
    }, false);
}

export function launchDotnet() {
    if (!dotnetWorker)
    {
        throw new Error("Set up the webworker before launching.");
    }
    dotnetWorker.postMessage({ command: "startDotnet" });
}

export function generate(text, size) {
    if (!exportsReady)
    {
        throw new Error("Exports not ready yet, cannot generate QR code");
    }
    dotnetWorker.postMessage({ command: "generateQRCode", text: text, size: size });
}

class EventEmitter {
    constructor() { this.events = {}; }
  
    on(eventName, callback) {
      if (!this.events[eventName]) 
        this.events[eventName] = [];
      this.events[eventName].push(callback);
    }
  
    emit(eventName, ...args) {
      if (this.events[eventName])
        this.events[eventName].forEach((callback) => callback(...args));
    }
}

export const eventEmitter = new EventEmitter();