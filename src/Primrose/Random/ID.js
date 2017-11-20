/*
pliny.function({
  parent: "Primrose.Random",
  name: "ID",
  description: "Returns a randomized string to be used as a general purpose identifier. Collisions are possible, but should be rare.",
  returns: "String",
  examples: [{
    name: "Generate 10 random identifiers.",
    description: "To generate a randomized identifier, call the `Primrose.Random.ID()` function as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.ID());\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> 25xzdqnhg1ma2qsb3k1n61or\n\
> 1hyajmimpyjb4chvge5ng66r\n\
> cq3dy9qnkwhneza3vr3haor\n\
> g3l5k2kfwmxjrxjwg0uj714i\n\
> 7qsta7cutxke8t88pahy3nmi\n\
> h75g0nj0d4gh7zsyowxko6r\n\
> 7pbej49fhhd5icimp3krzfr\n\
> 3vnlovkkvyvmetsjcyirizfr\n\
> icrehedvz97dpgkusfumzpvi\n\
> 9p06sytn6dfearuibsnn4s4i"
  }]
});
*/

export default function ID() {
  return (Math.random() * Math.log(Number.MAX_VALUE))
    .toString(36)
    .replace(".", "");
};
