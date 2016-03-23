pliny.issue("", {
  name: "document box",
  type: "open",
  description: "Finish writing the documentation for the [`box`](#box) function\n\
in the helpers/graphics.js file."
});
pliny.function("", {
  name: "box",
  description: "| [under construction]"
});
function box(w, h, l) {
  if (h === undefined) {
    h = w;
    l = w;
  }
  return new THREE.BoxGeometry(w, h, l);
}