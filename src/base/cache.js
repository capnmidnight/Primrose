var cache = (function () {
  var cache = {};
  return (hash, makeObject) => {
    if (!cache[hash]) {
      cache[hash] = makeObject();
    }
    return cache[hash];
  };
})();