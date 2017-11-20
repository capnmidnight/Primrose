/*
pliny.function({
  parent: "Live API",
  name: "sphere",
  parameters: [{
    name: "radius",
    type: "Number",
    description: "How far the sphere should extend away from a center point."
  }, {
    name: "widthSegments",
    type: "Number",
    description: "The number of faces wide in which to slice the geometry."
  }, {
    name: "heightSegments",
    type: "Number",
    description: "The number of faces tall in which to slice the geometry."
  }, {
    name: "phi",
    type: "Number",
    optional: true,
    description: "The angle in radians around the Y-axis of the sphere.",
    default: "80 degrees."
  }, {
    name: "theta",
    type: "Number",
    optional: true,
    description: "The angle in radians around the Z-axis of the sphere.",
    default: "48 degrees."
  }],
  description: "Creates a THREE.SphereBuffereGeometry.",
  examples: [{
    name: "Create a pointer.",
    description: "Small spheres are useful for indicating things:\n\
\n\
    grammar(\"JavaScript\");\n\
    var ball = colored(\n\
      sphere(0.1),\n\
      0xffff00,\n\
      {unshaded: true} );"
  }]
});
*/

import { SphereGeometry } from "three";

import { cache } from "../util";


export default function sphere(r, slices, rings) {
  return cache(
    `SphereGeometry(${r}, ${slices}, ${rings})`,
    () => new SphereGeometry(r, slices, rings));
};
