// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
import React, { useEffect, useState } from 'react'
import { runGenerate } from './index.js';
import { getEventEmitter } from './index.js';

export const QrImage = ({ text, size }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const eventEmitter = getEventEmitter();

  useEffect(() => {
    async function generateAsync() {
      if (text && size) {
        await runGenerate(text, size);
      }
    }

    generateAsync();
  }, [text, size]);

  useEffect(() => {
    const qrHandler = (data) => {
      if (data) {
        const blob = new Blob([data], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    };
    eventEmitter.on('generateQRCodeResponse', qrHandler);
  }, [eventEmitter]);

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="QR Code" />
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};