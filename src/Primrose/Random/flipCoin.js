/*
pliny.function({
  parent: "Primrose.Random",
  name: "flipCoin",
  description: "Returns a true or false. Supports bum coins.",
  returns: "Boolean",
  parameters: [{
    name: "p",
    type: "Number",
    optional: true,
    default: 0.5,
    description: "Set the probability of seeing a true value."
  }],
  examples: [{
    name: "Play heads-or-tails.",
    description: "To generate a sequence of truth values, call the `Primrose.Random.flipCoin()` function:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.flipCoin() ? \"heads\" : \"tails\");\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> heads\n\
> heads\n\
> tails\n\
> heads\n\
> tails\n\
> tails\n\
> tails\n\
> heads\n\
> heads\n\
> tails"
  }]
});
*/

import number from "./number";

export default function flipCoin(p = 0.5) {
  return number(1) < p;
};
