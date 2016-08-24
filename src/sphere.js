pliny.function({
  name: "sphere",
  description: "| [under construction]"
});

function sphere(r, slices, rings) {
  return cache(
    `SphereGeometry(${r}, ${slices}, ${rings})`,
    () => new THREE.SphereGeometry(r, slices, rings));
}