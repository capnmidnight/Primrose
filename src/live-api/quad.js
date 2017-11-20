/*
pliny.function({
  parent: "Live API",
  name: "quad",
  description: "A shortcut function for the THREE.PlaneBufferGeometry class. Creates a flat rectangle, oriented in the XY plane.",
  parameters: [{
    name: "width",
    type: "Number",
    description: "The width of the rectangle."
  }, {
    name: "height",
    type: "Number",
    description: "The height of the rectangle.",
    optional: true,
    default: "The value of the `width` parameter."
  }, {
    name: "options",
    type: "Live API.quad.optionsHash",
    optional: true,
    description: "Optional settings for creating the quad geometry. See [`Live API.quad.optionsHash`](#LiveAPI_quad_optionsHash) for more information."
  }],
  returns: "THREE.PlaneBufferGeometry",
  examples: [{
    name: "Basic usage",
    description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple circle geometry object that you can then add a material to create a mesh:\n\
  \n\
    grammar(\"JavaScript\");\n\
    var mesh = quad(1, 2)\n\
      .colored(0xff0000)\n\
      .addTo(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/quad.jpg\">"
  }]
});
*/

/*
pliny.record({
  parent: "Live API.quad",
  name: "optionsHash",
  description: "Optional options to alter how the quad is built.",
  parameters: [{
    name: "s",
    type: "Number",
    description: "The number of sub-quads in which to divide the quad horizontally.",
    optional: true,
    default: 1
  }, {
    name: "t",
    type: "Number",
    description: "The number of sub-quads in which to divide the quad vertically.",
    optional: true,
    default: 1
  }, {
    name: "maxU",
    type: "Number",
    description: "A scalar value for the texture coordinate U component.",
    optional: true,
    default: 1
  }, {
    name: "maxV",
    type: "Number",
    description: "A scalar value for the texture coordinate V component.",
    optional: true,
    default: 1
  }]
});
*/

import { PlaneBufferGeometry } from "three";

import { cache } from "../util";

import fixGeometry from "../Primrose/Graphics/fixGeometry";


export default function quad(width, height, options) {

  if (width === undefined) {
    width = 1;
  }

  if (height === undefined) {
    height = width;
  }

  options = Object.assign({}, {
    s: 1,
    t: 1
  }, options);

  return cache(
    `PlaneBufferGeometry(${width}, ${height}, ${options.s}, ${options.t}, ${options.maxU}, ${options.maxV})`,
    () => fixGeometry(new PlaneBufferGeometry(width, height, options.s, options.t), options));
};
