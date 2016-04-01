"use strict";

pliny.issue({
  name: "document put",
  type: "open",
  description: "Finish writing the documentation for the [`put`](#put) function\n\
in the helpers/graphics.js file."
});
pliny.function({
  name: "put",
  description: "| [under construction]"
});
function put(object) {
  return {
    on: function on(s) {
      s.add(object);
      return {
        at: function at(x, y, z) {
          object.position.set(x, y, z);
          return object;
        }
      };
    }
  };
}
