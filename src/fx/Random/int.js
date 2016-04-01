pliny.function({
  parent: "Primrose.Random",
  name: "int",
  description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive. Includes a means to skew the results in one direction or another.",
  parameters: [
    { name: "min", type: "Number", description: "The included minimum side of the range of numbers." },
    { name: "max", type: "Number", description: "The excluded maximum side of the range of numbers." },
    { name: "power", type: "Number", description: "(Optional) The power to which to raise the random number before scaling and translating into the desired range. Values greater than 1 skew output values to the minimum of the range. Values less than 1 skew output values to the maximum of the range. Defaults to 1." }
  ],
  returns: "A random integer as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  examples: [
    {
      name: "Generate a random integer numbers on the range [-10, 10).", description: "To generate a random integer on a closed range, call the `Primrose.Random.integer` function as shown:\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    for(var i = 0; i < 10; ++i){\n\
      console.log(Primrose.Random.int(-10, 10));\n\
    }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -3  \n\
> 1  \n\
> -2  \n\
> 8  \n\
> 7  \n\
> 4  \n\
> 5  \n\
> -9  \n\
> 4  \n\
> 0"},
    {
      name: "Generate skewed random integer numbers on the range [-100, 100).", description: "To generate a random integer skewed to one end of the range on a closed range, call the `Primrose.Random.integer` function with the `power` parameter as shown:\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    for(var i = 0; i < 10; ++i){\n\
      console.log(Primrose.Random.int(-100, 100, 5));\n\
    }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -100  \n\
> -100  \n\
> -78  \n\
> -81  \n\
> -99  \n\
> 18  \n\
> -100  \n\
> -100  \n\
> -100  \n\
> 52"}
  ]
});
Primrose.Random.int = function (min, max, power) {
  power = power || 1;
  if (max === undefined) {
    max = min;
    min = 0;
  }
  var delta = max - min,
    n = Math.pow(Math.random(), power);
  return Math.floor(min + n * delta);
};