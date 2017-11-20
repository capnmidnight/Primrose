/*
pliny.function({
  parent: "Primrose.Random",
  name: "number",
  description: "Returns a random floating-point number on a given range [min, max), i.e. min is inclusive, max is exclusive. As random as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  parameters: [{
    name: "min",
    type: "Number",
    description: "The included minimum side of the range of numbers."
  }, {
    name: "max",
    type: "Number",
    description: "The excluded maximum side of the range of numbers."
  }, {
    name: "power",
    type: "Number",
    optional: true,
    description: "The power to which to raise the random number before scaling and translating into the desired range. Values greater than 1 skew output values to the minimum of the range. Values less than 1 skew output values to the maximum of the range.",
    default: 1
  }],
  returns: "Number",
  examples: [{
    name: "Generate a random number on the range [-1, 1).",
    description: "To generate a random number on a closed range, call the `Primrose.Random.number` function as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.number(-1, 1));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -0.4869012129493058  \n\
> 0.5300767715089023  \n\
> 0.11962601682171226  \n\
> -0.22012147679924965  \n\
> 0.48508461797609925  \n\
> -0.8488651723600924  \n\
> 0.15711558377370238  \n\
> -0.3644236018881202  \n\
> 0.4486056035384536  \n\
> -0.9659552359953523"
  }]
});
*/

export default function number(min, max, power) {
  power = power || 1;
  if (max === undefined) {
    max = min;
    min = 0;
  }
  const delta = max - min,
    n = Math.pow(Math.random(), power);
  return min + n * delta;
};
