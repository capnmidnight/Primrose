import { Euler, Quaternion, Vector2, Vector3, Vector4 } from "three";

Euler.prototype.toString =
Quaternion.prototype.toString =
Vector2.prototype.toString =
Vector3.prototype.toString =
Vector4.prototype.toString =
  function(digits) {
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
  };

const cache = {};
Euler.prototype.debug =
Quaternion.prototype.debug =
Vector2.prototype.debug =
Vector3.prototype.debug =
Vector4.prototype.debug =
  function(label, digits) {
    var val = this.toString(digits);
    if (val !== cache[label]) {
      cache[label] = val;
      console.log(label + "\n" + val);
    }
    return this;
  };