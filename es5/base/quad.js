"use strict";

pliny.issue({
  name: "document quad",
  type: "open",
  description: "Finish writing the documentation for the [`quad`](#quad) function\n\
in the helpers/graphics.js file."
});
pliny.function({
  name: "quad",
  description: "| [under construction]"
});
function quad(w, h, s, t) {
  if (h === undefined) {
    h = w;
  }
  return cache("PlaneBufferGeometry(" + w + ", " + h + ", " + s + ", " + t + ")", function () {
    return new THREE.PlaneBufferGeometry(w, h, s, t);
  });
}
