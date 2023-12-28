// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
import React, { useState, useEffect } from 'react';
import { getEventEmitter } from './index.js';
import './Popup.css';

export const Popup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
  
    const eventEmitter = getEventEmitter();
    const togglePopup = () => {
      setIsOpen(!isOpen);
    };

    const showPopup = (message) => {
        setPopupMessage(message);
        setIsOpen(true);
    };

    useEffect(() => {
        const errorOccurredHandler = (message) => {
            showPopup(message);
        };
        eventEmitter.on('errorOccurred', errorOccurredHandler);
    }, [eventEmitter]);

    return (
        <div className="popup-container">
            {isOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Error</h2>
                        <p>{popupMessage}</p>
                        <button onClick={togglePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}