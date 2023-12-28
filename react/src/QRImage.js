// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
import React, { useEffect } from 'react'
import { runGenerate } from './index.js';

export const QrImage = ({ text, size }) => {
    useEffect(() => {
      async function generateAsync() {
        if (text && size) {
          await runGenerate(text, size);
        }
      }

      generateAsync();
    }, [text, size]);
  
    return (<img alt="Loading..." id="qrImage"/>);
  }