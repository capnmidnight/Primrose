function overwrite(obj1, obj2) {
  obj1 = obj1 || {};
  for (var k in obj2) {
    obj1[k] = obj2[k];
  }
  return obj1;
}