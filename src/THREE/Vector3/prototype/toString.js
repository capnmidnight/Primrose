"use strict";

pliny.method({
  parent: "THREE.Vector3",
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
    parts = parts.map((v) => v.toFixed(digits));
  }
  return "<" + parts.join(", ") + ">";
}