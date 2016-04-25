"use strict";

pliny.function({
  name: "patch",
  parameters: [{ name: "obj1", type: "Object", description: "The object to which to copy values that don't yet exist in the object." }, { name: "obj2", type: "Object", description: "The object from which to copy values to obj1, if obj1 does not already have a value in place." }],
  returns: "Object - the obj1 parameter, with the values copied from obj2",
  description: "Copies values into Object A from Object B, skipping any value names that already exist in Object A.",
  examples: [{
    name: "Set default values.", description: "The `patch` function is intended to copy default values onto a user-supplied 'options' object, without clobbering the values they have provided.\n\
    var obj1 = {\n\
      a: 1,\n\
      b: 2,\n\
      c: 3\n\
    },\n\
      obj2 = {\n\
      c: 4,\n\
      d: 5,\n\
      e: 6\n\
    },\n\
      obj3 = patch(obj1, obj2);\n\
    console.assert(obj1 === obj3); // the returned object is exactly the same object as the first parameter.\n\
    console.assert(obj3.a === 1); // the `a` property did not exist in obj2\n\
    console.assert(obj3.b === 2); // the `b` property did not exist in obj2\n\
    console.assert(obj3.c === 3); // the `c` property existed in obj2, but it already existed in obj1, so it doesn't get overwritten\n\
    console.assert(obj3.d === 5); // the `d` property did not exist in obj1\n\
    console.assert(obj3.e === 6); // the `e` property did not exist in obj1"
  }]
});
function patch(obj1, obj2) {
  obj1 = obj1 || {};
  for (var k in obj2) {
    if (obj1[k] === undefined || obj1[k] === null) {
      obj1[k] = obj2[k];
    }
  }
  return obj1;
}