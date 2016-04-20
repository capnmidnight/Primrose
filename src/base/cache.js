var cache = (function () {
  var cache = {};
  return (hash, makeObject) => {
    if (!cache[hash]) {
      cache[hash] = makeObject();
    }
    else {
      console.info("Loading cached", hash);
    }
    return cache[hash];
  };
})();