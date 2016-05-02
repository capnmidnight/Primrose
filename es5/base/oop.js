"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

pliny.function({
  name: "copyObject",
  description: "| [under construction]"
});
function copyObject(dest, source) {
  var stack = [{ dest: dest, source: source }];
  while (stack.length > 0) {
    var frame = stack.pop();
    source = frame.source;
    dest = frame.dest;
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        if (_typeof(source[key]) !== "object") {
          dest[key] = source[key];
        } else {
          if (!dest[key]) {
            dest[key] = {};
          }
          stack.push({ dest: dest[key], source: source[key] });
        }
      }
    }
  }
}

pliny.function({
  name: "range",
  description: "| [under construction]"
});
function range(n, m, s, t) {
  var n2 = s && n || 0,
      m2 = s && m || n,
      s2 = t && s || 1,
      t2 = t || s || m;
  for (var i = n2; i < m2; i += s2) {
    t2(i);
  }
}

pliny.function({
  name: "emit",
  description: "| [under construction]"
});
function emit(evt, args) {
  var handlers = this.listeners && this.listeners[evt] || this._listeners && this._listeners[evt];
  for (var i = 0; handlers && i < handlers.length; ++i) {
    handlers[i](args);
  }
}