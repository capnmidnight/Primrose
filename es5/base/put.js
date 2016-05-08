"use strict";

pliny.function({
  name: "put",
  description: "| [under construction]"
});
function put(object) {
  var at = function at(x, y, z) {
    object.position.set(x, y, z);
    return object;
  },
      rot = function rot(x, y, z) {
    object.rotation.set(x, y, z);
    return { at: at };
  };
  return {
    on: function on(s) {
      s.add(object);
      return {
        at: at,
        rot: rot
      };
    }
  };
}