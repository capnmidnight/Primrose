/*
pliny.function({
  parent: "Live API",
  name: "brick",
  description: "Creates a textured box. See [`box()`](#LiveAPI_box) and [`textured()`](#LiveAPI_textured) or [`colored()`](#LiveAPI_colored). The texture will be repeated across the box.",
  parameters: [{
    name: "txt",
    type: "Number or Image",
    description: "The texture to apply to the box."
  }, {
    name: "width",
    type: "Number",
    optional: true,
    description: "The size of the box in the X dimension.",
    default: 1
  }, {
    name: "height",
    type: "Number",
    optional: true,
    description: "The size of the box in the Y dimension.",
    default: 1
  }, {
    name: "length",
    type: "Number",
    optional: true,
    description: "The size of the box in the Z dimension.",
    default: 1
  }, {
    name: "options",
    type: "Object",
    optional: true,
    description: "A hashmap specifying other options to pass on to the material creation function. The material creation function is either [`colored()`](#LiveAPI_colored) or [`textured()`](#LiveAPI_textured), depending on the value of the `txt` parameter passed to this function."
  }],
  returns: "THREE.Mesh",
  examples: [{
    name: "Basic usage",
    description: "To create a textured brick with the `brick()` function.:\n\
\n\
    grammar(\"JavaScript\");\n\
    var mesh = brick(DECK, 1, 2, 3)\n\
      .addTo(scene)\n\
      .at(-2, 1, -5);\n\
\n\
The result should appear as:\n\
\n\
![screenshot](images/brick.jpg)"
  }]
});
*/

import textured from "./textured";
import colored from "./colored";
import box from "./box";


export default function brick(txt, width, height, length, options) {
  width = width || 1;
  height = height || 1;
  length = length || 1;
  options = Object.assign({}, {
    txtRepeatX: width,
    txtRepeatY: length,
    anisotropy: 8,
    transparent: true,
    opacity: 1
  }, options);
  const m = (typeof txt === "number") ? colored : textured,
    obj = m(box(width, height, length), txt, options);
  return obj;
};
