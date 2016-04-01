pliny.function({
  name: "axis",
  description: "Creates a set of reference axes, with X as red, Y as green, and Z as blue.",
  returns: "THREE.Object3D",
  parameters: [
    { name: "length", type: "Number", description: "The length each axis should be in its own axis." },
    { name: "width", type: "Number", description: "The size each axis should be in the other axes." }
  ]
});
function axis(length, width) {
  var center = hub();
  put(brick(0xff0000, length, width, width)).on(center);
  put(brick(0x00ff00, width, length, width)).on(center);
  put(brick(0x0000ff, width, width, length)).on(center);
  return center;
}