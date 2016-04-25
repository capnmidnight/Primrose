"use strict";

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