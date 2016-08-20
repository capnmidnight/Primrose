"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label + "\n" + val);
  }
}