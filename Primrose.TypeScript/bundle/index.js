// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/typeChecks.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/arrays.js
function arrayClear(arr) {
  return arr.splice(0);
}
function arrayRemove(arr, value) {
  const idx = arr.indexOf(value);
  if (idx > -1) {
    arrayRemoveAt(arr, idx);
    return true;
  }
  return false;
}
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}
function arrayReplace(arr, ...items) {
  arr.splice(0, arr.length, ...items);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/attrs.js
var warnings = /* @__PURE__ */ new Map();
var HtmlAttr = class {
  /**
   * Creates a new setter functor for HTML Attributes
   * @param key - the attribute name.
   * @param value - the value to set for the attribute.
   * @param bySetAttribute - whether the attribute should be set via the setAttribute method.
   * @param tags - the HTML tags that support this attribute.
   */
  constructor(key, value, bySetAttribute, ...tags) {
    this.key = key;
    this.value = value;
    this.bySetAttribute = bySetAttribute;
    this.tags = tags.map((t2) => t2.toLocaleUpperCase());
    Object.freeze(this);
  }
  /**
   * Set the attribute value on an HTMLElement
   * @param elem - the element on which to set the attribute.
   */
  applyToElement(elem) {
    if (this.tags.length > 0 && this.tags.indexOf(elem.tagName) === -1) {
      let set = warnings.get(elem.tagName);
      if (!set) {
        warnings.set(elem.tagName, set = /* @__PURE__ */ new Set());
      }
      if (!set.has(this.key)) {
        set.add(this.key);
        console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
      }
    }
    if (this.bySetAttribute) {
      elem.setAttribute(this.key, this.value.toString());
    } else if (this.key in elem) {
      elem[this.key] = this.value;
    } else if (this.value === false) {
      elem.removeAttribute(this.key);
    } else if (this.value === true) {
      elem.setAttribute(this.key, "");
    } else if (isFunction(this.value)) {
      this.value(elem);
    } else {
      elem.setAttribute(this.key, this.value.toString());
    }
  }
};
function attr(key, value, bySetAttribute, ...tags) {
  return new HtmlAttr(key, value, bySetAttribute, ...tags);
}
function isAttr(obj) {
  return obj instanceof HtmlAttr;
}
function Height(value) {
  return attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function ID(value) {
  return attr("id", value, false);
}
function Type(value) {
  if (!isString(value)) {
    value = value.value;
  }
  return attr("type", value, false, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu");
}
function Width(value) {
  return attr("width", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/Task.js
var Task = class {
  /**
   * Create a new Task
   *
   * @param autoStart - set to false to require manually starting the Task. Useful
   * for reusable tasks that run on timers.
   */
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
  /**
   * If the task was not auto-started, signal that the task is now ready to recieve
   * resolutions or rejections.
   **/
  start() {
    this._executionState = "running";
  }
  /**
   * Creates a resolving callback for a static value.
   * @param value
   */
  resolver(value) {
    return () => this.resolve(value);
  }
  resolveOn(target, resolveEvt, value) {
    const resolver = this.resolver(value);
    target.addEventListener(resolveEvt, resolver);
    this.finally(() => target.removeEventListener(resolveEvt, resolver));
  }
  /**
   * Get the last result that the task had resolved to, if any is available.
   *
   * If the Task had been rejected, attempting to get the result will rethrow
   * the error that had rejected the task.
   **/
  get result() {
    if (isDefined(this.error)) {
      throw this.error;
    }
    return this._result;
  }
  /**
   * Get the last error that the task had been rejected by, if any.
   **/
  get error() {
    return this._error;
  }
  /**
   * Get the current state of the task.
   **/
  get executionState() {
    return this._executionState;
  }
  /**
   * Returns true when the Task is hasn't started yet.
   **/
  get waiting() {
    return this.executionState === "waiting";
  }
  /**
   * Returns true when the Task is waiting to be resolved or rejected.
   **/
  get started() {
    return this.executionState !== "waiting";
  }
  /**
   * Returns true after the Task has started, but before it has finished.
   **/
  get running() {
    return this.executionState === "running";
  }
  /**
   * Returns true when the Task has been resolved or rejected.
   **/
  get finished() {
    return this.executionState === "finished";
  }
  get resultState() {
    return this._resultState;
  }
  /**
   * Returns true if the Task had been resolved successfully.
   **/
  get resolved() {
    return this.resultState === "resolved";
  }
  /**
   * Returns true if the Task had been rejected, regardless of any
   * reason being given.
   **/
  get errored() {
    return this.resultState === "errored";
  }
  get [Symbol.toStringTag]() {
    return this.toString();
  }
  /**
   * Calling Task.then(), Task.catch(), or Task.finally() creates a new Promise.
   * This method creates that promise and links it with the task.
   **/
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
  /**
   * Attach a handler to the task that fires when the task is resolved.
   *
   * @param onfulfilled
   * @param onrejected
   */
  then(onfulfilled, onrejected) {
    return this.project().then(onfulfilled, onrejected);
  }
  /**
   * Attach a handler that fires when the Task is rejected.
   *
   * @param onrejected
   */
  catch(onrejected) {
    return this.project().catch(onrejected);
  }
  /**
   * Attach a handler that fires regardless of whether the Task is resolved
   * or rejected.
   *
   * @param onfinally
   */
  finally(onfinally) {
    return this.project().finally(onfinally);
  }
  /**
   * Resets the Task to an unsignalled state, which is useful for
   * reducing GC pressure when working with lots of tasks.
   **/
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/EventTarget.js
var CustomEventTarget = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
    this.listenerOptions = /* @__PURE__ */ new Map();
    this.bubblers = /* @__PURE__ */ new Set();
    this.scopes = /* @__PURE__ */ new WeakMap();
  }
  addBubbler(bubbler) {
    this.bubblers.add(bubbler);
  }
  removeBubbler(bubbler) {
    this.bubblers.delete(bubbler);
  }
  addScopedEventListener(scope, type, callback, options) {
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, []);
    }
    this.scopes.get(scope).push([type, callback]);
    this.addEventListener(type, callback, options);
  }
  removeScope(scope) {
    const listeners = this.scopes.get(scope);
    if (listeners) {
      this.scopes.delete(scope);
      for (const [type, listener] of listeners) {
        this.removeEventListener(type, listener);
      }
    }
  }
  addEventListener(type, callback, options) {
    let listeners = this.listeners.get(type);
    if (!listeners) {
      listeners = new Array();
      this.listeners.set(type, listeners);
    }
    if (!listeners.find((c) => c === callback)) {
      listeners.push(callback);
      if (options) {
        this.listenerOptions.set(callback, options);
      }
    }
  }
  removeEventListener(type, callback) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      this.removeListener(listeners, callback);
    }
  }
  clearEventListeners(type) {
    for (const [evtName, handlers] of this.listeners) {
      if (isNullOrUndefined(type) || type === evtName) {
        for (const handler of handlers) {
          this.removeEventListener(type, handler);
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
        if (isFunction(callback)) {
          callback.call(this, evt);
        } else {
          callback.handleEvent(evt);
        }
      }
    }
    if (evt.defaultPrevented) {
      return false;
    }
    for (const bubbler of this.bubblers) {
      if (!bubbler.dispatchEvent(evt)) {
        return false;
      }
    }
    return true;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/css.js
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
  /**
   * Set the attribute value on an HTMLElement
   * @param elem - the element on which to set the attribute.
   */
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/tags.js
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
  } else if (isString(elem)) {
    return getElement(elem);
  }
  return elem;
}
function isIElementAppliable(obj) {
  return isObject(obj) && "applyToElement" in obj && isFunction(obj.applyToElement);
}
function HtmlRender(element, ...children) {
  const elem = element instanceof Element ? element : element instanceof ShadowRoot ? element : isString(element) ? document.querySelector(element) : element.element;
  const target = elem instanceof HTMLTemplateElement ? elem.content : elem;
  for (const child of children) {
    if (isDefined(child)) {
      if (child instanceof Node) {
        target.appendChild(child);
      } else if (isErsatzElement(child)) {
        target.appendChild(resolveElement(child));
      } else if (isIElementAppliable(child)) {
        if (!(elem instanceof ShadowRoot)) {
          child.applyToElement(elem);
        }
      } else {
        target.appendChild(document.createTextNode(child.toLocaleString()));
      }
    }
  }
  return elem;
}
function getElement(selector) {
  return document.querySelector(selector);
}
function HtmlTag(name, ...rest) {
  let elem = null;
  const finders = rest.filter(isAttr).filter((v) => v.key === "id" || v.key === "query");
  for (const finder of finders) {
    if (finder.key === "query") {
      elem = finder.value;
      arrayRemove(rest, finder);
    } else if (finder.key === "id") {
      elem = document.getElementById(finder.value);
      if (elem) {
        arrayRemove(rest, finder);
      }
    }
  }
  if (elem && elem.tagName !== name.toUpperCase()) {
    console.warn(`Expected a "${name.toUpperCase()}" element but found a "${elem.tagName}".`);
  }
  if (!elem) {
    elem = document.createElement(name);
  }
  HtmlRender(elem, ...rest);
  return elem;
}
function elementClearChildren(elem) {
  elem = resolveElement(elem);
  while (elem.lastChild) {
    elem.lastChild.remove();
  }
}
function BR() {
  return HtmlTag("br");
}
function Canvas(...rest) {
  return HtmlTag("canvas", ...rest);
}
function Div(...rest) {
  return HtmlTag("div", ...rest);
}
function Input(...rest) {
  return HtmlTag("input", ...rest);
}
function Span(...rest) {
  return HtmlTag("span", ...rest);
}
function TextArea(...rest) {
  return HtmlTag("textarea", ...rest);
}
function InputText(...rest) {
  return Input(Type("text"), ...rest);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/canvas.js
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
var createUtilityCanvas = hasOffscreenCanvasRenderingContext2D && createOffscreenCanvas || hasHTMLCanvas && createCanvas || null;
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
function createCanvas(w, h) {
  if (false) {
    throw new Error("HTML Canvas is not supported in workers");
  }
  return Canvas(Width(w), Height(h));
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
  const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled, oldTextBaseline = ctx.textBaseline, oldTextAlign = ctx.textAlign, oldFont = ctx.font, resized = setCanvasSize(ctx.canvas, w, h, superscale);
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
    return setCanvasSize(ctx.canvas, w, h, superscale);
  }
}
function resizeContext(ctx, superscale = 1) {
  return setContextSize(ctx, ctx.canvas.clientWidth, ctx.canvas.clientHeight, superscale);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/TypedEventTarget.js
var TypedEvent = class extends Event {
  get type() {
    return super.type;
  }
  constructor(type, eventInitDict) {
    super(type, eventInitDict);
  }
};
var TypedEventTarget = class extends CustomEventTarget {
  addBubbler(bubbler) {
    super.addBubbler(bubbler);
  }
  removeBubbler(bubbler) {
    super.removeBubbler(bubbler);
  }
  addScopedEventListener(scope, type, callback, options) {
    super.addScopedEventListener(scope, type, callback, options);
  }
  addEventListener(type, callback, options) {
    super.addEventListener(type, callback, options);
  }
  removeEventListener(type, callback) {
    super.removeEventListener(type, callback);
  }
  clearEventListeners(type) {
    return super.clearEventListeners(type);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/evts.js
var HtmlEvt = class {
  /**
   * Creates a new setter functor for an HTML element event.
   * @param name - the name of the event to attach to.
   * @param callback - the callback function to use with the event handler.
   * @param opts - additional attach options.
   */
  constructor(name, callback, opts) {
    this.name = name;
    this.callback = callback;
    if (!isFunction(callback)) {
      throw new Error("A function instance is required for this parameter");
    }
    this.opts = opts;
    Object.freeze(this);
  }
  applyToElement(elem) {
    this.add(elem);
  }
  /**
   * Add the encapsulate callback as an event listener to the give HTMLElement
   */
  add(elem) {
    elem.addEventListener(this.name, this.callback, this.opts);
  }
  /**
   * Remove the encapsulate callback as an event listener from the give HTMLElement
   */
  remove(elem) {
    elem.removeEventListener(this.name, this.callback);
  }
};
function onEvent(eventName, callback, opts) {
  return new HtmlEvt(eventName, callback, opts);
}
function onMouseDown(callback, opts) {
  return onEvent("mousedown", callback, opts);
}
function onMouseMove(callback, opts) {
  return onEvent("mousemove", callback, opts);
}
function onMouseOut(callback, opts) {
  return onEvent("mouseout", callback, opts);
}
function onMouseOver(callback, opts) {
  return onEvent("mouseover", callback, opts);
}
function onMouseUp(callback, opts) {
  return onEvent("mouseup", callback, opts);
}
function onTouchEnd(callback, opts) {
  return onEvent("touchend", callback, opts);
}
function onTouchMove(callback, opts) {
  return onEvent("touchmove", callback, opts);
}
function onTouchStart(callback, opts) {
  return onEvent("touchstart", callback, opts);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/flags.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/strings/stringReverse.js
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
var Cursor = class _Cursor {
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
  i;
  x;
  y;
  constructor(i, x, y) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    Object.seal(this);
  }
  clone() {
    return new _Cursor(this.i, this.x, this.y);
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
var Delayer = class extends TypedEventTarget {
  constructor(timeout) {
    super();
    this.timeout = timeout;
    const tickEvt = new TypedEvent("tick");
    this.tick = () => {
      this.cancel();
      this.dispatchEvent(tickEvt);
    };
    Object.seal(this);
  }
  timer = null;
  tick;
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
      if (res) {
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
var Token = class _Token {
  constructor(value, type, startStringIndex) {
    this.value = value;
    this.type = type;
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
    return new _Token(this.value, this.type, this.startStringIndex);
  }
  splitAt(i) {
    const next = this.value.substring(i);
    this.value = this.value.substring(0, i);
    return new _Token(next, this.type, this.startStringIndex + i);
  }
  toString() {
    return `[${this.type}: ${this.value}]`;
  }
};

// src/Grammars/Grammar.ts
function crudeParsing(tokens) {
  let commentDelim = null, stringDelim = null;
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
  grammar;
  /*
    pliny.method({
      parent: "Primrose.Text.Grammar",
      name: "tokenize",
      parameters: [{
        name: "text",
        type: "String",
        description: "The text to tokenize."
      }],
      returns: "An array of tokens, ammounting to drawing instructions to the renderer. However, they still need to be layed out to fit the bounds of the text area.",
      description: "Breaks plain text up into a list of tokens that can later be rendered with color.",
      examples: [{
        name: 'Tokenize some JavaScript',
        description: 'Primrose comes with a grammar for JavaScript built in.\n\
  \n\
  ## Code:\n\
  \n\
    grammar(\"JavaScript\");\n\
    var tokens = new Primrose.Text.Grammars.JavaScript\n\
      .tokenize("var x = 3;\\n\\\n\
    var y = 2;\\n\\\n\
    console.log(x + y);");\n\
    console.log(JSON.stringify(tokens));\n\
  \n\
  ## Result:\n\
  \n\
    grammar(\"JavaScript\");\n\
    [ \n\
      { "value": "var", "type": "keywords", "index": 0, "line": 0 },\n\
      { "value": " x = ", "type": "regular", "index": 3, "line": 0 },\n\
      { "value": "3", "type": "numbers", "index": 8, "line": 0 },\n\
      { "value": ";", "type": "regular", "index": 9, "line": 0 },\n\
      { "value": "\\n", "type": "newlines", "index": 10, "line": 0 },\n\
      { "value": " y = ", "type": "regular", "index": 11, "line": 1 },\n\
      { "value": "2", "type": "numbers", "index": 16, "line": 1 },\n\
      { "value": ";", "type": "regular", "index": 17, "line": 1 },\n\
      { "value": "\\n", "type": "newlines", "index": 18, "line": 1 },\n\
      { "value": "console", "type": "members", "index": 19, "line": 2 },\n\
      { "value": ".", "type": "regular", "index": 26, "line": 2 },\n\
      { "value": "log", "type": "functions", "index": 27, "line": 2 },\n\
      { "value": "(x + y);", "type": "regular", "index": 30, "line": 2 }\n\
    ]'
      }]
    });
    */
  tokenize(text) {
    const tokens = [new Token(text, "regular", 0)];
    for (const rule of this.grammar) {
      for (let j = 0; j < tokens.length; ++j) {
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
    const tokenRows = this.tokenize(txt), temp = Div();
    for (let y = 0; y < tokenRows.length; ++y) {
      const t2 = tokenRows[y];
      if (t2.type === "newlines") {
        temp.appendChild(BR());
      } else {
        const style = theme[t2.type] || {}, elem = Span(
          fontWeight(style.fontWeight || theme.regular.fontWeight),
          fontStyle(style.fontStyle || theme.regular.fontStyle || ""),
          color(style.foreColor || theme.regular.foreColor),
          backgroundColor(style.backColor || theme.regular.backColor),
          getMonospaceFamily()
        );
        HtmlRender(elem, t2.value);
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
      // Grammar rules are applied in the order they are specified.
      [
        ["newlines", /(?:\r\n|\r|\n)/],
        // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
        ["lineNumbers", /^\d+\s+/],
        ["whitespace", /(?:\s+)/],
        // Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
        ["startLineComments", /^REM\s/],
        // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
        ["stringDelim", /("|')/],
        // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
        ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
        // Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
        [
          "keywords",
          /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
        ],
        // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
        ["keywords", /^DEF FN/],
        // These are all treated as mathematical operations.
        [
          "operators",
          /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
        ],
        // Once everything else has been matched, the left over blocks of words are treated as variable and function names.
        ["members", /\w+\$?/]
      ]
    );
  }
  tokenize(code) {
    return super.tokenize(code.toUpperCase());
  }
  /*
      interpret(sourceCode: string, input, output, errorOut, next, clearScreen, loadFile, done) {
          var tokens = this.tokenize(sourceCode),
              EQUAL_SIGN = new Token("=", "operators"),
              counter = 0,
              isDone = false,
              program = new Map(),
              lineNumbers = [],
              currentLine = [],
              lines = [currentLine],
              data = [],
              returnStack = [],
              forLoopCounters = new Map(),
              dataCounter = 0;
  
          Object.assign(window, {
              INT: function (v) {
                  return v | 0;
              },
              RND: function () {
                  return Math.random();
              },
              CLK: function () {
                  return Date.now() / 3600000;
              },
              LEN: function (id) {
                  return id.length;
              },
              LINE: function () {
                  return lineNumbers[counter];
              },
              TAB: function (v) {
                  var str = "";
                  for (var i = 0; i < v; ++i) {
                      str += " ";
                  }
                  return str;
              },
              POW: function (a, b) {
                  return Math.pow(a, b);
              }
          });
  
          function toNum(ln) {
              return new Token(ln.toString(), "numbers");
          }
  
          function toStr(str) {
              return new Token("\"" + str.replace("\n", "\\n")
                  .replace("\"", "\\\"") + "\"", "strings");
          }
  
          var tokenMap = {
              "OR": "||",
              "AND": "&&",
              "NOT": "!",
              "MOD": "%",
              "<>": "!="
          };
  
          while (tokens.length > 0) {
              var token = tokens.shift();
              if (token.type === "newlines") {
                  currentLine = [];
                  lines.push(currentLine);
              }
              else if (token.type !== "regular" && token.type !== "comments") {
                  token.value = tokenMap[token.value] || token.value;
                  currentLine.push(token);
              }
          }
  
          for (var i = 0; i < lines.length; ++i) {
              var line = lines[i];
              if (line.length > 0) {
                  var lastLine = lineNumbers[lineNumbers.length - 1];
                  var lineNumber = line.shift();
  
                  if (lineNumber.type !== "lineNumbers") {
                      line.unshift(lineNumber);
  
                      if (lastLine === undefined) {
                          lastLine = -1;
                      }
  
                      lineNumber = toNum(lastLine + 1);
                  }
  
                  lineNumber = parseFloat(lineNumber.value);
                  if (lastLine && lineNumber <= lastLine) {
                      throw new Error("expected line number greater than " + lastLine +
                          ", but received " + lineNumber + ".");
                  }
                  else if (line.length > 0) {
                      lineNumbers.push(lineNumber);
                      program.set(lineNumber, line);
                  }
              }
          }
  
  
          function process(line) {
              if (line && line.length > 0) {
                  var op = line.shift();
                  if (op) {
                      if (commands.hasOwnProperty(op.value)) {
                          return commands[op.value](line);
                      }
                      else if (!isNaN(op.value)) {
                          return setProgramCounter([op]);
                      }
                      else if (window[op.value] ||
                          (line.length > 0 && line[0].type === "operators" &&
                              line[0].value === "=")) {
                          line.unshift(op);
                          return translate(line);
                      }
                      else {
                          error("Unknown command. >>> " + op.value);
                      }
                  }
              }
              return pauseBeforeComplete();
          }
  
          function error(msg) {
              errorOut("At line " + lineNumbers[counter] + ": " + msg);
          }
  
          function getLine(i) {
              var lineNumber = lineNumbers[i];
              var line = program.get(lineNumber);
              return line && line.slice();
          }
  
          function evaluate(line) {
              var script = "";
              for (var i = 0; i < line.length; ++i) {
                  var t = line[i];
                  var nest = 0;
                  if (t.type === "identifiers" &&
                      typeof window[t.value] !== "function" &&
                      i < line.length - 1 &&
                      line[i + 1].value === "(") {
                      for (var j = i + 1; j < line.length; ++j) {
                          var t2 = line[j];
                          if (t2.value === "(") {
                              if (nest === 0) {
                                  t2.value = "[";
                              }
                              ++nest;
                          }
                          else if (t2.value === ")") {
                              --nest;
                              if (nest === 0) {
                                  t2.value = "]";
                              }
                          }
                          else if (t2.value === "," && nest === 1) {
                              t2.value = "][";
                          }
  
                          if (nest === 0) {
                              break;
                          }
                      }
                  }
                  script += t.value;
              }
  
              try {
                  return eval(script); // jshint ignore:line
              }
              catch (exp) {
                  console.error(exp);
                  console.debug(line.join(", "));
                  console.error(script);
                  error(exp.message + ": " + script);
              }
          }
  
          function declareVariable(line) {
              var decl = [],
                  decls = [decl],
                  nest = 0,
                  i;
              for (i = 0; i < line.length; ++i) {
                  var t = line[i];
                  if (t.value === "(") {
                      ++nest;
                  }
                  else if (t.value === ")") {
                      --nest;
                  }
                  if (nest === 0 && t.value === ",") {
                      decl = [];
                      decls.push(decl);
                  }
                  else {
                      decl.push(t);
                  }
              }
              for (i = 0; i < decls.length; ++i) {
                  decl = decls[i];
                  var id = decl.shift();
                  if (id.type !== "identifiers") {
                      error("Identifier expected: " + id.value);
                  }
                  else {
                      var val = null,
                          j;
                      id = id.value;
                      if (decl[0].value === "(" && decl[decl.length - 1].value === ")") {
                          var sizes = [];
                          for (j = 1; j < decl.length - 1; ++j) {
                              if (decl[j].type === "numbers") {
                                  sizes.push(decl[j].value | 0);
                              }
                          }
                          if (sizes.length === 0) {
                              val = [];
                          }
                          else {
                              val = new Array(sizes[0]);
                              var queue = [val];
                              for (j = 1; j < sizes.length; ++j) {
                                  var size = sizes[j];
                                  for (var k = 0,
                                      l = queue.length; k < l; ++k) {
                                      var arr = queue.shift();
                                      for (var m = 0; m < arr.length; ++m) {
                                          arr[m] = new Array(size);
                                          if (j < sizes.length - 1) {
                                              queue.push(arr[m]);
                                          }
                                      }
                                  }
                              }
                          }
                      }
                      window[id] = val;
                      return true;
                  }
              }
          }
  
          function print(line) {
              var endLine = "\n";
              var nest = 0;
              line = line.map(function (t, i) {
                  t = t.clone();
                  if (t.type === "operators") {
                      if (t.value === ",") {
                          if (nest === 0) {
                              t.value = "+ \", \" + ";
                          }
                      }
                      else if (t.value === ";") {
                          t.value = "+ \" \"";
                          if (i < line.length - 1) {
                              t.value += " + ";
                          }
                          else {
                              endLine = "";
                          }
                      }
                      else if (t.value === "(") {
                          ++nest;
                      }
                      else if (t.value === ")") {
                          --nest;
                      }
                  }
                  return t;
              });
              var txt = evaluate(line);
              if (txt === undefined) {
                  txt = "";
              }
              output(txt + endLine);
              return true;
          }
  
          function setProgramCounter(line) {
              var lineNumber = parseFloat(evaluate(line));
              counter = -1;
              while (counter < lineNumbers.length - 1 &&
                  lineNumbers[counter + 1] < lineNumber) {
                  ++counter;
              }
  
              return true;
          }
  
          function checkConditional(line) {
              var thenIndex = -1,
                  elseIndex = -1,
                  i;
              for (i = 0; i < line.length; ++i) {
                  if (line[i].type === "keywords" && line[i].value === "THEN") {
                      thenIndex = i;
                  }
                  else if (line[i].type === "keywords" && line[i].value === "ELSE") {
                      elseIndex = i;
                  }
              }
              if (thenIndex === -1) {
                  error("Expected THEN clause.");
              }
              else {
                  var condition = line.slice(0, thenIndex);
                  for (i = 0; i < condition.length; ++i) {
                      var t = condition[i];
                      if (t.type === "operators" && t.value === "=") {
                          t.value = "==";
                      }
                  }
                  var thenClause,
                      elseClause;
                  if (elseIndex === -1) {
                      thenClause = line.slice(thenIndex + 1);
                  }
                  else {
                      thenClause = line.slice(thenIndex + 1, elseIndex);
                      elseClause = line.slice(elseIndex + 1);
                  }
                  if (evaluate(condition)) {
                      return process(thenClause);
                  }
                  else if (elseClause) {
                      return process(elseClause);
                  }
              }
  
              return true;
          }
  
          function pauseBeforeComplete() {
              output("PROGRAM COMPLETE - PRESS RETURN TO FINISH.");
              input(function () {
                  isDone = true;
                  if (done) {
                      done();
                  }
              });
              return false;
          }
  
          function labelLine(line) {
              line.push(EQUAL_SIGN);
              line.push(toNum(lineNumbers[counter]));
              return translate(line);
          }
  
          function waitForInput(line: string[]) {
              var toVar = line.pop();
              if (line.length > 0) {
                  print(line);
              }
              input(function (str: string) {
                  str = str.toUpperCase();
                  var valueToken = null;
                  if (!isNaN(str)) {
                      valueToken = toNum(str);
                  }
                  else {
                      valueToken = toStr(str);
                  }
                  evaluate([toVar, EQUAL_SIGN, valueToken]);
                  if (next) {
                      next();
                  }
              });
              return false;
          }
  
          function onStatement(line: Token[]) {
              var idxExpr = [],
                  idx = null,
                  targets = [];
              try {
                  while (line.length > 0 &&
                      (line[0].type !== "keywords" ||
                          line[0].value !== "GOTO")) {
                      idxExpr.push(line.shift());
                  }
  
                  if (line.length > 0) {
                      line.shift(); // burn the goto;
  
                      for (var i = 0; i < line.length; ++i) {
                          var t = line[i];
                          if (t.type !== "operators" ||
                              t.value !== ",") {
                              targets.push(t);
                          }
                      }
  
                      idx = evaluate(idxExpr) - 1;
  
                      if (0 <= idx && idx < targets.length) {
                          return setProgramCounter([targets[idx]]);
                      }
                  }
              }
              catch (exp) {
                  console.error(exp);
              }
              return true;
          }
  
          function gotoSubroutine(line) {
              returnStack.push(toNum(lineNumbers[counter + 1]));
              return setProgramCounter(line);
          }
  
          function setRepeat() {
              returnStack.push(toNum(lineNumbers[counter]));
              return true;
          }
  
          function conditionalReturn(cond) {
              var ret = true;
              var val = returnStack.pop();
              if (val && cond) {
                  ret = setProgramCounter([val]);
              }
              return ret;
          }
  
          function untilLoop(line) {
              var cond = !evaluate(line);
              return conditionalReturn(cond);
          }
  
          function findNext(str) {
              for (i = counter + 1; i < lineNumbers.length; ++i) {
                  var l = getLine(i);
                  if (l[0].value === str) {
                      return i;
                  }
              }
              return lineNumbers.length;
          }
  
          function whileLoop(line) {
              var cond = evaluate(line);
              if (!cond) {
                  counter = findNext("WEND");
              }
              else {
                  returnStack.push(toNum(lineNumbers[counter]));
              }
              return true;
          }
  
          var FOR_LOOP_DELIMS = ["=", "TO", "STEP"];
  
          function forLoop(line) {
              var n = lineNumbers[counter];
              var varExpr = [];
              var fromExpr = [];
              var toExpr = [];
              var skipExpr = [];
              var arrs = [varExpr, fromExpr, toExpr, skipExpr];
              var a = 0;
              var i = 0;
              for (i = 0; i < line.length; ++i) {
                  var t = line[i];
                  if (t.value === FOR_LOOP_DELIMS[a]) {
                      if (a === 0) {
                          varExpr.push(t);
                      }
                      ++a;
                  }
                  else {
                      arrs[a].push(t);
                  }
              }
  
              var skip = 1;
              if (skipExpr.length > 0) {
                  skip = evaluate(skipExpr);
              }
  
              if (!forLoopCounters.has(n) === undefined) {
                  forLoopCounters.set(n, evaluate(fromExpr));
              }
  
              var end = evaluate(toExpr);
              var cond = forLoopCounters.get(n) <= end;
              if (!cond) {
                  forLoopCounters.delete(n);
                  counter = findNext("NEXT");
              }
              else {
                  var v = forLoopCounters.get(n);
                  varExpr.push(toNum(v));
                  process(varExpr);
                  v += skip;
                  forLoopCounters.set(n, v);
                  returnStack.push(toNum(lineNumbers[counter]));
              }
              return true;
          }
  
          function stackReturn() {
              return conditionalReturn(true);
          }
  
          function loadCodeFile(line) {
              loadFile(evaluate(line))
                  .then(next);
              return false;
          }
  
          function noop() {
              return true;
          }
  
          function loadData(line) {
              while (line.length > 0) {
                  var t = line.shift();
                  if (t.type !== "operators") {
                      data.push(t.value);
                  }
              }
              return true;
          }
  
          function readData(line) {
              if (data.length === 0) {
                  var dataLine = findNext("DATA");
                  process(getLine(dataLine));
              }
              var value = data[dataCounter];
              ++dataCounter;
              line.push(EQUAL_SIGN);
              line.push(toNum(value));
              return translate(line);
          }
  
          function restoreData() {
              dataCounter = 0;
              return true;
          }
  
          function defineFunction(line) {
              var name = line.shift()
                  .value;
              var signature = "";
              var body = "";
              var fillSig = true;
              for (var i = 0; i < line.length; ++i) {
                  var t = line[i];
                  if (t.type === "operators" && t.value === "=") {
                      fillSig = false;
                  }
                  else if (fillSig) {
                      signature += t.value;
                  }
                  else {
                      body += t.value;
                  }
              }
              name = "FN" + name;
              var script = "(function " + name + signature + "{ return " + body +
                  "; })";
              window[name] = eval(script); // jshint ignore:line
              return true;
          }
  
          function translate(line) {
              evaluate(line);
              return true;
          }
  
          var commands = {
              DIM: declareVariable,
              LET: translate,
              PRINT: print,
              GOTO: setProgramCounter,
              IF: checkConditional,
              INPUT: waitForInput,
              END: pauseBeforeComplete,
              STOP: pauseBeforeComplete,
              REM: noop,
              "'": noop,
              CLS: clearScreen,
              ON: onStatement,
              GOSUB: gotoSubroutine,
              RETURN: stackReturn,
              LOAD: loadCodeFile,
              DATA: loadData,
              READ: readData,
              RESTORE: restoreData,
              REPEAT: setRepeat,
              UNTIL: untilLoop,
              "DEF FN": defineFunction,
              WHILE: whileLoop,
              WEND: stackReturn,
              FOR: forLoop,
              NEXT: stackReturn,
              LABEL: labelLine
          };
  
          return function () {
              if (!isDone) {
                  var goNext = true;
                  while (goNext) {
                      var line = getLine(counter);
                      goNext = process(line);
                      ++counter;
                  }
              }
          };
      };
      */
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
  ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n/])+\/)/],
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

// src/Point.ts
var Point = class _Point {
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
    return new _Point(this.x, this.y);
  }
  toString() {
    return `(x:${this.x}, y:${this.y})`;
  }
};

// src/Size.ts
var Size = class _Size {
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
    if (s) {
      this.width = s.width;
      this.height = s.height;
    }
  }
  clone() {
    return new _Size(this.width, this.height);
  }
  toString() {
    return `<w:${this.width}, h:${this.height}>`;
  }
};

// src/Rectangle.ts
var Rectangle = class _Rectangle {
  point;
  size;
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
    return new _Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
  }
  overlap(r) {
    const left = Math.max(this.left, r.left), top = Math.max(this.top, r.top), right = Math.min(this.right, r.right), bottom = Math.min(this.bottom, r.bottom);
    if (right > left && bottom > top) {
      return new _Rectangle(left, top, right - left, bottom - top);
    }
    return null;
  }
  toString() {
    return `[${this.point.toString()} x ${this.size.toString()}]`;
  }
};

// src/Row.ts
var Row = class _Row {
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
    for (const grapheme of graphemes) {
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
    return new _Row("", [], startStringIndex, startTokenIndex, lineNumber);
  }
  leftCorrections;
  rightCorrections;
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
for (const pair of keyGroups) {
  for (const value of pair[1]) {
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
      ["Shift_Delete", "DeleteLine"],
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
  makeCommand;
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
var controls = [];
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
  for (const element of document.getElementsByTagName("primrose")) {
    new Primrose({
      element
    });
  }
});
var Primrose = class _Primrose extends TypedEventTarget {
  /// <summary>
  /// Registers a new Primrose editor control with the Event Manager, to wire-up key, clipboard, and mouse wheel events, and to manage the currently focused element.
  /// The Event Manager maintains the references in a WeakMap, so when the JS Garbage Collector collects the objects, they will be gone.
  /// Multiple objects may be used to register a single control with the Event Manager without causing issue.This is useful for associating the control with closed objects from other systems, such as Three Mesh objects being targeted for pointer picking.
  /// If you are working with Three, it's recommended to use the Mesh on which you are texturing the canvas as the key when adding the editor to the Event Manager.
  /// </summary>
  static add(key, control) {
    if (key !== null) {
      elements.set(key, control);
    }
    if (controls.indexOf(control) === -1) {
      controls.push(control);
      arrayReplace(publicControls, ...controls.slice());
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
  /// <summary>
  /// Checks for the existence of a control, by the key that the user supplied when calling `Primrose.add()`
  /// </summary>
  static has(key) {
    return elements.has(key);
  }
  /// <summary>
  /// Gets the control associated with the given key.
  /// </summary>
  static get(key) {
    return elements.has(key) ? elements.get(key) : null;
  }
  /// <summary>
  /// The current `Primrose` control that has the mouse hovered over it. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
  /// If no control is hovered, this returns `null`.
  /// </summary>
  static get hoveredControl() {
    return hoveredControl;
  }
  /// <summary>
  /// The current `Primrose` control that has pointer-focus. It will receive all keyboard and clipboard events. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
  /// If no control is focused, this returns `null`.
  /// </summary>
  static get focusedControl() {
    return focusedControl;
  }
  /// <summary>
  /// An array of all of the `Primrose` editor controls that Primrose currently knows about.
  /// This array is not mutable and is not the array used by the Event Manager. It is a read-only clone that is created whenever the Event Manager registers or removes a new control
  /// </summary.
  static get editors() {
    return publicControls;
  }
  /// <summary>
  /// A `Promise` that resolves when the document is ready and the Event Manager has finished its initial setup.
  /// </summary>
  static get ready() {
    return ready;
  }
  _unlocked = false;
  _value = "";
  _padding = 0;
  _fontSize = null;
  _scaleFactor = 2;
  _readOnly = false;
  _wordWrap = false;
  _multiLine = false;
  _language = JavaScript;
  _showScrollBars = false;
  _showLineNumbers = false;
  _hovered = false;
  _focused = false;
  _element = null;
  _theme = Dark;
  _tabWidth = 2;
  currentTouchID = null;
  vibX = 0;
  vibY = 0;
  tx = 0;
  ty = 0;
  canv = null;
  resized = false;
  pressed = false;
  tabString = "  ";
  dragging = false;
  historyIndex = -1;
  scrolling = false;
  tabPressed = false;
  lineCount = 1;
  lineCountWidth = 0;
  controlType = singleLineOutput;
  maxVerticalScroll = 0;
  currentValue = "";
  currentTabIndex = -1;
  lastCharacterHeight = null;
  lastCharacterWidth = null;
  lastFrontCursor = null;
  lastGridBounds = null;
  lastBackCursor = null;
  lastThemeName = null;
  lastPadding = null;
  lastFocused = null;
  lastScrollX = null;
  lastScrollY = null;
  lastScrollDX = null;
  lastScrollDY = null;
  lastFont = null;
  lastText = null;
  history = [];
  tokens = new Array();
  rows = [Row.emptyRow(0, 0, 0)];
  scroll = new Point();
  pointer = new Point();
  character = new Size();
  bottomRightGutter = new Size();
  gridBounds = new Rectangle();
  tokenBack = new Cursor();
  tokenFront = new Cursor();
  backCursor = new Cursor();
  frontCursor = new Cursor();
  outEvt = new TypedEvent("out");
  overEvt = new TypedEvent("over");
  blurEvt = new TypedEvent("blur");
  focusEvt = new TypedEvent("focus");
  changeEvt = new TypedEvent("change");
  updateEvt = new TypedEvent("update");
  os = isApple() ? MacOS : Windows;
  longPress = new Delayer(1e3);
  keyPressCommands;
  keyDownCommands;
  _mouse;
  _touch;
  surrogate;
  context;
  fg;
  fgfx;
  bg;
  bgfx;
  tg;
  tgfx;
  constructor(options) {
    super();
    this.surrogate = getElement("#primroseSurrogate");
    if (isNullOrUndefined(this.surrogate)) {
      HtmlRender(
        document.body,
        this.surrogate = TextArea(
          ID("primroseSurrogate"),
          display("none")
        )
      );
    }
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
      /// <summary>
      /// Read's a THREE Raycast intersection to perform the hover gestures.
      // </summary>
      readOverEventUV: () => this.pointerOver(),
      /// <summary>
      /// Read's a THREE Raycast intersection to perform the end of the hover gesture.
      // </summary>
      readOutEventUV: () => this.pointerOut(),
      /// <summary>
      /// Read's a THREE Raycast intersection to perform mouse-like behavior for primary-button-up gesture.
      // </summary>
      readUpEventUV: () => this.mouseLikePointerUp(),
      /// <summary>
      /// Read's a THREE Raycast intersection to perform mouse-like behavior for primary-button-down gesture.
      // </summary>
      readDownEventUV: this.mouseLikePointerDown(this.setUVPointer),
      /// <summary>
      /// Read's a THREE Raycast intersection to perform mouse-like behavior for move gesture, whether the primary button is pressed or not.
      // </summary>
      readMoveEventUV: this.mouseLikePointerMove(this.setUVPointer)
    });
    this._touch = Object.freeze({
      /// <summary>
      /// Read's a THREE Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOverEventUV, included for completeness.
      // </summary>
      readOverEventUV: () => this.pointerOver(),
      /// <summary>
      /// Read's a THREE Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOutEventUV, included for completeness.
      // </summary>
      readOutEventUV: () => this.pointerOut(),
      /// <summary>
      /// Read's a THREE Raycast intersection to perform touch-like behavior for the first finger moving gesture.
      // </summary>
      readUpEventUV: () => this.touchLikePointerUp(),
      /// <summary>
      /// Read's a THREE Raycast intersection to perform touch-like behavior for the first finger touching down gesture.
      // </summary>
      readDownEventUV: this.touchLikePointerDown(this.setUVPointer),
      /// <summary>
      /// Read's a THREE Raycast intersection to perform touch-like behavior for the first finger raising up gesture.
      // </summary>
      readMoveEventUV: this.touchLikePointerMove(this.setUVPointer)
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
    if (isNullOrUndefined(options.element) || isCanvas(options.element)) {
      this.canv = isCanvas(options.element) ? options.element : createUtilityCanvas(options.width, options.height);
      if (isHTMLCanvas(this.canv)) {
        this._element = this.canv;
      } else if ("window" in globalThis) {
        this._element = InputText();
      }
    } else {
      this._element = options.element;
      elementClearChildren(this.element);
      this.canv = Canvas(
        width(perc(100)),
        height(perc(100))
      );
      this.element.appendChild(this.canv);
      this.element.removeAttribute("tabindex");
      HtmlRender(
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
        for (const tabbableElement of tabbableElements) {
          this.currentTabIndex = Math.max(this.currentTabIndex, tabbableElement.tabIndex);
        }
        ++this.currentTabIndex;
      }
      this.canv.tabIndex = this.currentTabIndex;
      this.canv.style.touchAction = "none";
      this.canv.addEventListener("focus", () => this.focus());
      this.canv.addEventListener("blur", () => this.blur());
      this.set2DMouseEvents(this.canv);
      this.set2DTouchEvents(this.canv);
      new ResizeObserver(() => this.resize()).observe(this.canv);
    }
    this.context = this.canv.getContext("2d");
    this.fg = createUtilityCanvas(this.canv.width, this.canv.height);
    this.fgfx = this.fg.getContext("2d");
    this.bg = createUtilityCanvas(this.canv.width, this.canv.height);
    this.bgfx = this.bg.getContext("2d");
    this.tg = createUtilityCanvas(this.canv.width, this.canv.height);
    this.tgfx = this.tg.getContext("2d");
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
    if (options.language instanceof Grammar) {
      language = options.language;
    } else if (isString(options.language)) {
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
    this._unlocked = true;
    _Primrose.add(this.element, this);
  }
  _renderTimer = null;
  render() {
    if (isDefined(this._renderTimer)) {
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }
    setTimeout(() => {
      this._renderTimer = null;
      if (this._unlocked) {
        this.doRender();
      }
    }, 0);
  }
  /// <summary>
  /// The DOM element that was used to construct the `Primrose` control out of the document tree.If the Control was not constructed from the document tree, this value will be`null`.
  /// </summary>
  get element() {
    return this._element;
  }
  /// <summary>
  /// Returns `false` if `element` is null. Returns `true` otherwise.
  /// </summary>
  get isInDocument() {
    return isHTMLCanvas(this.canv) && document.body.contains(this.canv);
  }
  /// <summary>
  /// The canvas to which the editor is rendering text. If the `options.element` value was set to a canvas, that canvas will be returned. Otherwise, the canvas will be the canvas that Primrose created for the control. If `OffscreenCanvas` is not available, the canvas will be an `HTMLCanvasElement`.
  /// </summary>
  get canvas() {
    return this.canv;
  }
  /// <summary>
  /// Returns `true` when the control has a pointer hovering over it.
  /// </summary>
  get hovered() {
    return this._hovered;
  }
  /// <summary>
  /// Returns `true` when the control has been selected.Writing to this value will change the focus state of the control.
  /// If the control is already focused and`focused` is set to`true`, or the control is not focused and`focus` is set to`false`, nothing happens.
  /// If the control is focused and`focused` is set to`false`, the control is blurred, just as if `blur()` was called.
  /// If the control is not focused and`focused` is set to`true`, the control is blurred, just as if `focus()` was called.
  /// </summary>
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
  /// <summary>
  /// Indicates whether or not the text in the editor control can be modified.
  /// </summary>
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
  /// <summary>
  /// Indicates whether or not the text in the editor control will be broken across lines when it reaches the right edge of the editor control.
  /// </summary>
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
  /// <summary>
  /// The text value contained in the control. NOTE: if the text value was set with Windows-style newline characters (`\r\n`), the newline characters will be normalized to Unix-style newline characters (`\n`).
  /// </summary>
  get value() {
    return this._value;
  }
  set value(txt) {
    this.setValue(txt, true);
  }
  /// <summary>
  /// A synonymn for `value`
  /// </summary>
  get text() {
    return this.value;
  }
  set text(txt) {
    this.setValue(txt, true);
  }
  /// <summary>
  /// The range of text that is currently selected by the cursor. If no text is selected, reading `selectedText` returns the empty string (`""`) and writing to it inserts text at the current cursor location. 
  /// If text is selected, reading `selectedText` returns the text between the front and back cursors, writing to it overwrites the selected text, inserting the provided value.
  /// </summary>
  get selectedText() {
    const minCursor = Cursor.min(this.frontCursor, this.backCursor);
    const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
    return this.value.substring(minCursor.i, maxCursor.i);
  }
  set selectedText(txt) {
    this.setSelectedText(txt);
  }
  /// <summary>
  /// The string index at which the front cursor is located. NOTE: the "front cursor" is the main cursor, but does not necessarily represent the beginning of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
  /// </summary>
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
  /// <summary>
  /// The string index at which the back cursor is located. NOTE: the "back cursor" is the selection range cursor, but does not necessarily represent the end of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
  /// </summary>
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
  /// <summary>
  /// If the back cursor is behind the front cursor, this value returns `"backward"`. Otherwise, `"forward"` is returned.
  /// </summary>
  get selectionDirection() {
    return this.frontCursor.i <= this.backCursor.i ? "forward" : "backward";
  }
  /// <summary>
  /// The number of spaces to insert when the <kbd>Tab</kbd> key is pressed. Changing this value does not convert existing tabs, it only changes future tabs that get inserted.
  /// </summary>
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
  /// <summary>
  /// A JavaScript object that defines the color and style values for rendering different UI and text elements.
  /// </summary>
  get theme() {
    return this._theme;
  }
  set theme(t2) {
    if (t2 !== this.theme) {
      this._theme = t2;
      this.render();
    }
  }
  /// <summary>
  /// Set or get the language pack used to tokenize the control text for syntax highlighting.
  /// </summary>
  get language() {
    return this._language;
  }
  set language(l) {
    if (l !== this.language) {
      this._language = l;
      this.refreshAllTokens();
    }
  }
  /// <summary>
  /// The `Number` of pixels to inset the control rendering from the edge of the canvas. This is useful for texturing objects where the texture edge cannot be precisely controlled. This value is scale-independent.
  /// </summary>
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
  /// <summary>
  /// Indicates whether or not line numbers should be rendered on the left side of the control.
  /// </summary>
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
  /// <summary>
  /// Indicates whether or not scroll bars should be rendered at the right and bottom in the control. If wordWrap is enabled, the bottom, horizontal scrollbar will not be rendered.
  /// </summary>
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
  /// <summary>
  /// The `Number` of pixels tall to draw characters. This value is scale-independent.
  /// </summary>
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
  /// <summary>
  /// The value by which pixel values are scaled before being used by the editor control.
  /// With THREE, it's best to set this value to 1 and change the width, height, and fontSize manually.
  /// </summary>
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
  /// <summary>
  /// The scale-independent width of the editor control.
  /// </summary>
  get width() {
    return this.canv.width / this.scaleFactor;
  }
  set width(w) {
    this.setSize(w, this.height);
  }
  /// <summary>
  /// The scale-independent height of the editor control.
  /// </summary>
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
  //>>>>>>>>>> PRIVATE METHODS >>>>>>>>>>
  //>>>>>>>>>> RENDERING >>>>>>>>>>
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
  //<<<<<<<<<< RENDERING <<<<<<<<<<
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
      this._value = unchangedLeft + changedText + unchangedRight;
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
    if (this._unlocked) {
      while (startY > 0 && this.rows[startY].lineNumber === this.rows[startY - 1].lineNumber) {
        --startY;
        txt = this.rows[startY].text + txt;
      }
      while (endY < this.rows.length - 1 && this.rows[endY].lineNumber === this.rows[endY + 1].lineNumber && this.rows[endY + 1].tokens.length > 0) {
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
        for (const token of oldTokens) {
          if (token.type === "newlines") {
            --this.lineCount;
          }
        }
        for (const token of newTokens) {
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
        if (row.tokens.length > 0 && row.tokens[row.tokens.length - 1].type === "newlines") {
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
  /// <summary>
  /// Removes focus from the control.
  /// </summary>
  blur() {
    if (this.focused) {
      this._focused = false;
      this.surrogate.blur();
      this.dispatchEvent(this.blurEvt);
      this.render();
    }
  }
  /// <summary>
  /// Sets the control to be the focused control. If all controls in the app have been properly registered with the Event Manager, then any other, currently focused control will first get `blur`red.
  /// </summary>
  focus() {
    if (!this.focused) {
      this._focused = true;
      this.surrogate.focus();
      this.dispatchEvent(this.focusEvt);
      this.render();
    }
  }
  /// <summary>
  /// </summary>
  resize() {
    if (!isHTMLCanvas(this.canv)) {
      console.warn("Can't automatically resize a canvas that is not in the DOM tree");
    } else if (resizeContext(this.context, this.scaleFactor)) {
      this.refreshBuffers();
    }
  }
  /// <summary>
  /// Sets the scale-independent width and height of the editor control.
  /// </summary>
  setSize(w, h) {
    if (setContextSize(this.context, w, h, this.scaleFactor)) {
      this.refreshBuffers();
    }
  }
  /// <summary>
  /// Move the scroll window to a new location. Values get clamped to the text contents of the editor.
  /// </summary>
  scrollTo(x, y) {
    if (!this.wordWrap) {
      this.scroll.x = x;
    }
    this.scroll.y = y;
    return this.clampScroll();
  }
  /// <summary>
  /// Move the scroll window by a given amount to a new location. The final location of the scroll window gets clamped to the text contents of the editor.
  /// </summary>
  scrollBy(dx, dy) {
    return this.scrollTo(this.scroll.x + dx, this.scroll.y + dy);
  }
  readKeyDownEvent(evt) {
    const command = this.os.makeCommand(evt);
    if (this.keyDownCommands.has(command.command)) {
      evt.preventDefault();
      this.keyDownCommands.get(command.command)(evt);
    } else if (evt.key === "Tab") {
      evt.preventDefault();
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
  //>>>>>>>>>> POINTER EVENT HANDLERS >>>>>>>>>>
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
      const dx = (this.lastScrollDX - this.pointer.x) / this.character.width;
      const dy = (this.lastScrollDY - this.pointer.y) / this.character.height;
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
  pointerMove = () => {
    if (this.dragging) {
      this.moveCursor(this.backCursor);
    } else if (this.pressed) {
      this.dragScroll();
    }
  };
  mouseLikePointerDown(setPointer) {
    return (evt) => {
      setPointer.call(this, evt);
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
      setPointer.call(this, evt);
      this.pointerMove();
    };
  }
  touchLikePointerDown(setPointer) {
    return (evt) => {
      setPointer.call(this, evt);
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
      setPointer.call(this, evt);
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
  //>>>>>>>>>> MOUSE EVENT HANDLERS >>>>>>>>>> 
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
  set2DMouseEvents(canv) {
    HtmlRender(
      canv,
      onMouseOver(() => this.readMouseOverEvent()),
      onMouseOut(() => this.readMouseOutEvent()),
      onMouseDown((evt) => this.readMouseDownEvent(evt)),
      onMouseMove((evt) => this.readMouseMoveEvent(evt)),
      onMouseUp(() => this.readMouseUpEvent())
    );
  }
  //<<<<<<<<<< MOUSE EVENT HANDLERS <<<<<<<<<<
  //>>>>>>>>>> TOUCH EVENT HANDLERS >>>>>>>>>>
  findTouch(touches) {
    for (const touch of touches) {
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
  set2DTouchEvents(canv) {
    HtmlRender(
      canv,
      onTouchStart((evt) => this.readTouchStartEvent(evt)),
      onTouchMove((evt) => this.readTouchMoveEvent(evt)),
      onTouchEnd((evt) => this.readTouchEndEvent(evt))
    );
  }
  //<<<<<<<<<< TOUCH EVENT HANDLERS <<<<<<<<<<
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
