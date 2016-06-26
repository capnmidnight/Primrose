pliny.function({
  name: "clone",
  parameters: [{
    name: "obj",
    type: "Object",
    description: "The object-literal to clone"
  }],
  description: "Creates a copy of a JavaScript object literal.",
  examples: [{
    name: "Create a copy of an object.",
    description: "To create a copy of an object that can be modified without modifying the original object, use the `clone()` function:\n\
\n\
    grammar(\"JavaScript\");\n\
    var objA = { x: 1, y: 2 },\n\
        objB = clone(objA);\n\
    console.assert(objA !== objB);\n\
    console.assert(objA.x === objB.x);\n\
    console.assert(objA.y === objB.y);\n\
    objB.x = 3;\n\
    console.assert(objA.x !== objB.x);"
  }]
});

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}