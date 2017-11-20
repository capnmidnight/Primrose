/*
pliny.function({
  parent: "Live API",
  name: "ring",
  description: "A shortcut function for the THREE.RingBufferGeometry class. Creates a flat ring, which is a larger circle with a smaller circle cut out of its center, oriented in the XZ plane. `Circle` is a bit of a misnomer. It's actually an N-sided polygon, with the implication being that N must be large to convincingly approximate a true circle.",
  parameters: [{
    name: "rInner",
    type: "Number",
    description: "The radius of the inner circle of the ring.",
    optional: true,
    default: 0.5
  }, {
    name: "rOuter",
    type: "Number",
    description: "The radius of the outer circle of the ring.",
    optional: true,
    default: 1
  }, {
    name: "sectors",
    type: "Number",
    description: "The number of radial sides for the polygon approximating a ring.",
    optional: true,
    default: 18
  }, {
    name: "rings",
    type: "Number",
    description: "The number of concentric rings in which to split the ring.",
    optional: true,
    default: 1
  }, {
    name: "start",
    type: "Number",
    description: "The angle in radians at which to start drawing the ring polygon.",
    optional: true,
    default: 0
  }, {
    name: "end",
    type: "Number",
    description: "The angle in radians at which to stop drawing the ring polygon.",
    optional: true,
    default: 2 * Math.PI
  }],
  returns: "THREE.CircleBufferGeometry",
  examples: [{
    name: "Basic usage",
    description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple circle geometry object that you can then add a material to create a mesh:\n\
  \n\
    grammar(\"JavaScript\");\n\
    var mesh = ring(0.5, 1, 18, 1, 0, 2 * Math.PI)\n\
      .colored(0xff0000)\n\
      .addTo(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/ring.jpg\">"
  }]
});
*/

import { RingBufferGeometry } from "three";

import { cache } from "../util";


export default function ring(rInner, rOuter, sectors, rings, start, end) {
  if(rInner === undefined){
    rInner = 0.5;
  }
  sectors = sectors || 18;
  rings = rings || 1;
  rOuter = rOuter || 1;
  start = start || 0;
  end = end || 2 * Math.PI;
  return cache(
    `RingBufferGeometry(${rInner}, ${rOuter}, ${sectors}, ${rings}, ${start}, ${end})`,
    () => new RingBufferGeometry(rInner, rOuter, sectors, rings, start, end));
};
