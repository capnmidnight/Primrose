"use strict";

pliny.function({
  name: "light",
  description: "| [under construction]"
});
function light(color, intensity, distance, decay) {
  return new THREE.PointLight(color, intensity, distance, decay);
}