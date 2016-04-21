pliny.issue({
  name: "document sphere",
  type: "open",
  description: "Finish writing the documentation for the [`sphere`](#sphere) function\n\
in the helpers/graphics.js file."
});
pliny.function({
  name: "sphere",
  description: "| [under construction]"
});
function sphere(r, slices, rings) {
  return cache(
    `SphereGeometry(${r}, ${slices}, ${rings})`,
    () => new THREE.SphereGeometry(r, slices, rings));
}