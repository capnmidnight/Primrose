"use strict";

/* global Primrose, pliny */

pliny.issue("", {
  name: "document clearKeyOption",
  type: "open",
  description: "Finish writing the documentation for the [`clearKeyOption`](#clearKeyOption) function\n\
in the helpers/options.js file."
});
pliny.function("", {
  name: "clearKeyOption",
  description: "| [under construction]"
});
function clearKeyOption(evt) {
  this.value = "";
  this.dataset.keycode = "";
}

pliny.issue("", {
  name: "document setKeyOption",
  type: "open",
  description: "Finish writing the documentation for the [`setKeyOption`](#setKeyOption) function\n\
in the helpers/options.js file."
});
pliny.function("", {
  name: "setKeyOption",
  description: "| [under construction]"
});
function setKeyOption(outElem, elemArr, evt) {
  this.dataset.keycode = evt.keyCode;
  this.value = this.value || Primrose.Keys[evt.keyCode];
  this.value = this.value.toLocaleLowerCase().replace("arrow", "");
  this.blur();
  var text = elemArr.map(function (e) {
    return e.value.toLocaleUpperCase();
  }).join(", ");
  if (text.length === 10) {
    text = text.replace(/, /g, "");
  }
  outElem.innerHTML = text;
}

pliny.issue("", {
  name: "document setupKeyOption",
  type: "open",
  description: "Finish writing the documentation for the [`setupKeyOption`](#setupKeyOption) function\n\
in the helpers/options.js file."
});
pliny.function("", {
  name: "setupKeyOption",
  description: "| [under construction]"
});
function setupKeyOption(outElem, elemArr, index, char, code) {
  var elem = elemArr[index];
  elem.value = char.toLocaleLowerCase();
  elem.dataset.keycode = code;
  elem.addEventListener("keydown", clearKeyOption);
  elem.addEventListener("keyup", setKeyOption.bind(elem, outElem, elemArr));
}

pliny.issue("", {
  name: "document combineDefaults",
  type: "open",
  description: "Finish writing the documentation for the [`combineDefaults`](#combineDefaults) function\n\
in the helpers/options.js file."
});
pliny.function("", {
  name: "combineDefaults",
  description: "| [under construction]"
});
function combineDefaults(a, b) {
  var c = {},
      k;
  for (k in a) {
    c[k] = a[k];
  }
  for (k in b) {
    if (!c.hasOwnProperty(k)) {
      c[k] = b[k];
    }
  }
  return c;
}

pliny.issue("", {
  name: "document helpers/options",
  type: "open",
  description: "Finish writing the documentation for the [options](#options) class in the helpers/ directory"
});
