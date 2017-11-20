/*
pliny.function({
  parent: "Live API",
  name: "v3",
  description: "A shortcut function for creating a new THREE.Vector3 object.",
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
  }],
  returns: "THREE.Vector3",
  examples: [{
    name: "Create a vector",
    description: "    grammar(\"JavaScript\");\n\
    var a = v3(1, 2, 3);\n\
    console.assert(a.x === 1);\n\
    console.assert(a.y === 2);\n\
    console.assert(a.z === 3);\n\
    console.assert(a.toArray().join(\", \") === \"1, 2, 3\");"
  }]
});
*/

import { Vector3 } from "three";


export default function v3(x, y, z) {
  return new Vector3(x, y, z);
};
