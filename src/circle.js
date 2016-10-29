pliny.function({
  name: "circle",
  description: "| [under construction]"
});

function circle(r, sections, start, end) {
  r = r || 1;
  sections = sections || 18;
  return cache(
    `CircleBufferGeometry(${r}, ${sections}, ${start}, ${end})`,
    () => new THREE.CircleBufferGeometry(r, sections, start, end));
}