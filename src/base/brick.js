pliny.issue("", {
  name: "document brick",
  type: "open",
  description: "Finish writing the documentation for the [`brick`](#brick) function\n\
in the helpers/graphics.js file."
});
pliny.function("", {
  name: "brick",
  description: "| [under construction]"
});
function brick(txt, w, h, l) {
  return textured(box(w || 1, h || 1, l || 1), txt, {
    txtRepeatS: w,
    txtRepeatT: l
  });
}