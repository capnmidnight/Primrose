import { Matrix4 } from "three";

Matrix4.prototype.toString = function(digits) {
  if(digits === undefined){
    digits = 10;
  }
  this.transpose();
  var parts = this.toArray();
  this.transpose();
  if (digits !== undefined) {
    for (let i = 0; i < parts.length; ++i) {
    }
  }
  var output = "";
  for (let i = 0; i < parts.length; ++i) {
    if ((i % 4) === 0) {
      output += "| ";
    }
    if(Math.sign(parts[i]) === -1){
      output += "-";
    }
    else{
      output += " ";
    }

    if (parts[i] !== null && parts[i] !== undefined) {
      output += Math.abs(parts[i]).toFixed(digits);
    }
    else {
      output += "undefined".substring(0, digits);
    }

    if ((i % 4) === 3) {
      output += " |\n";
    }
    else {
      output += ", ";
    }
  }
  return output;
};
