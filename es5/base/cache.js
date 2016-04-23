"use strict";

var cache = function () {
  var cache = {};
  return function (hash, makeObject) {
    if (!cache[hash]) {
      cache[hash] = makeObject();
    }
    return cache[hash];
  };
}();
