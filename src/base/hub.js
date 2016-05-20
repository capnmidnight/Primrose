pliny.function({
  name: "hub",
  description: "Calling `hub()` is a short-hand for creating a new `THREE.Object3D`. This is useful in live-coding examples to keep code terse and easy to write.",
  examples: [
    {
      name: "Basic usage",
      description: "\n\
    //these two lines of code perform the same task.\n\
    var base1 = new THREE.Object3D();\n\
    var base2 = hub();" }
  ]
});
function hub() {
  var obj = new THREE.Object3D();
  obj.addToBrowserEnvironment = (env, scene) => {
    scene.add(obj);
    obj.appendChild = (child) => {
      return child.addToBrowserEnvironment(env, obj);
    };
  };
  return obj;
}