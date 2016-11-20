import textured from "./textured";
import colored from "./colored";
import box from "./box";

pliny.function({
  name: "brick",
  description: "Creates a textured box. See [`box()`](#box) and [`textured()`](#textured). The texture will be repeated across the box.",
  parameters: [{
    name: "txt",
    type: "Texture description",
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
  }],
  returns: "THREE.Mesh",
  examples: [{
    name: "Basic usage",
    description: "To create a textured brick with the `brick()` function.:\n\
\n\
    grammar(\"JavaScript\");\n\
    var mesh = brick(DECK, 1, 2, 3);\n\
    put(mesh)\n\
      .on(scene)\n\
      .at(-2, 1, -5);\n\
\n\
The result should appear as:\n\
\n\
![screenshot](images/brick.jpg)"
  }]
});
export default function brick(txt, w, h, l, options) {
  w = w || 1;
  h = h || 1;
  l = l || 1;
  options = Object.assign({}, {
    txtRepeatS: w,
    txtRepeatT: l,
    anisotropy: 8,
    transparent: true,
    opacity: 1
  }, options);
  const m = (typeof txt === "number") ? colored : textured,
    obj = m(box(w, h, l), txt, options);
  return obj;
};