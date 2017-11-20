/*
pliny.function({
  parent: "Live API",
  name: "circle",
  description: "A shortcut function for the THREE.CircleBufferGeometry class. Creates a flat circle, oriented in the XZ plane. `Circle` is a bit of a misnomer. It's actually an N-sided polygon, with the implication being that N must be large to convincingly approximate a true circle.",
  parameters: [{
    name: "r",
    type: "Number",
    description: "The radius of the circle.",
    optional: true,
    default: 1
  }, {
    name: "sections",
    type: "Number",
    description: "The number of sides for the polygon approximating a circle.",
    optional: true,
    default: 18
  }, {
    name: "start",
    type: "Number",
    description: "The angle in radians at which to start drawing the circle polygon.",
    optional: true,
    default: 0
  }, {
    name: "end",
    type: "Number",
    description: "The angle in radians at which to stop drawing the circle polygon.",
    optional: true,
    default: 2 * Math.PI
  }],
  returns: "THREE.CircleBufferGeometry",
  examples: [{
    name: "Basic usage",
    description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple circle geometry object that you can then add a material to create a mesh:\n\
  \n\
    grammar(\"JavaScript\");\n\
    var geom = circle(1, 18, 0, 2 * Math.PI)\n\
      .colored(0xff0000)\n\
      .addTo(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/circle.jpg\">"
  }]
});
*/

import { CircleBufferGeometry } from "three";

import { cache } from "../util";


export default function circle(r, sections, start, end) {
  r = r || 1;
  sections = sections || 18;
  return cache(
    `CircleBufferGeometry(${r}, ${sections}, ${start}, ${end})`,
    () => new CircleBufferGeometry(r, sections, start, end));
};
