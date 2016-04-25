"use strict";

pliny.function({
  name: "brick",
  returns: "THREE.Mesh",
  description: "Creates a textured box. See [`box()`](#box) and [`textured()`](#textured). The texture will be repeated across the box.",
  parameters: [{ name: "txt", type: "Texture description", description: "The texture to apply to the box." }, { name: "width", type: "Number", description: "(optional) The size of the box in the X dimension. If width is not provided, it will be set to 1." }, { name: "height", type: "Number", description: "(optional) The size of the box in the Y dimension. If height is not provided, it will be set to 1." }, { name: "length", type: "Number", description: "(optional) The size of the box in the Z dimension. If length is not provided, it will be set to 1." }]
});
function brick(txt, w, h, l) {
  return textured(box(w || 1, h || 1, l || 1), txt, {
    txtRepeatS: w,
    txtRepeatT: l
  });
}