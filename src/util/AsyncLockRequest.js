import pliny from "pliny";

pliny.class({
  parent: "Util",
  name: "AsyncLockRequest",
  description: "Searches a set of properties from a list of potential browser-vendor-prefixed options for a set of related functions that can be used to make certain types of Full Screen and Orientation Locking requests.",
  parameters: [{
    name: "name ",
    type: "String",
    description: "A friendly name to use in error messages emitted by this locking object."
  }, {
    name: "elementOpts",
    type: "Array",
    description: "An array of potential element names to search the document object that indicate to which DOM element the lock has been acquired."
  }, {
    name: "changeEventOpts",
    type: "Array",
    description: "An array of potential event names for the callback when the lock is acquired."
  }, {
    name: "errorEventOpts",
    type: "Array",
    description: "An array of potential event names for the callback when the lock has failed to be acquired."
  }, {
    name: "requestMethodOpts",
    type: "Array",
    description: "An array of potential method names for initiating the lock request."
  }, {
    name: "exitMethodOpts",
    type: "Array",
    description: "An array of potential method names for canceling the lock."
  }]
});

import findProperty from "./findProperty";

export default class AsyncLockRequest {
  constructor(name, elementOpts, changeEventOpts, errorEventOpts, requestMethodOpts, exitMethodOpts) {

    this.name = name;

    this._elementName = findProperty(document, elementOpts);
    this._requestMethodName = findProperty(document.documentElement, requestMethodOpts);
    this._exitMethodName = findProperty(document, exitMethodOpts);
    this._changeTimeout = null;

    this._changeEventName = findProperty(document, changeEventOpts);
    this._errorEventName = findProperty(document, errorEventOpts);
    this._changeEventName = this._changeEventName && this._changeEventName.substring(2);
    this._errorEventName = this._errorEventName && this._errorEventName.substring(2);

    this._events = {
      change: this._changeEventName,
      error: this._errorEventName
    };

    this.exit = this.exit.bind(this);
    this.request = this.request.bind(this);
  }

  get element(){
    return document[this._elementName];
  }

  get isActive(){
    return !!this.element;
  }

  addEventListener(name, thunk, bubbles){
    if(this._events[name]) {
      document.addEventListener(this._events[name], thunk, bubbles);
    }
  }

  removeEventListener(name, thunk){
    if(this._events[name]) {
      document.removeEventListener(this._events[name], thunk);
    }
  };

  addChangeListener (thunk, bubbles) {
    this.addEventListener("change", thunk, bubbles);
  }

  removeChangeListener(thunk){
    this.removeEventListener("change", thunk);
  }

  addErrorListener(thunk, bubbles) {
    this.addEventListener("error", thunk, bubbles);
  }

  removeErrorListener(thunk){
    this.removeEventListener("error", thunk);
  }

  _withChange(act){
    return new Promise((resolve, reject) => {
      var onSuccess = () => {
          setTimeout(tearDown);
          resolve(this.element);
        },
        onError = (evt) => {
          setTimeout(tearDown);
          reject(evt);
        },
        stop = () => {
          if (this._changeTimeout) {
            clearTimeout(this._changeTimeout);
            this._changeTimeout = null;
          }
        },
        tearDown = () => {
          stop();
          this.removeChangeListener(onSuccess);
          this.removeErrorListener(onError);
        };

      this.addChangeListener(onSuccess, false);
      this.addErrorListener(onError, false);

      if (act()) {
        // we've already gotten lock, so don't wait for it.
        onSuccess();
      }
      else {
        // Timeout waiting on the lock to happen, for systems like iOS that
        // don't properly support it, even though they say they do.
        stop();
        this._changeTimeout = setTimeout(
          () => onError(name + " state did not change in allotted time"),
          1000);
      }
    });
  }

  request(elem, extraParam){
    return this._withChange(() => {
      if (!this._requestMethodName) {
        throw new Error("No " + this.name + " API support.");
      }
      else if (this.isActive) {
        return true;
      }
      else if (extraParam) {
        elem[this._requestMethodName](extraParam);
      }
      else {
        elem[this._requestMethodName]();
      }
    });
  }

  exit(){
    return this._withChange(() => {
      if (!this._exitMethodName) {
        throw new Error("No " + name + " API support.");
      }
      else if (!this.isActive) {
        return true;
      }
      else {
        document[this._exitMethodName]();
      }
    });
  }
}
