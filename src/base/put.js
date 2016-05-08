pliny.function({
  name: "put",
  description: "| [under construction]"
});
function put(object) {
  var at = function (x, y, z) {
    object.position.set(x, y, z);
    return object;
  },
    rot = function (x, y, z) {
      object.rotation.set(x, y, z);
      return { at: at };
    };
  return {
    on: function (s) {
      s.add(object);
      return {
        at: at,
        rot: rot
      };
    }
  };
}