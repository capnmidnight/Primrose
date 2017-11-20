/*
pliny.function({
  parent: "Live API",
  name: "v2",
  description: "A shortcut function for creating a new THREE.Vector3 object.",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The X component of the vector"
  }, {
    name: "y",
    type: "Number",
    description: "The Y component of the vector"
  }],
  returns: "THREE.Vector2",
  examples: [{
    name: "Create a vector",
    description: "    grammar(\"JavaScript\");\n\
    var a = v2(1, 2);\n\
    console.assert(a.x === 1);\n\
    console.assert(a.y === 2);\n\
    console.assert(a.toArray().join(\", \") === \"1, 2\");"
  }]
});
*/

import { Vector2 } from "three";


export default function v2(x, y) {
  return new Vector2(x, y);
};
