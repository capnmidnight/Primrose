pliny.function({
  name: "cylinder",
  description: "Shorthand functino for creating a new THREE.CylinderGeometry object.",
  parameters: [
    { name: "rT", type: "Number", description: "(Optional) The radius at the top of the cylinder. Defaults to 0.5." },
    { name: "rB", type: "Number", description: "(Optional) The radius at the bottom of the cylinder. Defaults to 0.5." },
    { name: "height", type: "Number", description: "(Optional) The height of the cylinder. Defaults to 1." },
    { name: "rS", type: "Number", description: "(Optional) The number of sides on the cylinder. Defaults to 8." },
    { name: "hS", type: "Number", description: "(Optional) The number of slices along the height of the cylinder. Defaults to 1." },
    { name: "openEnded", type: "Boolean", description: "(Optional) Whether or not to leave the end of the cylinder open, thereby making a pipe. Defaults to false." },
    { name: "thetaStart", type: "Number", description: "(Optional) The angle at which to start sweeping the cylinder. Defaults to 0." },
    { name: "thetaEnd", type: "Number", description: "(Optional) The angle at which to end sweeping the cylinder. Defaults to 2 * Math.PI." },
  ],
  returns: "THREE.CylinderGeometry",
  examples: [
    {
      name: "Basic usage",
      description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple box geometry object that you can then add a material to create a mesh: \n\
  \n\
    grammar(\"JavaScript\");\n\
    var geom = cylinder(),\n\
      mesh = textured(geom, 0xff0000);\n\
    put(mesh)\n\
      .on(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/cylinder.jpg\">"
    }
  ]
});
function cylinder(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd) {
  if (rT === undefined) {
    rT = 0.5;
  }
  if (rB === undefined) {
    rB = 0.5;
  }
  if (height === undefined) {
    height = 1;
  }
  return cache(
    `CylinderGeometry(${rT}, ${rB}, ${height}, ${rS}, ${hS}, ${openEnded}, ${thetaStart}, ${thetaEnd})`,
    () => new THREE.CylinderGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd));
}