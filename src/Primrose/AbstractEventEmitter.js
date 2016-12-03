pliny.class({
  parent: "Primrose",
  name: "AbstractEventEmitter",
  description: "The base-class from which all event-emitting classes inherit."
})

export default class AbstractEventEmitter {
  constructor() {
    this._handlers = {};
  }

  addEventListener(evt, thunk) {

    pliny.method({
      parent: "Primrose.AbstractEventEmitter",
      name: "addEventListener",
      description: "Register a function as a listener for a named event.",
      parameters: [{
        name: "evt",
        type: "String",
        description: "The name of the event for which to listen."
      }, {
        name: "thunk",
        type: "Function",
        description: "The function to use as the event handler."
      }]
    });

    if (!this._handlers[evt]) {
      this._handlers[evt] = [];
    }
    this._handlers[evt].push(thunk);
  }

  removeEventListener(evt, thunk) {

    pliny.method({
      parent: "Primrose.AbstractEventEmitter",
      name: "removeEventListener",
      description: "Remove a function from being a listener for a named event.",
      parameters: [{
        name: "evt",
        type: "String",
        description: "The name of the event for which to remove a listener."
      }, {
        name: "thunk",
        type: "Function",
        description: "The function to remove as a listener."
      }]
    });

    if (this._handlers[evt]) {
      var idx = this._handlers[evt].indexOf(thunk);
      if (idx > -1) {
        this._handlers[evt].splice(idx, 1);
      }
    }
  }

  forward(obj, evts){

    pliny.method({
      parent: "Primrose.AbstractEventEmitter",
      name: "forward",
      description: "Copy all events from this object to another.",
      parameters: [{
        name: "obj",
        type: "Primrose.AbstractEventEmitter",
        description: "The object to which to forward the events."
      }, {
        name: "evts",
        type: "Array of String",
        description: "The events to copy."
      }]
    });

    evts.forEach((evt) => this.addEventListener(evt, obj.emit.bind(obj, evt)));
  }

  emit(evt, obj) {

    pliny.method({
      parent: "Primrose.AbstractEventEmitter",
      name: "emit",
      description: "Fire an event.",
      parameters: [{
        name: "evt",
        type: "String",
        description: "The name of the event to fire."
      }, {
        name: "obj",
        type: "Object",
        description: "The value to pass to the event handlers."
      }]
    });

    if (this._handlers[evt]) {
      if(typeof obj === "object" && !(obj instanceof Event)){
        obj.type = evt;
        if(obj.defaultPrevented === undefined){
          obj.defaultPrevented = false;
          obj.preventDefault = () => obj.defaultPrevented = true;
        }
      }
      const h = this._handlers[evt];
      for (let i = 0; h && i < h.length; ++i) {
        h[i](obj);
        if(obj && obj.defaultPrevented){
          return;
        }
      }
    }
  }
};