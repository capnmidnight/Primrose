pliny.function({
  name: "box",
  description: "A shortcut function for the THREE.BoxGeometry class. Creates a \"rectilinear prism\", i.e. the general class of rectangular objects that includes cubes.",
  parameters: [{
    name: "width",
    type: "Number",
    description: "The size of the box in the X dimension."
  }, {
    name: "height",
    type: "Number",
    optional: true,
    description: "The size of the box in the Y dimension. If height is not provided, it will be set to the width parameter."
  }, {
    name: "length",
    type: "Number",
    optional: true,
    description: "The size of the box in the Z dimension. If length is not provided, it will be set to the width parameter."
  }],
  returns: "THREE.BoxGeometry",
  examples: [{
    name: "Basic usage",
    description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple box geometry object that you can then add a material to create a mesh:\n\
  \n\
    grammar(\"JavaScript\");\n\
    var geom = box(1, 2, 3),\n\
      mesh = textured(geom, 0xff0000);\n\
    put(mesh)\n\
      .on(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/box.jpg\">"
  }]
});

function box(width, height, length) {
  if (height === undefined) {
    height = width;
  }
  if (length === undefined) {
    length = width;
  }
  return cache(
    `BoxBufferGeometry(${width}, ${height}, ${length})`,
    () => new THREE.BoxBufferGeometry(width, height, length));
}