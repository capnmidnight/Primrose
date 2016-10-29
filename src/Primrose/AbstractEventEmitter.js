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

  forward(obj, evts){
    evts.forEach((evt) => this.addEventListener(evt, obj.emit.bind(obj, evt)));
  }

  emit(name, obj) {
    if (this._handlers[name]) {
      if(typeof obj === "object" && !(obj instanceof Event)){
        obj.type = name;
        if(obj.defaultPrevented === undefined){
          obj.defaultPrevented = false;
          obj.preventDefault = () => obj.defaultPrevented = true;
        }
      }
      const h = this._handlers[name];
      for (let i = 0; h && i < h.length; ++i) {
        h[i](obj);
        if(obj && obj.defaultPrevented){
          return;
        }
      }
    }
  }
}