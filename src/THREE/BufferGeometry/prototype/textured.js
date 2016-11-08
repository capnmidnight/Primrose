function textured(name, texture, options) {
  var obj = window.textured(this, texture, options);
  obj.name = name;
  return obj;
}