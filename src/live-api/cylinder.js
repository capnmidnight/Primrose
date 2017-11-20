/*
pliny.function({
  parent: "Live API",
  name: "cylinder",
  description: "Shorthand function for creating a new THREE.CylinderGeometry object.",
  parameters: [{
    name: "rT",
    type: "Number",
    optional: true,
    description: "The radius at the top of the cylinder.",
    default: 0.5
  }, {
    name: "rB",
    type: "Number",
    optional: true,
    description: "The radius at the bottom of the cylinder.",
    default: 0.5
  }, {
    name: "height",
    type: "Number",
    optional: true,
    description: "The height of the cylinder.",
    default: 1
  }, {
    name: "rS",
    type: "Number",
    optional: true,
    description: "The number of sides on the cylinder.",
    default: 8
  }, {
    name: "hS",
    type: "Number",
    optional: true,
    description: "The number of slices along the height of the cylinder.",
    default: 1
  }, {
    name: "openEnded",
    type: "Boolean",
    optional: true,
    description: "Whether or not to leave the end of the cylinder open, thereby making a pipe.",
    default: false
  }, {
    name: "thetaStart",
    type: "Number",
    optional: true,
    description: "The angle at which to start sweeping the cylinder.",
    default: 0
  }, {
    name: "thetaEnd",
    type: "Number",
    optional: true,
    description: "The angle at which to end sweeping the cylinder.",
    default: 2 * Math.PI
  }],
  returns: "THREE.CylinderBufferGeometry",
  examples: [{
    name: "Basic usage",
    description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple cylinder geometry object that you can then add a material to create a mesh: \n\
  \n\
    grammar(\"JavaScript\");\n\
    var mesh = cylinder()\n\
      .colored(0xff0000)\n\
      .addTo(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/cylinder.jpg\">"
  }]
});
*/

import { CylinderBufferGeometry } from "three";

import { cache } from "../util";


export default function cylinder(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd) {
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
    `CylinderBufferGeometry(${rT}, ${rB}, ${height}, ${rS}, ${hS}, ${openEnded}, ${thetaStart}, ${thetaEnd})`,
    () => new CylinderBufferGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd));
};
