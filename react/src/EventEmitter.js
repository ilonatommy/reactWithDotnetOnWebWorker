// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
export class EventEmitter {
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