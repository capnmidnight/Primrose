/*
pliny.function({
  parent: "Primrose.Random",
  name: "vector",
  description: "Returns a random THREE.Vector3 of floating-point numbers on a given range [min, max), i.e. min is inclusive, max is exclusive. As random as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  parameters: [{
    name: "min",
    type: "Number",
    description: "The included minimum side of the range of numbers."
  }, {
    name: "max",
    type: "Number",
    description: "The excluded maximum side of the range of numbers."
  }],
  returns: "THREE.Vector3",
  examples: [{
    name: "Generate a random vector on the range [-1, 1).",
    description: "To generate a random vector on a closed range, call the `Primrose.Random.vector` function as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.vector(-1, 1).toString(\"test\", 3));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> <-0.486, 0.530, 0.119>\n\
> <-0.220, 0.485, -0.848>\n\
> <0.157, -0.364, 0.448>"
  }]
});
*/

import randNum from "./number";
import { Vector3 } from "three";
export default function vector(min, max){
  return new Vector3().set(
    randNum(min, max),
    randNum(min, max),
    randNum(min, max)
  );
};
