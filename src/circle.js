pliny.function({
  name: "circle",
  description: "| [under construction]"
});

function circle(r, sections) {
  return cache(
    `CircleBufferGeometry(${r}, ${sections})`,
    () => new THREE.CircleBufferGeometry(r, sections));
}