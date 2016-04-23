pliny.function({
  name: "cylinder",
  description: "| [under construction]"
});
function cylinder(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd) {
  return cache(
    `CylinderGeometry(${rT}, ${rB}, ${height}, ${rS}, ${hS}, ${openEnded}, ${thetaStart}, ${thetaEnd})`,
    () => new THREE.CylinderGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd));
}