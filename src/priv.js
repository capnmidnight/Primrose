function priv() {
  var heap = new WeakMap();
  return function(obj, value) {
    if(!heap.has(obj)) {
      heap.set(obj, value || {});
    }
    return heap.get(obj);
  };
}
