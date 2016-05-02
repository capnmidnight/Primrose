pliny.function({
  name: "axis",
  description: "Creates a set of reference axes, with X as red, Y as green, and Z as blue.",
  returns: "THREE.Object3D",
  parameters: [
    { name: "length", type: "Number", description: "The length each axis should be in its own axis." },
    { name: "width", type: "Number", description: "The size each axis should be in the other axes." }
  ],
  examples: [
    {
      name: "Basic usage", description: "To create a fixed point of reference in the scene, use the `axis()` function.:\n\
\n\
    grammar(\"JavaScript\");\n\
    var scene = new THREE.Scene()\n\
    // This set of axis bars will each be 1 meter long and 5cm wide.\n\
    // They'll be centered on each other, so the individual halves\n\
    // of the bars will only extend half a meter.\n\
    scene.add(axis(1, 0.05));\n\
\n\
The result should appear as:\n\
\n\
![screenshot](images/axis.png)" }
  ]
});
function axis(length, width) {
  var center = hub();
  put(brick(0xff0000, length, width, width)).on(center);
  put(brick(0x00ff00, width, length, width)).on(center);
  put(brick(0x0000ff, width, width, length)).on(center);
  return center;
}