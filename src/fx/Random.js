/* global Primrose, pliny */

Primrose.Random = ( function () {

  pliny.namespace( "Primrose.Random", "Functions for handling random numbers of different criteria, or selecting random elements of arrays." );
  var Random = {};

  pliny.function( "Primrose.Random", {
    name: "number",
    description: "Returns a random floating-point number on a given range [min, max), i.e. min is inclusive, max is exclusive.",
    parameters: [
      {name: "min", type: "Number", description: "The included minimum side of the range of numbers."},
      {name: "max", type: "Number", description: "The excluded maximum side of the range of numbers."}
    ],
    returns: "A random number as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
    examples: [
      {name: "Generate a random number on the range [-1, 1).", description: "To generate a random number on a closed range, call the `Primrose.Random.number` function as shown:\n\
\n\
## Code:\n\
``for(var i = 0; i < 10; ++i){\n\
  console.log(Primrose.Random.number(-1, 1));\n\
}``\n\
## Result (note that this is just one possible outcome):\n\
``-0.4869012129493058\n\
0.5300767715089023\n\
0.11962601682171226\n\
-0.22012147679924965\n\
0.48508461797609925\n\
-0.8488651723600924\n\
0.15711558377370238\n\
-0.3644236018881202\n\
0.4486056035384536\n\
-0.9659552359953523``"}
    ]
  } );
  Random.number = function ( min, max ) {
    return Math.random() * ( max - min ) + min;
  };

  pliny.function( "Primrose.Random", {
    name: "int",
    description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive. Includes a means to skew the results in one direction or another.",
    parameters: [
      {name: "min", type: "Number", description: "The included minimum side of the range of numbers."},
      {name: "max", type: "Number", description: "The excluded maximum side of the range of numbers."},
      {name: "power", type: "Number", description: "(Optional) The power to which to raise the random number before scaling and translating into the desired range. Values greater than 1 skew output values to the minimum of the range. Values less than 1 skew output values to the maximum of the range. Defaults to 1."}
    ],
    returns: "A random integer as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
    examples: [
      {name: "Generate a random integer numbers on the range [-10, 10).", description: "To generate a random integer on a closed range, call the `Primrose.Random.integer` function as shown:\n\
\n\
## Code:\n\
``for(var i = 0; i < 10; ++i){\n\
  console.log(Primrose.Random.int(-10, 10));\n\
}``\n\
## Result (note that this is just one possible outcome):\n\
``-3\n\
1\n\
-2\n\
8\n\
7\n\
4\n\
5\n\
-9\n\
4\n\
0``"},
      {name: "Generate skewed random integer numbers on the range [-100, 100).", description: "To generate a random integer skewed to one end of the range on a closed range, call the `Primrose.Random.integer` function with the `power` parameter as shown:\n\
\n\
## Code:\n\
``for(var i = 0; i < 10; ++i){\n\
  console.log(Primrose.Random.int(-100, 100, 5));\n\
}``\n\
## Result (note that this is just one possible outcome):\n\
``-100\n\
-100\n\
-78\n\
-81\n\
-99\n\
18\n\
-100\n\
-100\n\
-100\n\
52``"}
    ]
  } );
  Random.int = function ( min, max, power ) {
    power = power || 1;
    if ( max === undefined ) {
      max = min;
      min = 0;
    }
    var delta = max - min,
        n = Math.pow( Math.random(), power );
    return Math.floor( min + n * delta );
  };

  pliny.function( "Primrose.Random", {
    name: "item",
    description: "Returns a random element from an array.",
    parameters: [
      {name: "arr", type: "Array", description: "The array form which to pick items."}
    ],
    returns: "One of the elements of the array, at random.",
    examples: [
      {name: "Select a random element from an array.", description: "To pick an item from an array at random, call the `Primrose.Random.item` function with the `power` parameter as shown:\n\
\n\
## Code:\n\
``var numbers = [\n\
  \"one\",\n\
  \"two\",\n\
  \"three\",\n\
  \"four\",\n\
  \"five\"\n\
];\n\
for(var i = 0; i < 10; ++i){\n\
  console.log(Primrose.Random.item(numbers));\n\
}``\n\
## Result (note that this is just one possible outcome):\n\
``three\n\
four\n\
four\n\
two\n\
three\n\
two\n\
five\n\
four\n\
three\n\
two``"}
    ]
  } );
  Random.item = function ( arr ) {
    return arr[Primrose.Random.int( arr.length )];
  };

  pliny.function( "Primrose.Random", {
    name: "steps",
    description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive, sticking to a number of steps in between. Useful for randomly generating music note values on pentatonic scales.",
    parameters: [
      {name: "min", type: "Number", description: "The included minimum side of the range of numbers."},
      {name: "max", type: "Number", description: "The excluded maximum side of the range of numbers."},
      {name: "steps", type: "Number", description: "The number of steps between individual integers, e.g. if min is even and step is even, then no odd numbers will be generated."}
    ],
    returns: "A random integer as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
    examples: [
      {name: "Generate random, even numbers.", description: "To generate numbers on a closed range with a constant step size between them, call the `Primrose.Random.step` function as shown:\n\
\n\
## Code:\n\
``for(var i = 0; i < 10; ++i){\n\
  console.log(Primrose.Random.steps(0, 100, 2));\n\
}``\n\
## Result (note that this is just one possible outcome):\n\
``86\n\
32\n\
86\n\
56\n\
4\n\
96\n\
68\n\
92\n\
4\n\
36``"}
    ]
  } );
  Random.steps = function ( min, max, steps ) {
    return min + Primrose.Random.int( 0, ( 1 + max - min ) / steps ) * steps;
  };

  return Random;
} )();

pliny.issue( "Primrose.Random", {
  name: "document Random",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.Random](#Primrose_Random) class in the  directory"
} );
