"use strict";

pliny.issue("", {
  name: "document axis",
  type: "open",
  description: "Finish writing the documentation for the [`axis`](#axis) function\n\
in the helpers/graphics.js file."
});
pliny.function("", {
  name: "axis",
  description: "| [under construction]"
});
function axis(length, width) {
  var center = hub();
  put(brick(0xff0000, length, width, width)).on(center);
  put(brick(0x00ff00, width, length, width)).on(center);
  put(brick(0x0000ff, width, width, length)).on(center);
  return center;
}
