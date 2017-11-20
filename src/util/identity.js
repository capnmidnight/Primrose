/*
pliny.function({
  parent: "Util",
  name: "identity",
  description: "The identity function takes a single parameter and returns out again that parameter.",
  returns: "Any",
  parameters: [{
    name: "obj",
    type: "Any",
    description: "The value to pass through."
  }],
  examples: [{
    name: "Basic usage",
    description: "The `identity()` function is useful in certain functional programming scenarios, such as filtering values of an array for falseyness.\n\
\n\
    grammar(\"JavaScript\");\n\
    var arr = [false, 1, 2, null, undefined, 0, 3, 4, \"Hello, world.\"];\n\
    console.log(arr.filter(identity)); // [1, 2, 3, 4]"
  }]
});
*/

export default function identity(obj) {
  return obj;
};
