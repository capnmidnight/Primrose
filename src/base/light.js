pliny.issue({
  name: "document light",
  type: "open",
  description: "Finish writing the documentation for the [`light`](#light) function\n\
in the helpers/graphics.js file."
});
pliny.function({
  name: "light",
  description: "| [under construction]"
});
function light(color, intensity, distance, decay) {
  return new THREE.PointLight(color, intensity, distance, decay);
}