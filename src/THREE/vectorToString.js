import { Euler, Quaternion, Vector2, Vector3, Vector4, Matrix3, Matrix4 } from "three";

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

const debugOutputCache = {};
Euler.prototype.debug =
Quaternion.prototype.debug =
Vector2.prototype.debug =
Vector3.prototype.debug =
Vector4.prototype.debug =
Matrix3.prototype.debug =
Matrix4.prototype.debug =
  function(label, digits) {
    var val = this.toString(digits);
    if (val !== debugOutputCache[label]) {
      debugOutputCache[label] = val;
      console.trace(label + "\n" + val);
    }
    return this;
  };
