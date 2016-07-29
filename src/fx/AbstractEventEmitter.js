Primrose.AbstractEventEmitter = (function () {
  "use strict";

  class AbstractEventEmitter {
    constructor() {
      this._handlers = {};
    }

    addEventListener(name, thunk) {
      if (!this._handlers[name]) {
        this._handlers[name] = [];
      }
      this._handlers[name].push(thunk);
    }

    removeEventListener(name, thunk) {
      if (this._handlers[name]) {
        var idx = this._handlers[name].indexOf(thunk);
        if (idx > -1) {
          this._handlers[name].splice(idx, 1);
        }
      }
    }

    emit(name, obj) {
      if (this._handlers[name]) {
        for(var i = 0; i < this._handlers[name].length; ++i) {
          this._handlers[name][i](obj);
        }
      }
    }
  }

  return AbstractEventEmitter;
})();