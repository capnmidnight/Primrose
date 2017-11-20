/*
pliny.function({
  parent: "Primrose.Random",
  name: "item",
  description: "Returns a random element from an array.",
  parameters: [{
    name: "arr",
    type: "Array",
    description: "The array form which to pick items."
  }],
  returns: "Any",
  examples: [{
    name: "Select a random element from an array.",
    description: "To pick an item from an array at random, call the `Primrose.Random.item` function with the `power` parameter as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var numbers = [\n\
    \"one\",\n\
    \"two\",\n\
    \"three\",\n\
    \"four\",\n\
    \"five\"\n\
  ];\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.item(numbers));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> three  \n\
> four  \n\
> four  \n\
> two  \n\
> three  \n\
> two  \n\
> five  \n\
> four  \n\
> three  \n\
> two"
  }]
});
*/

import randInt from "./int";
export default function item(arr) {
  return arr[randInt(arr.length)];
};
