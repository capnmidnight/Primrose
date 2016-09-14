pliny.function({
  name: "ring",
  description: "| [under construction]"
});

function ring(rInner, rOuter, sectors, start, end, rings) {
  start = start || 0;
  end = end || 2 * Math.PI;
  rings = rings || 1;
  return cache(
    `RingBufferGeometry(${rInner}, ${rOuter}, ${sectors}, ${start}, ${end}, ${rings})`,
    () => new THREE.RingBufferGeometry(rInner, rOuter, sectors, start, end, rings));
}