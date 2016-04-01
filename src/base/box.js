pliny.function({
  name: "box",
  returns: "THREE.BoxGeometry",
  description: "A shortcut function for the THREE.BoxGeometry class. Creates a \"rectilinear prism\", i.e. the general class of rectangular objects that includes cubes.",
  parameters: [
    { name: "width", type: "Number", description: "The size of the box in the X dimension." },
    { name: "height", type: "Number", description: "(optional) The size of the box in the Y dimension. If height is not provided, it will be set to the width parameter." },
    { name: "length", type: "Number", description: "(optional) The size of the box in the Z dimension. If length is not provided, it will be set to the width parameter." }
  ]
});
function box(width, height, length) {
  if (height === undefined) {
    height = width;
  }
  if (length === undefined) {
    length = width;
  }
  return new THREE.BoxGeometry(width, height, length);
}