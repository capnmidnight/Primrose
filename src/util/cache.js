/*
pliny.function({
  parent: "Util",
  name: "cache",
  description: "Looks for the hashed name of the object in the object cache, and if it exists, returns it. If it doesn't exist, calls the makeObject function, using the return results to set the object in the cache, and returning it. In other words, a simple sort of memoization.",
  parameters: [{
    name: "hash",
    type: "String",
    description: "The hash key for the object to cache or retrieve."
  }, {
    name: "makeObject",
    type: "Function",
    description: "A function that creates the object we want, if it doesn't already exist in the cache."
  }],
  returns: "Object",
  examples: [{
    name: "Basic usage",
    description: "Using the `cache()` function lets you create an object once and retrieve it back again with the same function call.\n\
\n\
    grammar(\"JavaScript\");\n\
    function makeCube(i){\n\
      return cache(\"cubeGeom\" + i, function(){\n\
        return new THREE.BoxGeometry(i, i, i);\n\
      });\n\
    }\n\
    \n\
    var a = makeCube(1),\n\
        b = makeCube(2),\n\
        c = makeCube(1);\n\
    \n\
    console.assert(a !== b);\n\
    console.assert(a === c);"
  }]
});
*/

const _cache = {};
export default function cache(hash, makeObject, onCacheHit) {
  if (!_cache[hash]) {
    _cache[hash] = makeObject();
  }
  else if(onCacheHit) {
    onCacheHit(_cache[hash]);
  }
  return _cache[hash];
};
