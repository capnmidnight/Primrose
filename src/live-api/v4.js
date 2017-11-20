/*
pliny.function({
  parent: "Live API",
  name: "v4",
  description: "A shortcut function for creating a new THREE.Vector4 object.",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The X component of the vector"
  }, {
    name: "y",
    type: "Number",
    description: "The Y component of the vector"
  }, {
    name: "z",
    type: "Number",
    description: "The Z component of the vector"
  }, {
    name: "w",
    type: "Number",
    description: "The W component of the vector"
  }],
  returns: "THREE.Vector4",
  examples: [{
    name: "Create a vector",
    description: "    grammar(\"JavaScript\");\n\
    var a = v4(1, 2, 3);\n\
    console.assert(a.x === 1);\n\
    console.assert(a.y === 2);\n\
    console.assert(a.z === 3);\n\
    console.assert(a.w === 4);\n\
    console.assert(a.toArray().join(\", \") === \"1, 2, 3, 4\");"
  }]
});
*/

import { Vector4 } from "three";


export default function v4(x, y, z, w) {
  return new Vector4(x, y, z, w);
};
