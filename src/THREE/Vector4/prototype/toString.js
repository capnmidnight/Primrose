pliny.method({
  parent: "THREE.Vector4",
  name: "toString ",
  description: "A polyfill method for printing objects.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "the number of significant figures to print."
  }]
});
function toString(digits) {
  var parts = this.toArray();
  if (digits !== undefined) {
    for (var i = 0; i < parts.length; ++i) {
      if (parts[i] !== null && parts[i] !== undefined) {
        parts[i] = parts[i].toFixed(digits);
      }
      else {
        parts[i] = "undefined";
      }
    }
  }
  return "<" + parts.join(", ") + ">";
}