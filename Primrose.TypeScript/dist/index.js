// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/typeChecks.ts
function t(o, s, c) {
  return typeof o === s || o instanceof c;
}
function isFunction(obj) {
  return t(obj, "function", Function);
}
function isString(obj) {
  return t(obj, "string", String);
}
function isBoolean(obj) {
  return t(obj, "boolean", Boolean);
}
function isObject(obj) {
  return isDefined(obj) && t(obj, "object", Object);
}
function isNullOrUndefined(obj) {
  return obj === null || obj === void 0;
}
function isDefined(obj) {
  return !isNullOrUndefined(obj);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrays.ts
function arrayClear(arr) {
  return arr.splice(0);
}
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}
function arrayReplace(arr, ...items) {
  arr.splice(0, arr.length, ...items);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/EventBase.ts
var EventBase = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
    this.listenerOptions = /* @__PURE__ */ new Map();
  }
  addEventListener(type2, callback, options) {
    if (isFunction(callback)) {
      let listeners = this.listeners.get(type2);
      if (!listeners) {
        listeners = new Array();
        this.listeners.set(type2, listeners);
      }
      if (!listeners.find((c) => c === callback)) {
        listeners.push(callback);
        if (options) {
          this.listenerOptions.set(callback, options);
        }
      }
    }
  }
  removeEventListener(type2, callback) {
    if (isFunction(callback)) {
      const listeners = this.listeners.get(type2);
      if (listeners) {
        this.removeListener(listeners, callback);
      }
    }
  }
  clearEventListeners(type2) {
    for (const [evtName, handlers] of this.listeners) {
      if (isNullOrUndefined(type2) || type2 === evtName) {
        for (const handler of handlers) {
          this.removeEventListener(type2, handler);
        }
        arrayClear(handlers);
        this.listeners.delete(evtName);
      }
    }
  }
  removeListener(listeners, callback) {
    const idx = listeners.findIndex((c) => c === callback);
    if (idx >= 0) {
      arrayRemoveAt(listeners, idx);
      if (this.listenerOptions.has(callback)) {
        this.listenerOptions.delete(callback);
      }
    }
  }
  dispatchEvent(evt) {
    const listeners = this.listeners.get(evt.type);
    if (listeners) {
      for (const callback of listeners) {
        const options = this.listenerOptions.get(callback);
        if (isDefined(options) && !isBoolean(options) && options.once) {
          this.removeListener(listeners, callback);
        }
        callback.call(this, evt);
      }
    }
    return !evt.defaultPrevented;
  }
};
var TypedEvent = class extends Event {
  get type() {
    return super.type;
  }
  constructor(type2, eventInitDict) {
    super(type2, eventInitDict);
  }
};
var TypedEventBase = class extends EventBase {
  constructor() {
    super(...arguments);
    this.bubblers = /* @__PURE__ */ new Set();
    this.scopes = /* @__PURE__ */ new WeakMap();
  }
  addBubbler(bubbler) {
    this.bubblers.add(bubbler);
  }
  removeBubbler(bubbler) {
    this.bubblers.delete(bubbler);
  }
  addEventListener(type2, callback, options) {
    super.addEventListener(type2, callback, options);
  }
  removeEventListener(type2, callback) {
    super.removeEventListener(type2, callback);
  }
  clearEventListeners(type2) {
    return super.clearEventListeners(type2);
  }
  addScopedEventListener(scope, type2, callback, options) {
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, []);
    }
    this.scopes.get(scope).push([type2, callback]);
    this.addEventListener(type2, callback, options);
  }
  removeScope(scope) {
    const listeners = this.scopes.get(scope);
    if (listeners) {
      this.scopes.delete(scope);
      for (const [type2, listener] of listeners) {
        this.removeEventListener(type2, listener);
      }
    }
  }
  dispatchEvent(evt) {
    if (!super.dispatchEvent(evt)) {
      return false;
    }
    if (!evt.cancelBubble) {
      for (const bubbler of this.bubblers) {
        if (!bubbler.dispatchEvent(evt)) {
          return false;
        }
      }
    }
    return true;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/Task.ts
var Task = class {
  constructor(autoStart = true) {
    this.autoStart = autoStart;
    this.onThens = new Array();
    this.onCatches = new Array();
    this._result = void 0;
    this._error = void 0;
    this._executionState = "waiting";
    this._resultState = "none";
    this.resolve = (value) => {
      if (this.running) {
        this._result = value;
        this._resultState = "resolved";
        for (const thenner of this.onThens) {
          thenner(value);
        }
        this.clear();
        this._executionState = "finished";
      }
    };
    this.reject = (reason) => {
      if (this.running) {
        this._error = reason;
        this._resultState = "errored";
        for (const catcher of this.onCatches) {
          catcher(reason);
        }
        this.clear();
        this._executionState = "finished";
      }
    };
    if (this.autoStart) {
      this.start();
    }
  }
  clear() {
    arrayClear(this.onThens);
    arrayClear(this.onCatches);
  }
  start() {
    this._executionState = "running";
  }
  resolver(value) {
    return () => this.resolve(value);
  }
  forEvent() {
    return (evt) => this.resolve(evt);
  }
  resolveOn(target, resolveEvt, value) {
    const resolver = this.resolver(value);
    target.addEventListener(resolveEvt, resolver);
    this.finally(() => target.removeEventListener(resolveEvt, resolver));
  }
  get result() {
    if (isDefined(this.error)) {
      throw this.error;
    }
    return this._result;
  }
  get error() {
    return this._error;
  }
  get executionState() {
    return this._executionState;
  }
  get waiting() {
    return this.executionState === "waiting";
  }
  get started() {
    return this.executionState !== "waiting";
  }
  get running() {
    return this.executionState === "running";
  }
  get finished() {
    return this.executionState === "finished";
  }
  get resultState() {
    return this._resultState;
  }
  get resolved() {
    return this.resultState === "resolved";
  }
  get errored() {
    return this.resultState === "errored";
  }
  get [Symbol.toStringTag]() {
    return this.toString();
  }
  project() {
    return new Promise((resolve, reject) => {
      if (!this.finished) {
        this.onThens.push(resolve);
        this.onCatches.push(reject);
      } else if (this.errored) {
        reject(this.error);
      } else {
        resolve(this.result);
      }
    });
  }
  then(onfulfilled, onrejected) {
    return this.project().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.project().catch(onrejected);
  }
  finally(onfinally) {
    return this.project().finally(onfinally);
  }
  reset() {
    this._reset(this.autoStart);
  }
  restart() {
    this._reset(true);
  }
  _reset(start) {
    if (this.running) {
      this.reject("Resetting previous invocation");
    }
    this.clear();
    this._result = void 0;
    this._error = void 0;
    this._executionState = "waiting";
    this._resultState = "none";
    if (start) {
      this.start();
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/attrs.ts
var Attr = class {
  constructor(key, value, bySetAttribute, ...tags) {
    this.key = key;
    this.value = value;
    this.bySetAttribute = bySetAttribute;
    this.tags = tags.map((t2) => t2.toLocaleUpperCase());
    Object.freeze(this);
  }
  applyToElement(elem) {
    const isDataSet = this.key.startsWith("data-");
    const isValid = this.tags.length === 0 || this.tags.indexOf(elem.tagName) > -1 || isDataSet;
    if (!isValid) {
      console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
    } else if (isDataSet) {
      const subkey = this.key.substring(5);
      elem.dataset[subkey] = this.value;
    } else if (this.key === "style") {
      Object.assign(elem.style, this.value);
    } else if (this.key === "classList") {
      this.value.forEach((v) => elem.classList.add(v));
    } else if (this.bySetAttribute) {
      elem.setAttribute(this.key, this.value);
    } else if (this.key in elem) {
      elem[this.key] = this.value;
    } else if (this.value === false) {
      elem.removeAttribute(this.key);
    } else if (this.value === true) {
      elem.setAttribute(this.key, "");
    } else {
      elem.setAttribute(this.key, this.value);
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/css.ts
function perc(value) {
  return `${value}%`;
}
function getMonospaceFonts() {
  return "ui-monospace, 'Droid Sans Mono', 'Cascadia Mono', 'Segoe UI Mono', 'Ubuntu Mono', 'Roboto Mono', Menlo, Monaco, Consolas, monospace";
}
function getMonospaceFamily() {
  return fontFamily(getMonospaceFonts());
}
var Prop = class {
  constructor(_value) {
    this._value = _value;
  }
  get value() {
    return this._value;
  }
  toString() {
    return this.value;
  }
};
var KeyValueProp = class extends Prop {
  constructor(_name, sep, value) {
    super(value);
    this._name = _name;
    this.sep = sep;
  }
  get name() {
    return this._name;
  }
  toString() {
    return this.name + this.sep + this.value + ";";
  }
};
var CssDeclareProp = class extends KeyValueProp {
  constructor(key, value) {
    super(key, ": ", value);
  }
};
var CssElementStyleProp = class extends CssDeclareProp {
  constructor(key, value) {
    super(key.replace(/[A-Z]/g, (m) => `-${m.toLocaleLowerCase()}`), value.toString());
    this.key = key;
    this.priority = "";
  }
  applyToElement(elem) {
    elem.style[this.key] = this.value + this.priority;
  }
  important() {
    this.priority = " !important";
    return this;
  }
  get value() {
    return super.value + this.priority;
  }
};
function backgroundColor(v) {
  return new CssElementStyleProp("backgroundColor", v);
}
function border(v) {
  return new CssElementStyleProp("border", v);
}
function color(v) {
  return new CssElementStyleProp("color", v);
}
function display(v) {
  return new CssElementStyleProp("display", v);
}
function fontFamily(v) {
  return new CssElementStyleProp("fontFamily", v);
}
function fontStyle(v) {
  return new CssElementStyleProp("fontStyle", v);
}
function fontWeight(v) {
  return new CssElementStyleProp("fontWeight", v);
}
function height(v) {
  return new CssElementStyleProp("height", v);
}
function overflow(...v) {
  return new CssElementStyleProp("overflow", v.join(" "));
}
function padding(...v) {
  return new CssElementStyleProp("padding", v.join(" "));
}
function width(v) {
  return new CssElementStyleProp("width", v);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/tags.ts
function isErsatzElement(obj) {
  if (!isObject(obj)) {
    return false;
  }
  const elem = obj;
  return elem.element instanceof Element;
}
function resolveElement(elem) {
  if (isErsatzElement(elem)) {
    return elem.element;
  }
  return elem;
}
function isIElementAppliable(obj) {
  return isObject(obj) && "applyToElement" in obj && isFunction(obj.applyToElement);
}
function elementApply(elem, ...children) {
  elem = resolveElement(elem);
  for (const child of children) {
    if (isDefined(child)) {
      if (child instanceof Node) {
        elem.append(child);
      } else if (isErsatzElement(child)) {
        elem.append(resolveElement(child));
      } else if (isIElementAppliable(child)) {
        child.applyToElement(elem);
      } else {
        elem.append(document.createTextNode(child.toLocaleString()));
      }
    }
  }
  return elem;
}
function tag(name, ...rest) {
  let elem = null;
  for (const attr of rest) {
    if (attr instanceof Attr && attr.key === "id") {
      elem = document.getElementById(attr.value);
      break;
    }
  }
  if (elem == null) {
    elem = document.createElement(name);
  }
  elementApply(elem, ...rest);
  return elem;
}
function elementClearChildren(elem) {
  elem = resolveElement(elem);
  while (elem.lastChild) {
    elem.lastChild.remove();
  }
}
function BR() {
  return tag("br");
}
function Canvas(...rest) {
  return tag("canvas", ...rest);
}
function Div(...rest) {
  return tag("div", ...rest);
}
function Span(...rest) {
  return tag("span", ...rest);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/canvas.ts
var hasHTMLCanvas = "HTMLCanvasElement" in globalThis;
var hasHTMLImage = "HTMLImageElement" in globalThis;
var disableAdvancedSettings = false;
var hasOffscreenCanvas = !disableAdvancedSettings && "OffscreenCanvas" in globalThis;
var hasImageBitmap = !disableAdvancedSettings && "createImageBitmap" in globalThis;
function isHTMLCanvas(obj) {
  return hasHTMLCanvas && obj instanceof HTMLCanvasElement;
}
function isOffscreenCanvas(obj) {
  return hasOffscreenCanvas && obj instanceof OffscreenCanvas;
}
function isCanvas(obj) {
  return isHTMLCanvas(obj) || isOffscreenCanvas(obj);
}
function testOffscreen2D() {
  try {
    const canv = new OffscreenCanvas(1, 1);
    const g = canv.getContext("2d");
    return g != null;
  } catch (exp) {
    return false;
  }
}
var hasOffscreenCanvasRenderingContext2D = hasOffscreenCanvas && testOffscreen2D();
function testOffscreen3D() {
  try {
    const canv = new OffscreenCanvas(1, 1);
    const g = canv.getContext("webgl2");
    return g != null;
  } catch (exp) {
    return false;
  }
}
var hasOffscreenCanvasRenderingContext3D = hasOffscreenCanvas && testOffscreen3D();
function createOffscreenCanvas(width2, height2) {
  return new OffscreenCanvas(width2, height2);
}
function setCanvasSize(canv, w, h, superscale = 1) {
  w = Math.floor(w * superscale);
  h = Math.floor(h * superscale);
  if (canv.width != w || canv.height != h) {
    canv.width = w;
    canv.height = h;
    return true;
  }
  return false;
}
function is2DRenderingContext(ctx) {
  return isDefined(ctx.textBaseline);
}
function setCanvas2DContextSize(ctx, w, h, superscale = 1) {
  const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled, oldTextBaseline = ctx.textBaseline, oldTextAlign = ctx.textAlign, oldFont = ctx.font, resized = setCanvasSize(
    ctx.canvas,
    w,
    h,
    superscale
  );
  if (resized) {
    ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
    ctx.textBaseline = oldTextBaseline;
    ctx.textAlign = oldTextAlign;
    ctx.font = oldFont;
  }
  return resized;
}
function setContextSize(ctx, w, h, superscale = 1) {
  if (is2DRenderingContext(ctx)) {
    return setCanvas2DContextSize(ctx, w, h, superscale);
  } else {
    return setCanvasSize(
      ctx.canvas,
      w,
      h,
      superscale
    );
  }
}
function resizeContext(ctx, superscale = 1) {
  return setContextSize(
    ctx,
    ctx.canvas.clientWidth,
    ctx.canvas.clientHeight,
    superscale
  );
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/flags.ts
function isFirefox() {
  return "InstallTrigger" in globalThis;
}
function isMacOS() {
  return /^mac/i.test(navigator.platform);
}
function isIOS() {
  return /iP(ad|hone|od)/.test(navigator.platform) || /Macintosh(.*?) FxiOS(.*?)\//.test(navigator.platform) || isMacOS() && "maxTouchPoints" in navigator && navigator.maxTouchPoints > 2;
}
function isApple() {
  return isIOS() || isMacOS();
}
var oculusBrowserPattern = /OculusBrowser\/(\d+)\.(\d+)\.(\d+)/i;
var oculusMatch = /* @__PURE__ */ navigator.userAgent.match(oculusBrowserPattern);
var isOculusBrowser = !!oculusMatch;
var oculusBrowserVersion = isOculusBrowser && {
  major: parseFloat(oculusMatch[1]),
  minor: parseFloat(oculusMatch[2]),
  patch: parseFloat(oculusMatch[3])
};
var isOculusGo = isOculusBrowser && /pacific/i.test(navigator.userAgent);
var isOculusQuest = isOculusBrowser && /quest/i.test(navigator.userAgent);
var isOculusQuest2 = isOculusBrowser && /quest 2/i.test(navigator.userAgent);
var isWorkerSupported = "Worker" in globalThis;

// src/controlTypes.ts
var singleLineOutput = Object.freeze([
  "CursorLeft",
  "CursorRight",
  "CursorSkipLeft",
  "CursorSkipRight",
  "CursorHome",
  "CursorEnd",
  "CursorFullHome",
  "CursorFullEnd",
  "SelectLeft",
  "SelectRight",
  "SelectSkipLeft",
  "SelectSkipRight",
  "SelectHome",
  "SelectEnd",
  "SelectFullHome",
  "SelectFullEnd",
  "SelectAll"
]);
var multiLineOutput = Object.freeze(singleLineOutput.concat([
  "CursorDown",
  "CursorUp",
  "CursorPageDown",
  "CursorPageUp",
  "SelectDown",
  "SelectUp",
  "SelectPageDown",
  "SelectPageUp",
  "ScrollDown",
  "ScrollUp"
]));
var input = [
  "Backspace",
  "Delete",
  "DeleteWordLeft",
  "DeleteWordRight",
  "DeleteLine",
  "Undo",
  "Redo"
];
var singleLineInput = Object.freeze(singleLineOutput.concat(input));
var multiLineInput = Object.freeze(multiLineOutput.concat(input).concat([
  "AppendNewline",
  "PrependNewline"
]));

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/strings/stringReverse.ts
var combiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
var surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;
function stringReverse(str) {
  str = str.replace(combiningMarks, function(_match, capture1, capture2) {
    return stringReverse(capture2) + capture1;
  }).replace(surrogatePair, "$2$1");
  let res = "";
  for (let i = str.length - 1; i >= 0; --i) {
    res += str[i];
  }
  return res;
}

// src/Cursor.ts
var Cursor = class {
  static min(a, b) {
    if (a.i <= b.i) {
      return a;
    }
    return b;
  }
  static max(a, b) {
    if (a.i > b.i) {
      return a;
    }
    return b;
  }
  constructor(i, x, y) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    Object.seal(this);
  }
  clone() {
    return new Cursor(this.i, this.x, this.y);
  }
  toString() {
    return `[i:${this.i} x:${this.x} y:${this.y}]`;
  }
  copy(cursor) {
    this.i = cursor.i;
    this.x = cursor.x;
    this.y = cursor.y;
  }
  fullHome() {
    this.i = 0;
    this.x = 0;
    this.y = 0;
  }
  fullEnd(rows) {
    this.i = 0;
    let lastLength = 0;
    for (let y = 0; y < rows.length; ++y) {
      const row = rows[y];
      lastLength = row.stringLength;
      this.i += lastLength;
    }
    this.y = rows.length - 1;
    this.x = lastLength;
  }
  left(rows, skipAdjust = false) {
    if (this.i > 0) {
      --this.i;
      --this.x;
      if (this.x < 0) {
        --this.y;
        const row = rows[this.y];
        this.x = row.stringLength - 1;
      } else if (!skipAdjust) {
        rows[this.y].adjust(this, -1);
      }
    }
  }
  skipLeft(rows) {
    if (this.x <= 1) {
      this.left(rows);
    } else {
      const x = this.x - 1, row = rows[this.y], word = stringReverse(row.substring(0, x)), m = word.match(/\w+/), dx = m ? m.index + m[0].length + 1 : this.x;
      this.i -= dx;
      this.x -= dx;
      rows[this.y].adjust(this, -1);
    }
  }
  right(rows, skipAdjust = false) {
    const row = rows[this.y];
    if (this.y < rows.length - 1 || this.x < row.stringLength) {
      ++this.i;
      ++this.x;
      if (this.y < rows.length - 1 && this.x === row.stringLength) {
        this.x = 0;
        ++this.y;
      } else if (!skipAdjust) {
        rows[this.y].adjust(this, 1);
      }
    }
  }
  skipRight(rows) {
    const row = rows[this.y];
    if (this.x < row.stringLength - 1) {
      const x = this.x + 1, subrow = row.substring(x), m = subrow.match(/\w+/), dx = m ? m.index + m[0].length + 1 : row.stringLength - this.x;
      this.i += dx;
      this.x += dx;
      if (this.x > 0 && this.x === row.stringLength && this.y < rows.length - 1) {
        --this.x;
        --this.i;
      }
      rows[this.y].adjust(this, 1);
    } else if (this.y < rows.length - 1) {
      this.right(rows);
    }
  }
  home() {
    this.i -= this.x;
    this.x = 0;
  }
  end(rows) {
    const row = rows[this.y];
    let dx = row.stringLength - this.x;
    if (this.y < rows.length - 1) {
      --dx;
    }
    this.i += dx;
    this.x += dx;
  }
  up(rows, skipAdjust = false) {
    if (this.y > 0) {
      --this.y;
      const row = rows[this.y], dx = Math.min(0, row.stringLength - this.x - 1);
      this.x += dx;
      this.i -= row.stringLength - dx;
      if (!skipAdjust) {
        rows[this.y].adjust(this, 1);
      }
    }
  }
  down(rows, skipAdjust = false) {
    if (this.y < rows.length - 1) {
      const prevRow = rows[this.y];
      ++this.y;
      this.i += prevRow.stringLength;
      const row = rows[this.y];
      if (this.x >= row.stringLength) {
        let dx = this.x - row.stringLength;
        if (this.y < rows.length - 1) {
          ++dx;
        }
        this.i -= dx;
        this.x -= dx;
      }
      if (!skipAdjust) {
        rows[this.y].adjust(this, 1);
      }
    }
  }
  incX(rows, dx) {
    const dir = Math.sign(dx);
    dx = Math.abs(dx);
    if (dir === -1) {
      for (let i = 0; i < dx; ++i) {
        this.left(rows, true);
      }
      rows[this.y].adjust(this, -1);
    } else if (dir === 1) {
      for (let i = 0; i < dx; ++i) {
        this.right(rows, true);
      }
      rows[this.y].adjust(this, 1);
    }
  }
  incY(rows, dy) {
    const dir = Math.sign(dy);
    dy = Math.abs(dy);
    if (dir === -1) {
      for (let i = 0; i < dy; ++i) {
        this.up(rows, true);
      }
    } else if (dir === 1) {
      for (let i = 0; i < dy; ++i) {
        this.down(rows, true);
      }
    }
    rows[this.y].adjust(this, 1);
  }
  setXY(rows, x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    this.y = Math.max(0, Math.min(rows.length - 1, y));
    const row = rows[this.y];
    this.x = Math.max(0, Math.min(row.stringLength, x));
    this.i = this.x;
    for (let i = 0; i < this.y; ++i) {
      this.i += rows[i].stringLength;
    }
    if (this.x > 0 && this.x === row.stringLength && this.y < rows.length - 1) {
      --this.x;
      --this.i;
    }
    rows[this.y].adjust(this, 1);
  }
  setI(rows, i) {
    const delta = this.i - i, dir = Math.sign(delta);
    this.x = this.i = i;
    this.y = 0;
    let total = 0, row = rows[this.y];
    while (this.x > row.stringLength) {
      this.x -= row.stringLength;
      total += row.stringLength;
      if (this.y >= rows.length - 1) {
        this.i = total;
        this.x = row.stringLength;
        break;
      }
      ++this.y;
      row = rows[this.y];
    }
    if (this.y < rows.length - 1 && this.x === row.stringLength) {
      this.x = 0;
      ++this.y;
    }
    rows[this.y].adjust(this, dir);
  }
};

// src/Delayer.ts
var Delayer = class extends TypedEventBase {
  constructor(timeout) {
    super();
    this.timeout = timeout;
    this.timer = null;
    const tickEvt = new TypedEvent("tick");
    this.tick = () => {
      this.cancel();
      this.dispatchEvent(tickEvt);
    };
    Object.freeze(this);
  }
  get isRunning() {
    return this.timer !== null;
  }
  cancel() {
    const wasRunning = this.isRunning;
    if (wasRunning) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    return wasRunning;
  }
  start() {
    this.cancel();
    this.timer = setInterval(this.tick, this.timeout);
  }
};

// src/themes.ts
var Dark = {
  name: "Dark",
  cursorColor: "white",
  unfocused: "rgba(0, 0, 255, 0.25)",
  currentRowBackColor: "#202020",
  selectedBackColor: "#404040",
  lineNumbers: {
    foreColor: "white"
  },
  regular: {
    backColor: "black",
    foreColor: "#c0c0c0"
  },
  strings: {
    foreColor: "#aa9900",
    fontStyle: "italic"
  },
  regexes: {
    foreColor: "#aa0099",
    fontStyle: "italic"
  },
  numbers: {
    foreColor: "green"
  },
  comments: {
    foreColor: "yellow",
    fontStyle: "italic"
  },
  keywords: {
    foreColor: "cyan"
  },
  functions: {
    foreColor: "brown",
    fontWeight: "bold"
  },
  members: {
    foreColor: "green"
  },
  error: {
    foreColor: "red",
    fontStyle: "underline italic"
  }
};
var Light = {
  name: "Light",
  cursorColor: "black",
  unfocused: "rgba(0, 0, 255, 0.25)",
  currentRowBackColor: "#f0f0f0",
  selectedBackColor: "#c0c0c0",
  lineNumbers: {
    foreColor: "black"
  },
  regular: {
    backColor: "white",
    foreColor: "black"
  },
  strings: {
    foreColor: "#aa9900",
    fontStyle: "italic"
  },
  regexes: {
    foreColor: "#aa0099",
    fontStyle: "italic"
  },
  numbers: {
    foreColor: "green"
  },
  comments: {
    foreColor: "grey",
    fontStyle: "italic"
  },
  keywords: {
    foreColor: "blue"
  },
  functions: {
    foreColor: "brown",
    fontWeight: "bold"
  },
  members: {
    foreColor: "green"
  },
  error: {
    foreColor: "red",
    fontStyle: "underline italic"
  }
};
var themes = Object.freeze(/* @__PURE__ */ new Map([
  ["light", Light],
  ["dark", Dark]
]));

// src/Grammars/Rule.ts
var Rule = class {
  constructor(name, test) {
    this.name = name;
    this.test = test;
    this.name = name;
    this.test = test;
    Object.freeze(this);
  }
  carveOutMatchedToken(tokens, j) {
    const token = tokens[j];
    if (token.type === "regular") {
      const res = this.test.exec(token.value);
      if (!!res) {
        const midx = res[res.length - 1], start = res.input.indexOf(midx), end = start + midx.length;
        if (start === 0) {
          token.type = this.name;
          if (end < token.length) {
            const next = token.splitAt(end);
            next.type = "regular";
            tokens.splice(j + 1, 0, next);
          }
        } else {
          const mid = token.splitAt(start);
          if (midx.length < mid.length) {
            const right = mid.splitAt(midx.length);
            tokens.splice(j + 1, 0, right);
          }
          mid.type = this.name;
          tokens.splice(j + 1, 0, mid);
        }
      }
    }
  }
};

// src/Grammars/Token.ts
var Token = class {
  constructor(value, type2, startStringIndex) {
    this.value = value;
    this.type = type2;
    this.startStringIndex = startStringIndex;
    Object.seal(this);
  }
  get length() {
    return this.value.length;
  }
  get endStringIndex() {
    return this.startStringIndex + this.length;
  }
  clone() {
    return new Token(this.value, this.type, this.startStringIndex);
  }
  splitAt(i) {
    var next = this.value.substring(i);
    this.value = this.value.substring(0, i);
    return new Token(next, this.type, this.startStringIndex + i);
  }
  toString() {
    return `[${this.type}: ${this.value}]`;
  }
};

// src/Grammars/Grammar.ts
function crudeParsing(tokens) {
  var commentDelim = null, stringDelim = null;
  for (let i = 0; i < tokens.length; ++i) {
    const t2 = tokens[i];
    if (stringDelim) {
      if (t2.type === "stringDelim" && t2.value === stringDelim && (i === 0 || tokens[i - 1].value[tokens[i - 1].value.length - 1] !== "\\")) {
        stringDelim = null;
      }
      if (t2.type !== "newlines") {
        t2.type = "strings";
      }
    } else if (commentDelim) {
      if (commentDelim === "startBlockComments" && t2.type === "endBlockComments" || commentDelim === "startLineComments" && t2.type === "newlines") {
        commentDelim = null;
      }
      if (t2.type !== "newlines") {
        t2.type = "comments";
      }
    } else if (t2.type === "stringDelim") {
      stringDelim = t2.value;
      t2.type = "strings";
    } else if (t2.type === "startBlockComments" || t2.type === "startLineComments") {
      commentDelim = t2.type;
      t2.type = "comments";
    }
  }
  for (let i = tokens.length - 1; i > 0; --i) {
    const p = tokens[i - 1], t2 = tokens[i];
    if (p.type === t2.type && p.type !== "newlines") {
      p.value += t2.value;
      tokens.splice(i, 1);
    }
  }
  for (let i = tokens.length - 1; i >= 0; --i) {
    if (tokens[i].length === 0) {
      tokens.splice(i, 1);
    }
  }
}
var Grammar = class {
  constructor(name, rules) {
    this.name = name;
    rules = rules || [];
    this.grammar = rules.map((rule) => new Rule(rule[0], rule[1]));
    Object.freeze(this);
  }
  tokenize(text) {
    const tokens = [new Token(text, "regular", 0)];
    for (let rule of this.grammar) {
      for (var j = 0; j < tokens.length; ++j) {
        rule.carveOutMatchedToken(tokens, j);
      }
    }
    crudeParsing(tokens);
    return tokens;
  }
  toHTML(parent, txt, theme, fontSize) {
    if (theme === void 0) {
      theme = Light;
    }
    var tokenRows = this.tokenize(txt), temp = Div();
    for (var y = 0; y < tokenRows.length; ++y) {
      var t2 = tokenRows[y];
      if (t2.type === "newlines") {
        temp.appendChild(BR());
      } else {
        var style = theme[t2.type] || {}, elem = Span(
          fontWeight(style.fontWeight || theme.regular.fontWeight),
          fontStyle(style.fontStyle || theme.regular.fontStyle || ""),
          color(style.foreColor || theme.regular.foreColor),
          backgroundColor(style.backColor || theme.regular.backColor),
          getMonospaceFamily()
        );
        elementApply(elem, t2.value);
        temp.appendChild(elem);
      }
    }
    parent.innerHTML = temp.innerHTML;
    Object.assign(parent.style, {
      backgroundColor: theme.regular.backColor,
      fontSize: `${fontSize}px`,
      lineHeight: `${fontSize}px`
    });
  }
};

// src/Grammars/Basic.ts
var BasicGrammar = class extends Grammar {
  constructor() {
    super(
      "BASIC",
      [
        ["newlines", /(?:\r\n|\r|\n)/],
        ["lineNumbers", /^\d+\s+/],
        ["whitespace", /(?:\s+)/],
        ["startLineComments", /^REM\s/],
        ["stringDelim", /("|')/],
        ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
        [
          "keywords",
          /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
        ],
        ["keywords", /^DEF FN/],
        [
          "operators",
          /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
        ],
        ["members", /\w+\$?/]
      ]
    );
  }
  tokenize(code) {
    return super.tokenize(code.toUpperCase());
  }
};
var Basic = new BasicGrammar();

// src/Grammars/HTML.ts
var HTML = new Grammar("HTML", [
  ["newlines", /(?:\r\n|\r|\n)/],
  ["whitespace", /(?:\s+)/],
  ["startBlockComments", /(?:<|&lt;)!--/],
  ["endBlockComments", /--(?:>|&gt;)/],
  ["stringDelim", /("|')/],
  ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
  [
    "keywords",
    /(?:<|&lt;)\/?(html|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|dd|div|dl|dt|figcaption|figure|hr|li|main|ol|p|pre|ul|a|abbr|b|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|img|map|track|video|embed|object|param|source|canvas|noscript|script|del|ins|caption|col|colgroup|table|tbody|td|tfoot|th|thead|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template|acronym|applet|basefont|big|blink|center|command|content|dir|font|frame|frameset|isindex|keygen|listing|marquee|multicol|nextid|noembed|plaintext|spacer|strike|tt|xmp)\b/
  ],
  ["members", /(\w+)=/]
]);

// src/Grammars/JavaScript.ts
var JavaScript = new Grammar("JavaScript", [
  ["newlines", /(?:\r\n|\r|\n)/],
  ["whitespace", /(?:\s+)/],
  ["startBlockComments", /\/\*/],
  ["endBlockComments", /\*\//],
  ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/],
  ["stringDelim", /("|'|`)/],
  ["startLineComments", /\/\/.*$/m],
  ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
  [
    "keywords",
    /\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
  ],
  ["functions", /(\w+)(?:\s*\()/],
  ["members", /(\w+)\./],
  ["members", /((\w+\.)+)(\w+)/]
]);

// src/Grammars/PlainText.ts
var PlainText = new Grammar("PlainText", [
  ["newlines", /(?:\r\n|\r|\n)/],
  ["whitespace", /(?:\s+)/]
]);

// src/Grammars/index.ts
var grammars = Object.freeze(/* @__PURE__ */ new Map([
  ["basic", Basic],
  ["bas", Basic],
  ["html", HTML],
  ["javascript", JavaScript],
  ["js", JavaScript],
  ["plaintext", PlainText],
  ["txt", PlainText]
]));

// src/keys.ts
var keyGroups = Object.freeze(/* @__PURE__ */ new Map([
  ["special", [
    "Unidentified"
  ]],
  ["modifier", [
    "Alt",
    "AltGraph",
    "CapsLock",
    "Control",
    "Fn",
    "FnLock",
    "Hyper",
    "Meta",
    "NumLock",
    "ScrollLock",
    "Shift",
    "Super",
    "Symbol",
    "SymbolLock"
  ]],
  ["whitespace", [
    "Enter",
    "Tab"
  ]],
  ["navigation", [
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "End",
    "Home",
    "PageDown",
    "PageUp"
  ]],
  ["editing", [
    "Backspace",
    "Clear",
    "Copy",
    "CrSel",
    "Cut",
    "Delete",
    "EraseEof",
    "ExSel",
    "Insert",
    "Paste",
    "Redo",
    "Undo"
  ]],
  ["ui", [
    "Accept",
    "Again",
    "Attn",
    "Cancel",
    "ContextMenu",
    "Escape",
    "Execute",
    "Find",
    "Finish",
    "Help",
    "Pause",
    "Play",
    "Props",
    "Select",
    "ZoomIn",
    "ZoomOut"
  ]],
  ["device", [
    "BrightnessDown",
    "BrightnessUp",
    "Eject",
    "LogOff",
    "Power",
    "PowerOff",
    "PrintScreen",
    "Hibernate",
    "Standby",
    "WakeUp"
  ]],
  ["ime", [
    "AllCandidates",
    "Alphanumeric",
    "CodeInput",
    "Compose",
    "Convert",
    "Dead",
    "FinalMode",
    "GroupFirst",
    "GroupNext",
    "GroupPrevious",
    "ModeChange",
    "NextCandidate",
    "NonConvert",
    "PreviousCandidate",
    "Process",
    "SingleCandidate"
  ]],
  ["korean", [
    "HangulMode",
    "HanjaMode",
    "JunjaMode"
  ]],
  ["japanese", [
    "Eisu",
    "Hankaku",
    "Hiragana",
    "HiraganaKatakana",
    "KanaMode",
    "KanjiMode",
    "Katakana",
    "Romaji",
    "Zenkaku",
    "ZenkakuHanaku"
  ]],
  ["function", [
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "F13",
    "F14",
    "F15",
    "F16",
    "F17",
    "F18",
    "F19",
    "F20",
    "Soft1",
    "Soft2",
    "Soft3",
    "Soft4"
  ]],
  ["phone", [
    "AppSwitch",
    "Call",
    "Camera",
    "CameraFocus",
    "EndCall",
    "GoBack",
    "GoHome",
    "HeadsetHook",
    "LastNumberRedial",
    "Notification",
    "MannerMode",
    "VoiceDial"
  ]],
  ["multimedia", [
    "ChannelDown",
    "ChannelUp",
    "MediaFastForward",
    "MediaPause",
    "MediaPlay",
    "MediaPlayPause",
    "MediaRecord",
    "MediaRewind",
    "MediaStop",
    "MediaTrackNext",
    "MediaTrackPrevious"
  ]],
  ["audio", [
    "AudioBalanceLeft",
    "AudioBalanceRight",
    "AudioBassDown",
    "AudioBassBoostDown",
    "AudioBassBoostToggle",
    "AudioBassBoostUp",
    "AudioBassUp",
    "AudioFaderFront",
    "AudioFaderRear",
    "AudioSurroundModeNext",
    "AudioTrebleDown",
    "AudioTrebleUp",
    "AudioVolumeDown",
    "AudioVolumeMute",
    "AudioVolumeUp",
    "MicrophoneToggle",
    "MicrophoneVolumeDown",
    "MicrophoneVolumeMute",
    "MicrophoneVolumeUp"
  ]],
  ["tv", [
    "TV",
    "TV3DMode",
    "TVAntennaCable",
    "TVAudioDescription",
    "TVAudioDescriptionMixDown",
    "TVAudioDescriptionMixUp",
    "TVContentsMenu",
    "TVDataService",
    "TVInput",
    "TVInputComponent1",
    "TVInputComponent2",
    "TVInputComposite1",
    "TVInputComposite2",
    "TVInputHDMI1",
    "TVInputHDMI2",
    "TVInputHDMI3",
    "TVInputHDMI4",
    "TVInputVGA1",
    "TVMediaContext",
    "TVNetwork",
    "TVNumberEntry",
    "TVPower",
    "TVRadioService",
    "TVSatellite",
    "TVSatelliteBS",
    "TVSatelliteCS",
    "TVSatelliteToggle",
    "TVTerrestrialAnalog",
    "TVTerrestrialDigital",
    "TVTimer"
  ]],
  ["mediaController", [
    "AVRInput",
    "AVRPower",
    "ColorF0Red",
    "ColorF1Green",
    "ColorF2Yellow",
    "ColorF3Blue",
    "ColorF4Grey",
    "ColorF5Brown",
    "ClosedCaptionToggle",
    "Dimmer",
    "DisplaySwap",
    "DVR",
    "Exit",
    "FavoriteClear0",
    "FavoriteClear1",
    "FavoriteClear2",
    "FavoriteClear3",
    "FavoriteRecall0",
    "FavoriteRecall1",
    "FavoriteRecall2",
    "FavoriteRecall3",
    "FavoriteStore0",
    "FavoriteStore1",
    "FavoriteStore2",
    "FavoriteStore3",
    "Guide",
    "GuideNextDay",
    "GuidePreviousDay",
    "Info",
    "InstantReplay",
    "Link",
    "ListProgram",
    "LiveContent",
    "Lock",
    "MediaApps",
    "MediaAudioTrack",
    "MediaLast",
    "MediaSkipBackward",
    "MediaSkipForward",
    "MediaStepBackward",
    "MediaStepForward",
    "MediaTopMenu",
    "NavigateIn",
    "NavigateNext",
    "NavigateOut",
    "NavigatePrevious",
    "NextFavoriteChannel",
    "NextUserProfile",
    "OnDemand",
    "Pairing",
    "PinPDown",
    "PinPMove",
    "PinPToggle",
    "PinPUp",
    "PlaySpeedDown",
    "PlaySpeedReset",
    "PlaySpeedUp",
    "RandomToggle",
    "RcLowBattery",
    "RecordSpeedNext",
    "RfBypass",
    "ScanChannelsToggle",
    "ScreenModeNext",
    "Settings",
    "SplitScreenToggle",
    "STBInput",
    "STBPower",
    "Subtitle",
    "Teletext",
    "VideoModeNext",
    "Wink",
    "ZoomToggle"
  ]],
  ["speechRecognition", [
    "SpeechCorrectionList",
    "SpeechInputToggle"
  ]],
  ["document", [
    "Close",
    "New",
    "Open",
    "Print",
    "Save",
    "SpellCheck",
    "MailForward",
    "MailReply",
    "MailSend"
  ]],
  ["applicationSelector", [
    "LaunchCalculator",
    "LaunchCalendar",
    "LaunchContacts",
    "LaunchMail",
    "LaunchMediaPlayer",
    "LaunchMusicPlayer",
    "LaunchMyComputer",
    "LaunchPhone",
    "LaunchScreenSaver",
    "LaunchSpreadsheet",
    "LaunchWebBrowser",
    "LaunchWebCam",
    "LaunchWordProcessor",
    "LaunchApplication1",
    "LaunchApplication2",
    "LaunchApplication3",
    "LaunchApplication4",
    "LaunchApplication5",
    "LaunchApplication6",
    "LaunchApplication7",
    "LaunchApplication8",
    "LaunchApplication9"
  ]],
  ["browserControl", [
    "BrowserBack",
    "BrowserFavorites",
    "BrowserForward",
    "BrowserHome",
    "BrowserRefresh",
    "BrowserSearch",
    "BrowserStop"
  ]],
  ["numericKeypad", [
    "Clear"
  ]]
]));
var keyTypes = /* @__PURE__ */ new Map();
for (let pair of keyGroups) {
  for (let value of pair[1]) {
    keyTypes.set(value, pair[0]);
  }
}
Object.freeze(keyTypes);
var isFnDown = false;
if (isApple()) {
  window.addEventListener("keydown", (evt) => {
    if (evt.key === "Fn") {
      isFnDown = true;
    }
  });
  window.addEventListener("keyup", (evt) => {
    if (evt.key === "Fn") {
      isFnDown = false;
    }
  });
}
function normalizeKeyValue(evt) {
  if (evt.key === "OS" && (evt.code === "OSLeft" || evt.code === "OSRight")) {
    return "Meta";
  } else if (evt.key === "Scroll") {
    return "ScrollLock";
  } else if (evt.key === "Win") {
    return "Meta";
  } else if (evt.key === "Spacebar") {
    return " ";
  } else if (evt.key === "\n") {
    return "Enter";
  } else if (evt.key === "Down") {
    return "ArrowDown";
  } else if (evt.key === "Left") {
    return "ArrowLeft";
  } else if (evt.key === "Right") {
    return "ArrowRight";
  } else if (evt.key === "Up") {
    return "ArrowUp";
  } else if (evt.key === "Del") {
    return "Delete";
  } else if (evt.key === "Delete" && isApple() && isFnDown) {
    return "Backspace";
  } else if (evt.key === "Crsel") {
    return "CrSel";
  } else if (evt.key === "Exsel") {
    return "ExSel";
  } else if (evt.key === "Esc") {
    return "Escape";
  } else if (evt.key === "Apps") {
    return "ContextMenu";
  } else if (evt.key === "Multi") {
    return "Compose";
  } else if (evt.key === "Nonconvert") {
    return "NonConvert";
  } else if (evt.key === "RomanCharacters") {
    return "Eisu";
  } else if (evt.key === "HalfWidth") {
    return "Hankaku";
  } else if (evt.key === "FullWidth") {
    return "Zenkaku";
  } else if (evt.key === "Exit" || evt.key === "MozHomeScreen") {
    return "GoHome";
  } else if (evt.key === "MediaNextTrack") {
    return "MediaTrackNext";
  } else if (evt.key === "MediaPreviousTrack") {
    return "MediaTrackPrevious";
  } else if (evt.key === "FastFwd") {
    return "MedaiFastFwd";
  } else if (evt.key === "VolumeDown") {
    return "AudioVolumeDown";
  } else if (evt.key === "VolumeMute") {
    return "AudioVolumeMute";
  } else if (evt.key === "VolumeUp") {
    return "AudioVolumeUp";
  } else if (evt.key === "Live") {
    return "TV";
  } else if (evt.key === "Zoom") {
    return "ZoomToggle";
  } else if (evt.key === "SelectMedia" || evt.key === "MediaSelect") {
    return "LaunchMediaPlayer";
  } else if (evt.key === "Add") {
    return "+";
  } else if (evt.key === "Divide") {
    return "/";
  } else if (evt.key === "Decimal") {
    return ".";
  } else if (evt.key === "Key11") {
    return "11";
  } else if (evt.key === "Key12") {
    return "12";
  } else if (evt.key === "Multiply") {
    return "*";
  } else if (evt.key === "Subtract") {
    return "-";
  } else if (evt.key === "Separator") {
    return ",";
  }
  return evt.key;
}

// src/os.ts
var gesture = Object.seal({
  type: "",
  text: "",
  command: ""
});
var OperatingSystem = class {
  constructor(name, pre1, pre2, redo, pre3, home, end, pre5, fullHome, fullEnd) {
    this.name = name;
    const pre4 = pre3;
    if (pre3.length === 0) {
      pre3 = "Normal";
    }
    const substitutions = Object.freeze(/* @__PURE__ */ new Map([
      ["Normal_ArrowDown", "CursorDown"],
      ["Normal_ArrowLeft", "CursorLeft"],
      ["Normal_ArrowRight", "CursorRight"],
      ["Normal_ArrowUp", "CursorUp"],
      ["Normal_PageDown", "CursorPageDown"],
      ["Normal_PageUp", "CursorPageUp"],
      [`${pre2}_ArrowLeft`, "CursorSkipLeft"],
      [`${pre2}_ArrowRight`, "CursorSkipRight"],
      [`${pre3}_${home}`, "CursorHome"],
      [`${pre3}_${end}`, "CursorEnd"],
      [`${pre5}_${fullHome}`, "CursorFullHome"],
      [`${pre5}_${fullEnd}`, "CursorFullEnd"],
      ["Shift_ArrowDown", "SelectDown"],
      ["Shift_ArrowLeft", "SelectLeft"],
      ["Shift_ArrowRight", "SelectRight"],
      ["Shift_ArrowUp", "SelectUp"],
      ["Shift_PageDown", "SelectPageDown"],
      ["Shift_PageUp", "SelectPageUp"],
      [`${pre2}Shift_ArrowLeft`, "SelectSkipLeft"],
      [`${pre2}Shift_ArrowRight`, "SelectSkipRight"],
      [`${pre4}Shift_${home}`, "SelectHome"],
      [`${pre4}Shift_${end}`, "SelectEnd"],
      [`${pre5}Shift_${fullHome}`, "SelectFullHome"],
      [`${pre5}Shift_${fullEnd}`, "SelectFullEnd"],
      [`${pre1}_a`, "SelectAll"],
      [`${pre1}_ArrowDown`, "ScrollDown"],
      [`${pre1}_ArrowUp`, "ScrollUp"],
      ["Normal_Backspace", "DeleteLetterLeft"],
      ["Normal_Delete", "DeleteLetterRight"],
      [`${pre2}_Backspace`, "DeleteWordLeft"],
      [`${pre2}_Delete`, "DeleteWordRight"],
      [`Shift_Delete`, "DeleteLine"],
      ["Normal_Enter", "AppendNewline"],
      [`${pre2}_Enter`, "PrependNewline"],
      ["Normal_Tab", "InsertTab"],
      ["Shift_Tab", "RemoveTab"],
      [`${pre1}_z`, "Undo"],
      [redo, "Redo"]
    ]));
    this.makeCommand = (evt) => {
      gesture.text = normalizeKeyValue(evt);
      gesture.type = keyTypes.has(gesture.text) ? keyTypes.get(gesture.text) : "printable";
      gesture.command = "";
      if (evt.ctrlKey || evt.altKey || evt.metaKey) {
        if (gesture.type === "printable" || gesture.type === "whitespace") {
          gesture.type = "special";
        }
        if (evt.ctrlKey) {
          gesture.command += "Control";
        }
        if (evt.altKey) {
          gesture.command += "Alt";
        }
        if (evt.metaKey) {
          gesture.command += "Meta";
        }
      }
      if (evt.shiftKey) {
        gesture.command += "Shift";
      }
      if (gesture.command === "") {
        gesture.command += "Normal";
      }
      gesture.command += "_" + gesture.text;
      if (substitutions.has(gesture.command)) {
        gesture.command = substitutions.get(gesture.command);
      }
      if (gesture.command === "PrependNewline") {
        gesture.type = "whitespace";
      }
      return gesture;
    };
    Object.freeze(this);
  }
};
var Windows = new OperatingSystem(
  "Windows",
  "Control",
  "Control",
  "Control_y",
  "",
  "Home",
  "End",
  "Control",
  "Home",
  "End"
);
var MacOS = new OperatingSystem(
  "macOS",
  "Meta",
  "Alt",
  "MetaShift_z",
  "Meta",
  "ArrowLeft",
  "ArrowRight",
  "Meta",
  "ArrowUp",
  "ArrowDown"
);

// src/Point.ts
var Point = class {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    Object.seal(this);
  }
  set(x, y) {
    this.x = x;
    this.y = y;
  }
  copy(p) {
    if (p) {
      this.x = p.x;
      this.y = p.y;
    }
  }
  toCell(character, scroll, gridBounds) {
    this.x = Math.round(this.x / character.width) + scroll.x - gridBounds.x;
    this.y = Math.floor(this.y / character.height - 0.25) + scroll.y;
  }
  inBounds(bounds) {
    return bounds.left <= this.x && this.x < bounds.right && bounds.top <= this.y && this.y < bounds.bottom;
  }
  clone() {
    return new Point(this.x, this.y);
  }
  toString() {
    return `(x:${this.x}, y:${this.y})`;
  }
};

// src/Size.ts
var Size = class {
  constructor(width2 = 0, height2 = 0) {
    this.width = width2;
    this.height = height2;
    Object.seal(this);
  }
  set(width2, height2) {
    this.width = width2;
    this.height = height2;
  }
  copy(s) {
    if (!!s) {
      this.width = s.width;
      this.height = s.height;
    }
  }
  clone() {
    return new Size(this.width, this.height);
  }
  toString() {
    return `<w:${this.width}, h:${this.height}>`;
  }
};

// src/Rectangle.ts
var Rectangle = class {
  constructor(x, y, width2, height2) {
    this.point = new Point(x, y);
    this.size = new Size(width2, height2);
    Object.freeze(this);
  }
  get x() {
    return this.point.x;
  }
  set x(x) {
    this.point.x = x;
  }
  get left() {
    return this.point.x;
  }
  set left(x) {
    this.point.x = x;
  }
  get width() {
    return this.size.width;
  }
  set width(width2) {
    this.size.width = width2;
  }
  get right() {
    return this.point.x + this.size.width;
  }
  set right(right) {
    this.point.x = right - this.size.width;
  }
  get y() {
    return this.point.y;
  }
  set y(y) {
    this.point.y = y;
  }
  get top() {
    return this.point.y;
  }
  set top(y) {
    this.point.y = y;
  }
  get height() {
    return this.size.height;
  }
  set height(height2) {
    this.size.height = height2;
  }
  get bottom() {
    return this.point.y + this.size.height;
  }
  set bottom(bottom) {
    this.point.y = bottom - this.size.height;
  }
  get area() {
    return this.width * this.height;
  }
  set(x, y, width2, height2) {
    this.point.set(x, y);
    this.size.set(width2, height2);
  }
  copy(r) {
    if (r) {
      this.point.copy(r.point);
      this.size.copy(r.size);
    }
  }
  clone() {
    return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
  }
  overlap(r) {
    const left = Math.max(this.left, r.left), top = Math.max(this.top, r.top), right = Math.min(this.right, r.right), bottom = Math.min(this.bottom, r.bottom);
    if (right > left && bottom > top) {
      return new Rectangle(left, top, right - left, bottom - top);
    }
    return null;
  }
  toString() {
    return `[${this.point.toString()} x ${this.size.toString()}]`;
  }
};

// src/Row.ts
var Row = class {
  constructor(text, tokens, startStringIndex, startTokenIndex, lineNumber) {
    this.text = text;
    this.tokens = tokens;
    this.startStringIndex = startStringIndex;
    this.startTokenIndex = startTokenIndex;
    this.lineNumber = lineNumber;
    const graphemes = Object.freeze([...text]);
    this.leftCorrections = new Array(text.length);
    this.rightCorrections = new Array(text.length);
    let x = 0;
    for (let grapheme of graphemes) {
      this.leftCorrections[x] = 0;
      this.rightCorrections[x] = 0;
      for (let i = 1; i < grapheme.length; ++i) {
        this.leftCorrections[x + i] = -i;
        this.rightCorrections[x + i] = grapheme.length - i;
      }
      x += grapheme.length;
    }
    Object.seal(this);
  }
  static emptyRow(startStringIndex, startTokenIndex, lineNumber) {
    return new Row("", [], startStringIndex, startTokenIndex, lineNumber);
  }
  toString() {
    return this.text;
  }
  substring(x, y) {
    return this.text.substring(x, y);
  }
  adjust(cursor, dir) {
    const correction = dir === -1 ? this.leftCorrections : this.rightCorrections;
    if (cursor.x < correction.length) {
      const delta = correction[cursor.x];
      cursor.x += delta;
      cursor.i += delta;
    } else if (dir === 1 && this.text[this.text.length - 1] === "\n") {
      this.adjust(cursor, -1);
    }
  }
  get stringLength() {
    return this.text.length;
  }
  get endStringIndex() {
    return this.startStringIndex + this.stringLength;
  }
  get numTokens() {
    return this.tokens.length;
  }
  get endTokenIndex() {
    return this.startTokenIndex + this.numTokens;
  }
};

// src/primrose.ts
function minDelta(v, minV, maxV) {
  const dvMinV = v - minV;
  const dvMaxV = v - maxV + 5;
  let dv = 0;
  if (dvMinV < 0 || dvMaxV >= 0) {
    dv = Math.abs(dvMinV) < Math.abs(dvMaxV) ? dvMinV : dvMaxV;
  }
  return dv;
}
var focusedControl = null;
var hoveredControl = null;
var publicControls = [];
var controls2 = [];
var wheelScrollSpeed = 4;
var vScrollWidth = 2;
var scrollScale = isFirefox() ? 3 : 100;
var optionDefaults = Object.freeze({
  readOnly: false,
  multiLine: true,
  wordWrap: true,
  scrollBars: true,
  lineNumbers: true,
  padding: 0,
  fontSize: 16,
  language: "JavaScript",
  scaleFactor: devicePixelRatio
});
var elements = /* @__PURE__ */ new WeakMap();
var ready = (document.readyState === "complete" ? Promise.resolve("already") : new Promise((resolve) => {
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
      resolve("had to wait for it");
    }
  }, false);
})).then(() => {
  for (let element of document.getElementsByTagName("primrose")) {
    new Primrose({
      element
    });
  }
});
var Primrose = class extends TypedEventBase {
  constructor(options) {
    super();
    this._value = "";
    this._padding = 0;
    this._fontSize = null;
    this._scaleFactor = 2;
    this._readOnly = false;
    this._wordWrap = false;
    this._multiLine = false;
    this._language = JavaScript;
    this._showScrollBars = false;
    this._showLineNumbers = false;
    this._hovered = false;
    this._focused = false;
    this._element = null;
    this._theme = Dark;
    this._tabWidth = 2;
    this.currentTouchID = null;
    this.vibX = 0;
    this.vibY = 0;
    this.tx = 0;
    this.ty = 0;
    this.canv = null;
    this.resized = false;
    this.pressed = false;
    this.tabString = "  ";
    this.dragging = false;
    this.historyIndex = -1;
    this.scrolling = false;
    this.tabPressed = false;
    this.lineCount = 1;
    this.lineCountWidth = 0;
    this.controlType = singleLineOutput;
    this.maxVerticalScroll = 0;
    this.currentValue = "";
    this.currentTabIndex = -1;
    this.lastCharacterHeight = null;
    this.lastCharacterWidth = null;
    this.lastFrontCursor = null;
    this.lastGridBounds = null;
    this.lastBackCursor = null;
    this.lastThemeName = null;
    this.lastPadding = null;
    this.lastFocused = null;
    this.lastScrollX = null;
    this.lastScrollY = null;
    this.lastScrollDX = null;
    this.lastScrollDY = null;
    this.lastFont = null;
    this.lastText = null;
    this.history = [];
    this.tokens = new Array();
    this.rows = [Row.emptyRow(0, 0, 0)];
    this.scroll = new Point();
    this.pointer = new Point();
    this.character = new Size();
    this.bottomRightGutter = new Size();
    this.gridBounds = new Rectangle();
    this.tokenBack = new Cursor();
    this.tokenFront = new Cursor();
    this.backCursor = new Cursor();
    this.frontCursor = new Cursor();
    this.outEvt = new TypedEvent("out");
    this.overEvt = new TypedEvent("over");
    this.blurEvt = new TypedEvent("blur");
    this.focusEvt = new TypedEvent("focus");
    this.changeEvt = new TypedEvent("change");
    this.updateEvt = new TypedEvent("update");
    this.os = isApple() ? MacOS : Windows;
    this.longPress = new Delayer(1e3);
    this._renderTimer = null;
    this.pointerMove = () => {
      if (this.dragging) {
        this.moveCursor(this.backCursor);
      } else if (this.pressed) {
        this.dragScroll();
      }
    };
    options = options || {};
    if (options.element === void 0) {
      options.element = null;
    }
    if (options.element !== null && !(options.element instanceof HTMLElement)) {
      throw new Error("element must be null, an instance of HTMLElement, an instance of HTMLCanvaseElement, or an instance of OffscreenCanvas");
    }
    options = Object.assign({}, optionDefaults, options);
    this.keyDownCommands = Object.freeze(/* @__PURE__ */ new Map([
      ["CursorUp", () => {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        minCursor.up(this.rows);
        maxCursor.copy(minCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorDown", () => {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        maxCursor.down(this.rows);
        minCursor.copy(maxCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorLeft", () => {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        if (minCursor.i === maxCursor.i) {
          minCursor.left(this.rows);
        }
        maxCursor.copy(minCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorRight", () => {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        if (minCursor.i === maxCursor.i) {
          maxCursor.right(this.rows);
        }
        minCursor.copy(maxCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorPageUp", () => {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        minCursor.incY(this.rows, -this.gridBounds.height);
        maxCursor.copy(minCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorPageDown", () => {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        maxCursor.incY(this.rows, this.gridBounds.height);
        minCursor.copy(maxCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorSkipLeft", () => {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        if (minCursor.i === maxCursor.i) {
          minCursor.skipLeft(this.rows);
        }
        maxCursor.copy(minCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorSkipRight", () => {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        if (minCursor.i === maxCursor.i) {
          maxCursor.skipRight(this.rows);
        }
        minCursor.copy(maxCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorHome", () => {
        this.frontCursor.home();
        this.backCursor.copy(this.frontCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorEnd", () => {
        this.frontCursor.end(this.rows);
        this.backCursor.copy(this.frontCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorFullHome", () => {
        this.frontCursor.fullHome();
        this.backCursor.copy(this.frontCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["CursorFullEnd", () => {
        this.frontCursor.fullEnd(this.rows);
        this.backCursor.copy(this.frontCursor);
        this.scrollIntoView(this.frontCursor);
      }],
      ["SelectDown", () => {
        this.backCursor.down(this.rows);
        this.scrollIntoView(this.frontCursor);
      }],
      ["SelectLeft", () => {
        this.backCursor.left(this.rows);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectRight", () => {
        this.backCursor.right(this.rows);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectUp", () => {
        this.backCursor.up(this.rows);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectPageDown", () => {
        this.backCursor.incY(this.rows, this.gridBounds.height);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectPageUp", () => {
        this.backCursor.incY(this.rows, -this.gridBounds.height);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectSkipLeft", () => {
        this.backCursor.skipLeft(this.rows);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectSkipRight", () => {
        this.backCursor.skipRight(this.rows);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectHome", () => {
        this.backCursor.home();
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectEnd", () => {
        this.backCursor.end(this.rows);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectFullHome", () => {
        this.backCursor.fullHome();
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectFullEnd", () => {
        this.backCursor.fullEnd(this.rows);
        this.scrollIntoView(this.backCursor);
      }],
      ["SelectAll", () => {
        this.frontCursor.fullHome();
        this.backCursor.fullEnd(this.rows);
        this.render();
      }],
      ["ScrollDown", () => {
        if (this.scroll.y < this.rows.length - this.gridBounds.height) {
          this.scrollBy(0, 1);
        }
      }],
      ["ScrollUp", () => {
        if (this.scroll.y > 0) {
          this.scrollBy(0, -1);
        }
      }],
      ["DeleteLetterLeft", () => {
        if (this.frontCursor.i === this.backCursor.i) {
          this.backCursor.left(this.rows);
        }
        this.setSelectedText("");
      }],
      ["DeleteLetterRight", () => {
        if (this.frontCursor.i === this.backCursor.i) {
          this.backCursor.right(this.rows);
        }
        this.setSelectedText("");
      }],
      ["DeleteWordLeft", () => {
        if (this.frontCursor.i === this.backCursor.i) {
          this.frontCursor.skipLeft(this.rows);
        }
        this.setSelectedText("");
      }],
      ["DeleteWordRight", () => {
        if (this.frontCursor.i === this.backCursor.i) {
          this.backCursor.skipRight(this.rows);
        }
        this.setSelectedText("");
      }],
      ["DeleteLine", () => {
        if (this.frontCursor.i === this.backCursor.i) {
          this.frontCursor.home();
          this.backCursor.end(this.rows);
          this.backCursor.right(this.rows);
        }
        this.setSelectedText("");
      }],
      ["Undo", () => {
        this.moveInHistory(-1);
      }],
      ["Redo", () => {
        this.moveInHistory(1);
      }],
      ["InsertTab", () => {
        this.tabPressed = true;
        this.setSelectedText(this.tabString);
      }],
      ["RemoveTab", () => {
        const row = this.rows[this.frontCursor.y];
        const toDelete = Math.min(this.frontCursor.x, this.tabWidth);
        for (let i = 0; i < this.frontCursor.x; ++i) {
          if (row.text[i] !== " ") {
            return;
          }
        }
        this.backCursor.copy(this.frontCursor);
        this.backCursor.incX(this.rows, -toDelete);
        this.setSelectedText("");
      }]
    ]));
    this.keyPressCommands = Object.freeze(/* @__PURE__ */ new Map([
      ["AppendNewline", () => {
        if (this.multiLine) {
          let indent = "";
          const row = this.rows[this.frontCursor.y].tokens;
          if (row.length > 0 && row[0].type === "whitespace") {
            indent = row[0].value;
          }
          this.setSelectedText("\n" + indent);
        } else {
          this.dispatchEvent(this.changeEvt);
        }
      }],
      ["PrependNewline", () => {
        if (this.multiLine) {
          let indent = "";
          const row = this.rows[this.frontCursor.y].tokens;
          if (row.length > 0 && row[0].type === "whitespace") {
            indent = row[0].value;
          }
          this.frontCursor.home();
          this.backCursor.copy(this.frontCursor);
          this.setSelectedText(indent + "\n");
        } else {
          this.dispatchEvent(this.changeEvt);
        }
      }],
      ["Undo", () => {
        this.moveInHistory(-1);
      }]
    ]));
    this._mouse = Object.freeze({
      readOverEventUV: this.pointerOver,
      readOutEventUV: this.pointerOut,
      readDownEventUV: this.mouseLikePointerDown(this.setUVPointer),
      readUpEventUV: this.mouseLikePointerUp,
      readMoveEventUV: this.mouseLikePointerMove(this.setUVPointer)
    });
    this._touch = Object.freeze({
      readOverEventUV: this.pointerOver,
      readOutEventUV: this.pointerOut,
      readDownEventUV: this.touchLikePointerDown(this.setUVPointer),
      readMoveEventUV: this.touchLikePointerMove(this.setUVPointer),
      readUpEventUV: this.touchLikePointerUp
    });
    if (isHTMLCanvas(options.element)) {
      const elem = options.element;
      const width2 = elem.width;
      const height2 = elem.height;
      this.currentTabIndex = elem.tabIndex;
      const optionsStr = elem.dataset.options || "";
      const entries = optionsStr.trim().split(",");
      const optionUser = {};
      for (let entry of entries) {
        entry = entry.trim();
        if (entry.length > 0) {
          const pairs = entry.split("=");
          if (pairs.length > 1) {
            const key = pairs[0].trim();
            const value = pairs[1].trim();
            const boolTest = value.toLocaleLowerCase();
            if (boolTest === "true" || boolTest === "false") {
              optionUser[key] = boolTest === "true";
            } else {
              optionUser[key] = value;
            }
          }
        }
      }
      this.currentValue = elem.textContent;
      options = Object.assign(
        options,
        { width: width2, height: height2 },
        optionUser
      );
    }
    if (options.element === null) {
      this.canv = createOffscreenCanvas(options.width, options.height);
    } else if (isCanvas(options.element)) {
      this._element = this.canv = options.element;
    } else {
      this._element = options.element;
      elementClearChildren(this.element);
      this.canv = Canvas(
        width(perc(100)),
        height(perc(100))
      );
      this.element.appendChild(this.canv);
      this.element.removeAttribute("tabindex");
      elementApply(
        this.element,
        display("block"),
        padding(0),
        border("2px inset #c0c0c0"),
        overflow("unset")
      );
    }
    if (this.canv instanceof HTMLCanvasElement && this.isInDocument) {
      if (this.currentTabIndex === -1) {
        const tabbableElements = document.querySelectorAll("[tabindex]");
        for (let tabbableElement of tabbableElements) {
          this.currentTabIndex = Math.max(this.currentTabIndex, tabbableElement.tabIndex);
        }
        ++this.currentTabIndex;
      }
      this.canv.tabIndex = this.currentTabIndex;
      this.canv.style.touchAction = "none";
      this.canv.addEventListener("focus", () => this.focus());
      this.canv.addEventListener("blur", () => this.blur());
      this.canv.addEventListener("mouseover", this.readMouseOverEvent);
      this.canv.addEventListener("mouseout", this.readMouseOutEvent);
      this.canv.addEventListener("mousedown", this.readMouseDownEvent);
      this.canv.addEventListener("mouseup", this.readMouseUpEvent);
      this.canv.addEventListener("mousemove", this.readMouseMoveEvent);
      this.canv.addEventListener("touchstart", this.readTouchStartEvent);
      this.canv.addEventListener("touchend", this.readTouchEndEvent);
      this.canv.addEventListener("touchmove", this.readTouchMoveEvent);
      new ResizeObserver(() => this.resize()).observe(this.canv);
    }
    this.context.imageSmoothingEnabled = this.fgfx.imageSmoothingEnabled = this.bgfx.imageSmoothingEnabled = this.tgfx.imageSmoothingEnabled = true;
    this.context.textBaseline = this.fgfx.textBaseline = this.bgfx.textBaseline = this.tgfx.textBaseline = "top";
    this.tgfx.textAlign = "right";
    this.fgfx.textAlign = "left";
    this.longPress.addEventListener("tick", () => {
      this.startSelecting();
      this.backCursor.copy(this.frontCursor);
      this.frontCursor.skipLeft(this.rows);
      this.backCursor.skipRight(this.rows);
      this.render();
      navigator.vibrate(20);
    });
    this.addEventListener("blur", () => {
      if (this.tabPressed) {
        this.tabPressed = false;
        this.focus();
      }
    });
    let language = null;
    if (isString(options.language)) {
      options.language = options.language.toLocaleLowerCase();
      if (grammars.has(options.language)) {
        language = grammars.get(options.language);
      }
    }
    Object.freeze(options);
    Object.seal(this);
    this.readOnly = options.readOnly;
    this.multiLine = options.multiLine;
    this.wordWrap = options.wordWrap;
    this.showScrollBars = options.scrollBars;
    this.showLineNumbers = options.lineNumbers;
    this.padding = options.padding;
    this.fontSize = options.fontSize;
    this.language = language;
    this.scaleFactor = options.scaleFactor;
    this.value = this.currentValue;
    Primrose.add(this.element, this);
  }
  static add(key, control) {
    if (key !== null) {
      elements.set(key, control);
    }
    if (controls2.indexOf(control) === -1) {
      controls2.push(control);
      arrayReplace(publicControls, ...controls2.slice());
      control.addEventListener("blur", () => {
        focusedControl = null;
      });
      control.addEventListener("focus", () => {
        if (focusedControl !== null && (!focusedControl.isInDocument || !control.isInDocument)) {
          focusedControl.blur();
        }
        focusedControl = control;
      });
      control.addEventListener("over", () => {
        hoveredControl = control;
      });
      control.addEventListener("out", () => {
        hoveredControl = null;
      });
    }
  }
  static has(key) {
    return elements.has(key);
  }
  static get(key) {
    return elements.has(key) ? elements.get(key) : null;
  }
  static get hoveredControl() {
    return hoveredControl;
  }
  static get focusedControl() {
    return focusedControl;
  }
  static get editors() {
    return publicControls;
  }
  static get ready() {
    return ready;
  }
  render() {
    if (isDefined(this._renderTimer)) {
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }
    setTimeout(() => {
      this._renderTimer = null;
      this.doRender();
    }, 0);
  }
  get element() {
    return this._element;
  }
  get isInDocument() {
    return isHTMLCanvas(this.canv) && document.body.contains(this.canv);
  }
  get canvas() {
    return this.canv;
  }
  get hovered() {
    return this._hovered;
  }
  get focused() {
    return this._focused;
  }
  set focused(f) {
    if (f !== this.focused) {
      if (f) {
        this.focus();
      } else {
        this.blur();
      }
    }
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(r) {
    r = !!r;
    if (r !== this.readOnly) {
      this._readOnly = r;
      this.refreshControlType();
    }
  }
  get multiLine() {
    return this._multiLine;
  }
  set multiLine(m) {
    m = !!m;
    if (m !== this.multiLine) {
      if (!m && this.wordWrap) {
        this.wordWrap = false;
      }
      this._multiLine = m;
      this.refreshControlType();
      this.refreshGutter();
    }
  }
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(w) {
    w = !!w;
    if (w !== this.wordWrap && (this.multiLine || !w)) {
      this._wordWrap = w;
      this.refreshGutter();
      this.render();
    }
  }
  get value() {
    return this._value;
  }
  set value(txt) {
    this.setValue(txt, true);
  }
  get text() {
    return this.value;
  }
  set text(txt) {
    this.setValue(txt, true);
  }
  get selectedText() {
    const minCursor = Cursor.min(this.frontCursor, this.backCursor);
    const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
    return this.value.substring(minCursor.i, maxCursor.i);
  }
  set selectedText(txt) {
    this.setSelectedText(txt);
  }
  get selectionStart() {
    return this.frontCursor.i;
  }
  set selectionStart(i) {
    i = i | 0;
    if (i !== this.frontCursor.i) {
      this.frontCursor.setI(this.rows, i);
      this.render();
    }
  }
  get selectionEnd() {
    return this.backCursor.i;
  }
  set selectionEnd(i) {
    i = i | 0;
    if (i !== this.backCursor.i) {
      this.backCursor.setI(this.rows, i);
      this.render();
    }
  }
  get selectionDirection() {
    return this.frontCursor.i <= this.backCursor.i ? "forward" : "backward";
  }
  get tabWidth() {
    return this._tabWidth;
  }
  set tabWidth(tw) {
    this._tabWidth = tw || 2;
    this.tabString = "";
    for (let i = 0; i < this.tabWidth; ++i) {
      this.tabString += " ";
    }
  }
  get theme() {
    return this._theme;
  }
  set theme(t2) {
    if (t2 !== this.theme) {
      this._theme = t2;
      this.render();
    }
  }
  get language() {
    return this._language;
  }
  set language(l) {
    if (l !== this.language) {
      this._language = l;
      this.refreshAllTokens();
    }
  }
  get padding() {
    return this._padding;
  }
  set padding(p) {
    p = p | 0;
    if (p !== this.padding) {
      this._padding = p;
      this.render();
    }
  }
  get showLineNumbers() {
    return this._showLineNumbers;
  }
  set showLineNumbers(s) {
    s = s || false;
    if (s !== this.showLineNumbers) {
      this._showLineNumbers = s;
      this.refreshGutter();
    }
  }
  get showScrollBars() {
    return this._showScrollBars;
  }
  set showScrollBars(s) {
    s = s || false;
    if (s !== this.showScrollBars) {
      this._showScrollBars = s;
      this.refreshGutter();
    }
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(s) {
    s = Math.max(1, s || 0);
    if (s !== this.fontSize) {
      this._fontSize = s;
      this.context.font = `${this.fontSize}px ${getMonospaceFonts()}`;
      this.character.height = this.fontSize;
      this.character.width = this.context.measureText(
        "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM"
      ).width / 100;
      this.refreshAllTokens();
    }
  }
  get scaleFactor() {
    return this._scaleFactor;
  }
  set scaleFactor(s) {
    s = Math.max(0.25, Math.min(4, s || 0));
    if (s !== this.scaleFactor) {
      const lastWidth = this.width;
      const lastHeight = this.height;
      this._scaleFactor = s;
      this.setSize(lastWidth, lastHeight);
    }
  }
  get width() {
    return this.canv.width / this.scaleFactor;
  }
  set width(w) {
    this.setSize(w, this.height);
  }
  get height() {
    return this.canv.height / this.scaleFactor;
  }
  set height(h) {
    this.setSize(this.width, h);
  }
  get mouse() {
    return this._mouse;
  }
  get touch() {
    return this._touch;
  }
  fillRect(gfx, fill, x, y, w, h) {
    gfx.fillStyle = fill;
    gfx.fillRect(
      x * this.character.width,
      y * this.character.height,
      w * this.character.width + 1,
      h * this.character.height + 1
    );
  }
  strokeRect(gfx, stroke, x, y, w, h) {
    gfx.strokeStyle = stroke;
    gfx.strokeRect(
      x * this.character.width,
      y * this.character.height,
      w * this.character.width + 1,
      h * this.character.height + 1
    );
  }
  renderCanvasBackground() {
    const minCursor = Cursor.min(this.frontCursor, this.backCursor);
    const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
    this.bgfx.clearRect(0, 0, this.canv.width, this.canv.height);
    if (this.theme.regular.backColor) {
      this.bgfx.fillStyle = this.theme.regular.backColor;
      this.bgfx.fillRect(0, 0, this.canv.width, this.canv.height);
    }
    this.bgfx.save();
    this.bgfx.scale(this.scaleFactor, this.scaleFactor);
    this.bgfx.translate(
      (this.gridBounds.x - this.scroll.x) * this.character.width + this.padding,
      -this.scroll.y * this.character.height + this.padding
    );
    if (this.focused) {
      this.fillRect(
        this.bgfx,
        this.theme.currentRowBackColor || Dark.currentRowBackColor,
        0,
        minCursor.y,
        this.gridBounds.width,
        maxCursor.y - minCursor.y + 1
      );
    }
    const minY = this.scroll.y | 0;
    const maxY = minY + this.gridBounds.height;
    const minX = this.scroll.x | 0;
    const maxX = minX + this.gridBounds.width;
    this.tokenFront.setXY(this.rows, 0, minY);
    this.tokenBack.copy(this.tokenFront);
    for (let y = minY; y <= maxY && y < this.rows.length; ++y) {
      const row = this.rows[y].tokens;
      for (let i = 0; i < row.length; ++i) {
        const t2 = row[i];
        this.tokenBack.x += t2.length;
        this.tokenBack.i += t2.length;
        if (minX <= this.tokenBack.x && this.tokenFront.x <= maxX) {
          const inSelection = minCursor.i <= this.tokenBack.i && this.tokenFront.i < maxCursor.i;
          if (inSelection) {
            const selectionFront = Cursor.max(minCursor, this.tokenFront);
            const selectionBack = Cursor.min(maxCursor, this.tokenBack);
            const cw = selectionBack.i - selectionFront.i;
            this.fillRect(
              this.bgfx,
              this.theme.selectedBackColor || Dark.selectedBackColor,
              selectionFront.x,
              selectionFront.y,
              cw,
              1
            );
          }
        }
        this.tokenFront.copy(this.tokenBack);
      }
      this.tokenFront.x = 0;
      ++this.tokenFront.y;
      this.tokenBack.copy(this.tokenFront);
    }
    if (this.focused) {
      const cc = this.theme.cursorColor || Dark.cursorColor;
      const w = 1 / this.character.width;
      this.fillRect(this.bgfx, cc, minCursor.x, minCursor.y, w, 1);
      this.fillRect(this.bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
    }
    this.bgfx.restore();
  }
  renderCanvasForeground() {
    this.fgfx.clearRect(0, 0, this.canv.width, this.canv.height);
    this.fgfx.save();
    this.fgfx.scale(this.scaleFactor, this.scaleFactor);
    this.fgfx.translate(
      (this.gridBounds.x - this.scroll.x) * this.character.width + this.padding,
      this.padding
    );
    const minY = this.scroll.y | 0;
    const maxY = minY + this.gridBounds.height;
    const minX = this.scroll.x | 0;
    const maxX = minX + this.gridBounds.width;
    this.tokenFront.setXY(this.rows, 0, minY);
    this.tokenBack.copy(this.tokenFront);
    for (let y = minY; y <= maxY && y < this.rows.length; ++y) {
      const row = this.rows[y].tokens;
      const textY = (y - this.scroll.y) * this.character.height;
      for (let i = 0; i < row.length; ++i) {
        const t2 = row[i];
        this.tokenBack.x += t2.length;
        this.tokenBack.i += t2.length;
        if (minX <= this.tokenBack.x && this.tokenFront.x <= maxX) {
          const style = this.theme[t2.type] || {};
          const fontWeight2 = style.fontWeight || this.theme.regular.fontWeight || Dark.regular.fontWeight || "", fontStyle2 = style.fontStyle || this.theme.regular.fontStyle || Dark.regular.fontStyle || "", font = `${fontWeight2} ${fontStyle2} ${this.context.font}`;
          this.fgfx.font = font.trim();
          this.fgfx.fillStyle = style.foreColor || this.theme.regular.foreColor;
          this.fgfx.fillText(
            t2.value,
            this.tokenFront.x * this.character.width,
            textY
          );
        }
        this.tokenFront.copy(this.tokenBack);
      }
      this.tokenFront.x = 0;
      ++this.tokenFront.y;
      this.tokenBack.copy(this.tokenFront);
    }
    this.fgfx.restore();
  }
  renderCanvasTrim() {
    this.tgfx.clearRect(0, 0, this.canv.width, this.canv.height);
    this.tgfx.save();
    this.tgfx.scale(this.scaleFactor, this.scaleFactor);
    this.tgfx.translate(this.padding, this.padding);
    if (this.showLineNumbers) {
      this.fillRect(
        this.tgfx,
        this.theme.selectedBackColor || Dark.selectedBackColor,
        0,
        0,
        this.gridBounds.x,
        this.width - this.padding * 2
      );
      this.strokeRect(
        this.tgfx,
        this.theme.regular.foreColor || Dark.regular.foreColor,
        0,
        0,
        this.gridBounds.x,
        this.height - this.padding * 2
      );
    }
    let maxRowWidth = 2;
    this.tgfx.save();
    {
      this.tgfx.translate((this.lineCountWidth - 0.5) * this.character.width, -this.scroll.y * this.character.height);
      let lastLineNumber = -1;
      const minY = this.scroll.y | 0;
      const maxY = minY + this.gridBounds.height;
      this.tokenFront.setXY(this.rows, 0, minY);
      this.tokenBack.copy(this.tokenFront);
      for (let y = minY; y <= maxY && y < this.rows.length; ++y) {
        const row = this.rows[y];
        maxRowWidth = Math.max(maxRowWidth, row.stringLength);
        if (this.showLineNumbers) {
          if (row.lineNumber > lastLineNumber) {
            lastLineNumber = row.lineNumber;
            this.tgfx.font = "bold " + this.context.font;
            this.tgfx.fillStyle = this.theme.regular.foreColor;
            this.tgfx.fillText(
              row.lineNumber.toFixed(0),
              0,
              y * this.character.height
            );
          }
        }
      }
    }
    this.tgfx.restore();
    if (this.showScrollBars) {
      this.tgfx.fillStyle = this.theme.selectedBackColor || Dark.selectedBackColor;
      if (!this.wordWrap && maxRowWidth > this.gridBounds.width) {
        const drawWidth = this.gridBounds.width * this.character.width - this.padding;
        const scrollX = this.scroll.x * drawWidth / maxRowWidth + this.gridBounds.x * this.character.width;
        const scrollBarWidth = drawWidth * (this.gridBounds.width / maxRowWidth);
        const by = this.height - this.character.height - this.padding;
        const bw = Math.max(this.character.width, scrollBarWidth);
        this.tgfx.fillRect(scrollX, by, bw, this.character.height);
        this.tgfx.strokeRect(scrollX, by, bw, this.character.height);
      }
      if (this.rows.length > this.gridBounds.height) {
        const drawHeight = this.gridBounds.height * this.character.height;
        const scrollY = this.scroll.y * drawHeight / this.rows.length;
        const scrollBarHeight = drawHeight * (this.gridBounds.height / this.rows.length);
        const bx = this.width - vScrollWidth * this.character.width - 2 * this.padding;
        const bw = vScrollWidth * this.character.width;
        const bh = Math.max(this.character.height, scrollBarHeight);
        this.tgfx.fillRect(bx, scrollY, bw, bh);
        this.tgfx.strokeRect(bx, scrollY, bw, bh);
      }
    }
    this.tgfx.restore();
    if (!this.focused) {
      this.tgfx.fillStyle = this.theme.unfocused || Dark.unfocused;
      this.tgfx.fillRect(0, 0, this.canv.width, this.canv.height);
    }
  }
  doRender() {
    if (this.theme) {
      const textChanged = this.lastText !== this.value;
      const focusChanged = this.focused !== this.lastFocused;
      const fontChanged = this.context.font !== this.lastFont;
      const paddingChanged = this.padding !== this.lastPadding;
      const themeChanged = this.theme.name !== this.lastThemeName;
      const boundsChanged = this.gridBounds.toString() !== this.lastGridBounds;
      const characterWidthChanged = this.character.width !== this.lastCharacterWidth;
      const characterHeightChanged = this.character.height !== this.lastCharacterHeight;
      const cursorChanged = this.frontCursor.i !== this.lastFrontCursor || this.backCursor.i !== this.lastBackCursor, scrollChanged = this.scroll.x !== this.lastScrollX || this.scroll.y !== this.lastScrollY, layoutChanged = this.resized || boundsChanged || textChanged || characterWidthChanged || characterHeightChanged || paddingChanged || scrollChanged || themeChanged, backgroundChanged = layoutChanged || cursorChanged, foregroundChanged = layoutChanged || fontChanged, trimChanged = layoutChanged || focusChanged;
      if (backgroundChanged) {
        this.renderCanvasBackground();
      }
      if (foregroundChanged) {
        this.renderCanvasForeground();
      }
      if (trimChanged) {
        this.renderCanvasTrim();
      }
      this.context.clearRect(0, 0, this.canv.width, this.canv.height);
      this.context.save();
      this.context.translate(this.vibX, this.vibY);
      this.context.drawImage(this.bg, 0, 0);
      this.context.drawImage(this.fg, 0, 0);
      this.context.drawImage(this.tg, 0, 0);
      this.context.restore();
      this.lastGridBounds = this.gridBounds.toString();
      this.lastText = this.value;
      this.lastCharacterWidth = this.character.width;
      this.lastCharacterHeight = this.character.height;
      this.lastPadding = this.padding;
      this.lastFrontCursor = this.frontCursor.i;
      this.lastBackCursor = this.backCursor.i;
      this.lastFocused = this.focused;
      this.lastFont = this.context.font;
      this.lastThemeName = this.theme.name;
      this.lastScrollX = this.scroll.x;
      this.lastScrollY = this.scroll.y;
      this.resized = false;
      this.dispatchEvent(this.updateEvt);
    }
  }
  refreshControlType() {
    const lastControlType = this.controlType;
    if (this.readOnly && this.multiLine) {
      this.controlType = multiLineOutput;
    } else if (this.readOnly && !this.multiLine) {
      this.controlType = singleLineOutput;
    } else if (!this.readOnly && this.multiLine) {
      this.controlType = multiLineInput;
    } else {
      this.controlType = singleLineInput;
    }
    if (this.controlType !== lastControlType) {
      this.refreshAllTokens();
    }
  }
  refreshGutter() {
    if (!this.showScrollBars) {
      this.bottomRightGutter.set(0, 0);
    } else if (this.wordWrap) {
      this.bottomRightGutter.set(vScrollWidth, 0);
    } else {
      this.bottomRightGutter.set(vScrollWidth, 1);
    }
  }
  setValue(txt, setUndo) {
    txt = txt || "";
    txt = txt.replace(/\r\n/g, "\n");
    if (txt !== this.value) {
      this._value = txt;
      if (setUndo) {
        this.pushUndo();
      }
      this.refreshAllTokens();
      this.dispatchEvent(this.changeEvt);
    }
  }
  setSelectedText(txt) {
    txt = txt || "";
    txt = txt.replace(/\r\n/g, "\n");
    if (this.frontCursor.i !== this.backCursor.i || txt.length > 0) {
      const minCursor = Cursor.min(this.frontCursor, this.backCursor);
      const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
      const startRow = this.rows[minCursor.y];
      const endRow = this.rows[maxCursor.y];
      const unchangedLeft = this.value.substring(0, startRow.startStringIndex);
      const unchangedRight = this.value.substring(endRow.endStringIndex);
      const changedStartSubStringIndex = minCursor.i - startRow.startStringIndex;
      const changedLeft = startRow.substring(0, changedStartSubStringIndex);
      const changedEndSubStringIndex = maxCursor.i - endRow.startStringIndex;
      const changedRight = endRow.substring(changedEndSubStringIndex);
      const changedText = changedLeft + txt + changedRight;
      this.value = unchangedLeft + changedText + unchangedRight;
      this.pushUndo();
      this.refreshTokens(minCursor.y, maxCursor.y, changedText);
      this.frontCursor.setI(this.rows, minCursor.i + txt.length);
      this.backCursor.copy(this.frontCursor);
      this.scrollIntoView(this.frontCursor);
      this.dispatchEvent(this.changeEvt);
    }
  }
  refreshAllTokens() {
    this.refreshTokens(0, this.rows.length - 1, this.value);
  }
  refreshTokens(startY, endY, txt) {
    while (startY > 0 && this.rows[startY].lineNumber === this.rows[startY - 1].lineNumber) {
      --startY;
      txt = this.rows[startY].text + txt;
    }
    while (endY < this.rows.length - 1 && this.rows[endY].lineNumber === this.rows[endY + 1].lineNumber) {
      ++endY;
      txt += this.rows[endY].text;
    }
    const newTokens = this.language.tokenize(txt);
    const startRow = this.rows[startY];
    const startTokenIndex = startRow.startTokenIndex;
    const startLineNumber = startRow.lineNumber;
    const startStringIndex = startRow.startStringIndex;
    const endRow = this.rows[endY];
    const endTokenIndex = endRow.endTokenIndex;
    const tokenRemoveCount = endTokenIndex - startTokenIndex;
    const oldTokens = this.tokens.splice(startTokenIndex, tokenRemoveCount, ...newTokens);
    this.lineCountWidth = 0;
    if (this.showLineNumbers) {
      for (let token of oldTokens) {
        if (token.type === "newlines") {
          --this.lineCount;
        }
      }
      for (let token of newTokens) {
        if (token.type === "newlines") {
          ++this.lineCount;
        }
      }
      this.lineCountWidth = Math.max(1, Math.ceil(Math.log(this.lineCount) / Math.LN10)) + 1;
    }
    const x = Math.floor(this.lineCountWidth + this.padding / this.character.width);
    const y = Math.floor(this.padding / this.character.height);
    const w = Math.floor((this.width - 2 * this.padding) / this.character.width) - x - this.bottomRightGutter.width;
    const h = Math.floor((this.height - 2 * this.padding) / this.character.height) - y - this.bottomRightGutter.height;
    this.gridBounds.set(x, y, w, h);
    const tokenQueue = newTokens.map((t2) => t2.clone());
    const rowRemoveCount = endY - startY + 1;
    const newRows = [];
    let currentString = "";
    let currentTokens = [];
    let currentStringIndex = startStringIndex;
    let currentTokenIndex = startTokenIndex;
    let currentLineNumber = startLineNumber;
    for (let i = 0; i < tokenQueue.length; ++i) {
      const t2 = tokenQueue[i];
      const widthLeft = this.gridBounds.width - currentString.length;
      const wrap = this.wordWrap && t2.type !== "newlines" && t2.length > widthLeft;
      const breakLine = t2.type === "newlines" || wrap;
      if (wrap) {
        const split = t2.length > this.gridBounds.width ? widthLeft : 0;
        tokenQueue.splice(i + 1, 0, t2.splitAt(split));
      }
      currentTokens.push(t2);
      currentString += t2.value;
      if (breakLine || i === tokenQueue.length - 1) {
        newRows.push(new Row(currentString, currentTokens, currentStringIndex, currentTokenIndex, currentLineNumber));
        currentStringIndex += currentString.length;
        currentTokenIndex += currentTokens.length;
        currentTokens = [];
        currentString = "";
        if (t2.type === "newlines") {
          ++currentLineNumber;
        }
      }
    }
    this.rows.splice(startY, rowRemoveCount, ...newRows);
    for (let y2 = startY + newRows.length; y2 < this.rows.length; ++y2) {
      const row = this.rows[y2];
      row.lineNumber = currentLineNumber;
      row.startStringIndex = currentStringIndex;
      row.startTokenIndex += currentTokenIndex;
      currentStringIndex += row.stringLength;
      currentTokenIndex += row.numTokens;
      if (row.tokens[row.tokens.length - 1].type === "newlines") {
        ++currentLineNumber;
      }
    }
    if (this.rows.length === 0) {
      this.rows.push(Row.emptyRow(0, 0, 0));
    } else {
      const lastRow = this.rows[this.rows.length - 1];
      if (lastRow.text.endsWith("\n")) {
        this.rows.push(Row.emptyRow(lastRow.endStringIndex, lastRow.endTokenIndex, lastRow.lineNumber + 1));
      }
    }
    this.maxVerticalScroll = Math.max(0, this.rows.length - this.gridBounds.height);
    this.render();
  }
  refreshBuffers() {
    this.resized = true;
    setContextSize(this.fgfx, this.canv.width, this.canv.height);
    setContextSize(this.bgfx, this.canv.width, this.canv.height);
    setContextSize(this.tgfx, this.canv.width, this.canv.height);
    this.refreshAllTokens();
  }
  clampScroll() {
    const toHigh = this.scroll.y < 0 || this.maxVerticalScroll === 0;
    const toLow = this.scroll.y > this.maxVerticalScroll;
    if (toHigh) {
      this.scroll.y = 0;
    } else if (toLow) {
      this.scroll.y = this.maxVerticalScroll;
    }
    this.render();
    return toHigh || toLow;
  }
  scrollIntoView(currentCursor) {
    const dx = minDelta(currentCursor.x, this.scroll.x, this.scroll.x + this.gridBounds.width);
    const dy = minDelta(currentCursor.y, this.scroll.y, this.scroll.y + this.gridBounds.height);
    this.scrollBy(dx, dy);
  }
  pushUndo() {
    if (this.historyIndex < this.history.length - 1) {
      this.history.splice(this.historyIndex + 1);
    }
    this.history.push({
      value: this.value,
      frontCursor: this.frontCursor.i,
      backCursor: this.backCursor.i
    });
    this.historyIndex = this.history.length - 1;
  }
  moveInHistory(dh) {
    const nextHistoryIndex = this.historyIndex + dh;
    if (0 <= nextHistoryIndex && nextHistoryIndex < this.history.length) {
      const curFrame = this.history[this.historyIndex];
      this.historyIndex = nextHistoryIndex;
      const nextFrame = this.history[this.historyIndex];
      this.setValue(nextFrame.value, false);
      this.frontCursor.setI(this.rows, curFrame.frontCursor);
      this.backCursor.setI(this.rows, curFrame.backCursor);
    }
  }
  blur() {
    if (this.focused) {
      this._focused = false;
      this.dispatchEvent(this.blurEvt);
      this.render();
    }
  }
  focus() {
    if (!this.focused) {
      this._focused = true;
      this.dispatchEvent(this.focusEvt);
      this.render();
    }
  }
  resize() {
    if (!isHTMLCanvas(this.canv)) {
      console.warn("Can't automatically resize a canvas that is not in the DOM tree");
    } else if (resizeContext(this.context, this.scaleFactor)) {
      this.refreshBuffers();
    }
  }
  setSize(w, h) {
    if (setContextSize(this.context, w, h, this.scaleFactor)) {
      this.refreshBuffers();
    }
  }
  scrollTo(x, y) {
    if (!this.wordWrap) {
      this.scroll.x = x;
    }
    this.scroll.y = y;
    return this.clampScroll();
  }
  scrollBy(dx, dy) {
    return this.scrollTo(this.scroll.x + dx, this.scroll.y + dy);
  }
  readKeyDownEvent(evt) {
    const command = this.os.makeCommand(evt);
    if (this.keyDownCommands.has(command.command)) {
      evt.preventDefault();
      this.keyDownCommands.get(command.command)(evt);
    }
  }
  readKeyPressEvent(evt) {
    const command = this.os.makeCommand(evt);
    if (!this.readOnly) {
      evt.preventDefault();
      if (this.keyPressCommands.has(command.command)) {
        this.keyPressCommands.get(command.command)();
      } else if (command.type === "printable" || command.type === "whitespace") {
        this.setSelectedText(command.text);
      }
      this.clampScroll();
      this.render();
    }
  }
  copySelectedText(evt) {
    if (this.focused && this.frontCursor.i !== this.backCursor.i) {
      evt.clipboardData.setData("text/plain", this.selectedText);
      evt.returnValue = false;
      return true;
    }
    return false;
  }
  readCopyEvent(evt) {
    this.copySelectedText(evt);
  }
  readCutEvent(evt) {
    if (this.copySelectedText(evt) && !this.readOnly) {
      this.setSelectedText("");
    }
  }
  readPasteEvent(evt) {
    if (this.focused && !this.readOnly) {
      evt.returnValue = false;
      const clipboard = evt.clipboardData;
      const str = clipboard.getData("text/plain");
      if (str) {
        this.setSelectedText(str);
      }
    }
  }
  readWheelEvent(evt) {
    if (this.hovered || this.focused) {
      if (!evt.ctrlKey && !evt.altKey && !evt.shiftKey && !evt.metaKey) {
        const dy = Math.floor(evt.deltaY * wheelScrollSpeed / scrollScale);
        if (!this.scrollBy(0, dy) || this.focused) {
          evt.preventDefault();
        }
      } else if (!evt.ctrlKey && !evt.altKey && !evt.metaKey) {
        evt.preventDefault();
        this.fontSize += -evt.deltaY / scrollScale;
      }
      this.render();
    }
  }
  vibrate(len) {
    this.longPress.cancel();
    if (len > 0) {
      this.vibX = (Math.random() - 0.5) * 10;
      this.vibY = (Math.random() - 0.5) * 10;
      setTimeout(() => this.vibrate(len - 10), 10);
    } else {
      this.vibX = 0;
      this.vibY = 0;
    }
    this.render();
  }
  setUVPointer(evt) {
    this.pointer.set(
      evt.uv.x * this.width,
      (1 - evt.uv.y) * this.height
    );
  }
  startSelecting() {
    this.dragging = true;
    this.moveCursor(this.frontCursor);
  }
  moveCursor(cursor) {
    this.pointer.toCell(this.character, this.scroll, this.gridBounds);
    const gx = this.pointer.x - this.scroll.x;
    const gy = this.pointer.y - this.scroll.y;
    const onBottom = gy >= this.gridBounds.height;
    const onLeft = gx < 0;
    const onRight = this.pointer.x >= this.gridBounds.width;
    if (!this.scrolling && !onBottom && !onLeft && !onRight) {
      cursor.setXY(this.rows, this.pointer.x, this.pointer.y);
      this.backCursor.copy(cursor);
    } else if (this.scrolling || onRight && !onBottom) {
      this.scrolling = true;
      const scrollHeight = this.rows.length - this.gridBounds.height;
      if (gy >= 0 && scrollHeight >= 0) {
        const sy = gy * scrollHeight / this.gridBounds.height;
        this.scrollTo(this.scroll.x, sy);
      }
    } else if (onBottom && !onLeft) {
      let maxWidth = 0;
      for (let dy = 0; dy < this.rows.length; ++dy) {
        maxWidth = Math.max(maxWidth, this.rows[dy].stringLength);
      }
      const scrollWidth = maxWidth - this.gridBounds.width;
      if (gx >= 0 && scrollWidth >= 0) {
        const sx = gx * scrollWidth / this.gridBounds.width;
        this.scrollTo(sx, this.scroll.y);
      }
    } else if (onLeft && !onBottom) {
    } else {
    }
    this.render();
  }
  dragScroll() {
    if (this.lastScrollDX !== null && this.lastScrollDY !== null) {
      let dx = (this.lastScrollDX - this.pointer.x) / this.character.width;
      let dy = (this.lastScrollDY - this.pointer.y) / this.character.height;
      this.scrollBy(dx, dy);
    }
    this.lastScrollDX = this.pointer.x;
    this.lastScrollDY = this.pointer.y;
  }
  pointerOver() {
    this._hovered = true;
    this.dispatchEvent(this.overEvt);
  }
  pointerOut() {
    this._hovered = false;
    this.dispatchEvent(this.outEvt);
  }
  pointerDown() {
    this.focus();
    this.pressed = true;
  }
  mouseLikePointerDown(setPointer) {
    return (evt) => {
      setPointer(evt);
      this.pointerDown();
      this.startSelecting();
    };
  }
  mouseLikePointerUp() {
    this.pressed = false;
    this.dragging = false;
    this.scrolling = false;
  }
  mouseLikePointerMove(setPointer) {
    return (evt) => {
      setPointer(evt);
      this.pointerMove();
    };
  }
  touchLikePointerDown(setPointer) {
    return (evt) => {
      setPointer(evt);
      this.tx = this.pointer.x;
      this.ty = this.pointer.y;
      this.pointerDown();
      this.longPress.start();
    };
  }
  touchLikePointerUp() {
    if (this.longPress.cancel() && !this.dragging) {
      this.startSelecting();
    }
    this.mouseLikePointerUp();
    this.lastScrollDX = null;
    this.lastScrollDY = null;
  }
  touchLikePointerMove(setPointer) {
    return (evt) => {
      setPointer(evt);
      if (this.longPress.isRunning) {
        const dx = this.pointer.x - this.tx;
        const dy = this.pointer.y - this.ty;
        const lenSq = dx * dx + dy * dy;
        if (lenSq > 25) {
          this.longPress.cancel();
        }
      }
      if (!this.longPress.isRunning) {
        this.pointerMove();
      }
    };
  }
  setMousePointer(evt) {
    this.pointer.set(
      evt.offsetX,
      evt.offsetY
    );
  }
  readMouseOverEvent() {
    this.pointerOver();
  }
  readMouseOutEvent() {
    this.pointerOut();
  }
  readMouseDownEvent(evt) {
    this.mouseLikePointerDown(this.setMousePointer)(evt);
  }
  readMouseUpEvent() {
    this.mouseLikePointerUp();
  }
  readMouseMoveEvent(evt) {
    this.mouseLikePointerMove(this.setMousePointer)(evt);
  }
  findTouch(touches) {
    for (let touch of touches) {
      if (this.currentTouchID === null || touch.identifier === this.currentTouchID) {
        return touch;
      }
    }
    return null;
  }
  withPrimaryTouch(callback) {
    return (evt) => {
      evt.preventDefault();
      callback(this.findTouch(evt.touches) || this.findTouch(evt.changedTouches));
    };
  }
  setTouchPointer(touch) {
    if (isHTMLCanvas(this.canv)) {
      const cb = this.canv.getBoundingClientRect();
      this.pointer.set(
        touch.clientX - cb.left,
        touch.clientY - cb.top
      );
    }
  }
  readTouchStartEvent(evt) {
    this.withPrimaryTouch(this.touchLikePointerDown(this.setTouchPointer))(evt);
  }
  readTouchMoveEvent(evt) {
    this.withPrimaryTouch(this.touchLikePointerMove(this.setTouchPointer))(evt);
  }
  readTouchEndEvent(evt) {
    this.withPrimaryTouch(this.touchLikePointerUp)(evt);
  }
};
Object.freeze(Primrose);
var withCurrentControl = (name) => {
  const evtName = name.toLocaleLowerCase();
  const funcName = `read${name}Event`;
  window.addEventListener(evtName, (evt) => {
    if (focusedControl !== null) {
      focusedControl[funcName](evt);
    }
  }, { passive: false });
};
withCurrentControl("KeyDown");
withCurrentControl("KeyPress");
withCurrentControl("Copy");
withCurrentControl("Cut");
withCurrentControl("Paste");
window.addEventListener("wheel", (evt) => {
  const control = focusedControl || hoveredControl;
  if (control !== null) {
    control.readWheelEvent(evt);
  }
}, { passive: false });
export {
  Basic,
  Dark,
  Grammar,
  HTML,
  JavaScript,
  Light,
  PlainText,
  Primrose,
  Rule,
  Token,
  grammars,
  themes
};
//# sourceMappingURL=index.js.map
