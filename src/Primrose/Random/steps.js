/*
pliny.function({
  parent: "Primrose.Random",
  name: "steps",
  description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive, sticking to a number of steps in between. Useful for randomly generating music note values on pentatonic scales. As random as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  parameters: [{
    name: "min",
    type: "Number",
    description: "The included minimum side of the range of numbers."
  }, {
    name: "max",
    type: "Number",
    description: "The excluded maximum side of the range of numbers."
  }, {
    name: "steps",
    type: "Number",
    description: "The number of steps between individual integers, e.g. if min is even and step is even, then no odd numbers will be generated."
  }],
  returns: "Number",
  examples: [{
    name: "Generate random, even numbers.",
    description: "To generate numbers on a closed range with a constant step size between them, call the `Primrose.Random.step` function as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.steps(0, 100, 2));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> 86  \n\
> 32  \n\
> 86  \n\
> 56  \n\
> 4  \n\
> 96  \n\
> 68  \n\
> 92  \n\
> 4  \n\
> 36"
  }]
});
*/

import randInt from "./int";
export default function steps(min, max, steps) {
  return min + randInt(0, (1 + max - min) / steps) * steps;
};
