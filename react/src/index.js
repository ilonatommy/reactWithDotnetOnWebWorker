// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const mainJsPath = '../../qr/main.js';
const { setUpWorker, launchDotnet, generate, eventEmitter } = await import(/* webpackIgnore: true */mainJsPath);
await setUpWorker();
launchDotnet();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export function runGenerate(text, size) {
  generate(text, size);
}

export function getEventEmitter() {
  return eventEmitter;
}