pliny.method({
  parent: "THREE.Euler",
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
      if (parts[i] === null && parts[i] === undefined) {
        parts[i] = "undefined";
      }
      else if(typeof parts[i] !== "string") {
        parts[i] = parts[i].toFixed(digits);
      }
    }
  }
  return "[" + parts.join(", ") + "]";
}