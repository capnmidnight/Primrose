class Automator {
  constructor(root = window) {
    this.root = root;
    this.frames = [];
    this.startT = null;
    this.listeners = {
      frame: []
    };
  }

  addEventListener(evt, thunk) {
    if (this.listeners[evt]) {
      this.listeners[evt].push(thunk);
    }
  }

  removeEventListener(evt, thunk) {
    if (this.listeners[evt]) {
      const idx = this.listeners[evt].indexOf(thunk);
      if (idx > -1) {
        this.listeners[evt].splice(idx, 1);
      }
    }
  }

  emit(evt, args) {
    for (var i = 0; i < this.listeners[evt].length; ++i) {
      this.listeners[evt][i](args);
    }
  }

  update(t) {
    if (this.startT === null) {
      this.startT = t;
    }
  }

  reset() {
    this.frames.splice(0);
    this.startT = null;
  }

  get length() {
    return this.frames.length;
  }
}