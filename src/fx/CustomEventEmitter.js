Primrose.CustomEventEmitter = (function () {
  "use strict";

  class CustomEventEmitter {
    constructor(){
      this._handlers = {};
    }

    addEventListener(name, thunk){
      if(!this._handlers[name]){
        this._handlers[name] = [];
      }
      this._handlers[name].push(thunk);
    }

    removeEventListener(name, thunk){
      if(this._handlers[name]){
        var idx = this._handlers[name].indexOf(thunk);
        if(idx > -1){
          this._handlers[name].splice(idx, 1);
        }
      }
    }

    emit(name, obj){
      if(this._handlers[name]){
        for(const thunk of this._handlers[name]){
          thunk(obj);
        }
      }
    }
  }

  return CustomEventEmitter;
})();