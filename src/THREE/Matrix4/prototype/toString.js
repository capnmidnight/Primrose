pliny.method({
  parent: "THREE.Matrix4",
  name: "toString ",
  description: "A polyfill method for printing objects.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "the number of significant figures to print."
  }]
});
function toString(digits) {
  this.transpose();
  var parts = this.toArray();
  if (digits !== undefined) {
    parts = parts.map((v) => v.toFixed(digits));
  }
  var output = "";
  for (var i = 0; i < parts.length; ++i) {
    if ((i % 4) === 0) {
      output += "| ";
    }
    output += parts[i];
    if ((i % 4) === 3) {
      output += " |\n";
    }
    else {
      output += ", ";
    }
  }
  this.transpose();
  return output;
}