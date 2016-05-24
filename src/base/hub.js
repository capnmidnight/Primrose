pliny.function({
  name: "hub",
  description: "Calling `hub()` is a short-hand for creating a new `THREE.Object3D`. This is useful in live-coding examples to keep code terse and easy to write. It also polyfills in a method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the hub using `appendChild()` such that they may be pickable in the scene.",
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
  return new THREE.Object3D();
}