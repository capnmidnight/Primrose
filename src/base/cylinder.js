
pliny.issue("", {
  name: "document cylinder",
  type: "open",
  description: "Finish writing the documentation for the [`cylinder`](#cylinder) function\n\
in the helpers/graphics.js file."
});
pliny.function("", {
  name: "cylinder",
  description: "| [under construction]"
});
function cylinder(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd) {
  return new THREE.CylinderGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd);
}