// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
import './App.css';
import { useState, useEffect } from 'react';
import { Popup } from './Popup.js';
import debounce from 'lodash.debounce';
import { QrImage } from './QRImage.js';
import React from 'react';
import { getEventEmitter } from './index.js';
import { BarLoader } from 'react-spinners';

function App() {
  const initText = "Type text to generate QR";
  const initSize = 5;
  const [text, setText] = useState(initText);
  const [size, setSize] = useState(initSize);
  const eventEmitter = getEventEmitter();
  const [exportsReady, setExportsReady] = useState(false);
  const debouncedSetText = debounce(e => setText(e.target.value), 100);
  const debouncedSetSize = debounce(e => setSize(e.target.value), 100);

  useEffect(() => {
    const finishWaiting = () => {
      setExportsReady(true);
    };
    eventEmitter.on('exportsReady', finishWaiting);
  }, [eventEmitter]);

  return (
    <div className="App">
      <header className="App-header">
      <div className="GitHub-project-info">
        <p>
          This demo is available on GitHub:
          <br />
          <a href="https://github.com/ilonatommy/reactWithDotnetOnWebWorker">GitHub Project Link</a>
        </p>
        </div>
        <div>
          {!exportsReady ? (
          // Display the spinner while exports are not ready
          <div className="spinner">
            <BarLoader color="#36D7B7" loading={!exportsReady} />
            Loading...
          </div>
          ) : (
          // Display the main content when exports are ready
          <div className="main-content">
            <p>
              Generate a QR from text:
              <br />
              <input type="text" placeholder={initText} onChange={debouncedSetText} />
              <br />
              Set size of QR (in pixels):
              <br />
              <input type="number" placeholder={initSize} onChange={debouncedSetSize} />
            </p>
            <Popup />
            <div>
              <QrImage text={text} size={size} id="qrImage"/>
            </div>
            <p>
              QRCoder from <a href="https://github.com/codebude/QRCoder">https://github.com/codebude/QRCoder</a>
            </p>
            <p>
              WASM QR generator from <a href="https://github.com/maraf/dotnet-wasm-react">https://github.com/maraf/dotnet-wasm-react</a>
            </p>
          </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
