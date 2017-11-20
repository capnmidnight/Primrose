/*
pliny.function({
  parent: "Live API",
  name: "range",
  description: "Executes a function a set number of times, to shorten up common programming patterns a little. If the provided function returns value, they will be collected into an array that is returned at the end of the loop. This function has a weird cascading syntax that does not work like normal functions with default values for positional parameters.",
  parameters: [{
    name: "n",
    type: "Number",
    description: "The starting value for the loop counter.",
    optional: true,
    default: 0
  }, {
    name: "m",
    type: "Number",
    description: "The ending value for the loop counter."
  }, {
    name: "s",
    type: "Number",
    description: "The value by which to increment the loop counter.",
    optional: true,
    default: 1
  }, {
    name: "t",
    type: "Function",
    description: "A function that receives the current loop counter value, does work, and optionally returns a result.",
    optional: true,
    default: "the identity function"
  }],
  returns: "Array",
  examples: [{
    name: "Generate an array of ten numbers, from 0 to 9.",
    description: "The most basic usage is with one parameter.\n\
\n\
    grammar(\"JavaScript\");\n\
    var arr = range(10);\n\
    console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];\n\
"
  }, {
    name: "Generate an array of five objects.",
    description: "The last parameter position is always a function.\n\
\n\
    grammar(\"JavaScript\");\n\
    var arr = range(5, hub);\n\
    console.log(arr); // [[Object], [Object], [Object], [Object], [Object]];\n\
"
  }, {
    name: "Generate a subsection of an array of numbers.",
    description: "If you provide two number parameters, the first is treated as the starting value and the second is the end.\n\
\n\
    grammar(\"JavaScript\");\n\
    var arr = range(3, 5);\n\
    console.log(arr); // [3, 4];\n\
"
  }, {
    name: "Generate a series of strings.",
    description: "If you provide two number parameters, the first is treated as the starting value and the second is the end.\n\
\n\
    grammar(\"JavaScript\");\n\
    var arr = range(3, 5, (i) => \"num\" + i);\n\
    console.log(arr); // [\"num3\", \"num4\"];\n\
"
  }, {
    name: "Specify a step value.",
    description: "If you provide three number parameters, the first is treated as the starting value, the second is the end, and the third is the step value.\n\
\n\
    grammar(\"JavaScript\");\n\
    var arr = range(3, 15, 3);\n\
    console.log(arr); // [3, 6, 9, 12];\n\
"
  }, {
    name: "Generate objects using a step value.",
    description: "If you provide three number parameters, the first is treated as the starting value, the second is the end, and the third is the step value.\n\
\n\
    grammar(\"JavaScript\");\n\
    var arr = range(3, 15, 3, (x) => {\n\
      var obj = hub();\n\
      obj.position.x = x;\n\
      return obj;\n\
    });\n\
"
  }]
});
*/

import { identity } from "../util";


export default function range(n, m, s, t) {
  const n2 = s && n || 0,
    m2 = s && m || n,
    s2 = t && s || 1;
  let t2 = t || s || m,
    output = null;

  if(!(t2 instanceof Function)) {
    t2 = identity;
  }

  for (let i = n2; i < m2; i += s2) {
    const value = t2(i);
    if(output === null && value !== undefined) {
      output = [];
    }
    if(output !== null) {
      output.push(value);
    }
  }
  if(output !== null) {
    return output;
  }
};
