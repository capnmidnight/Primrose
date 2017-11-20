/*
pliny.function({
  parent: "Live API",
  name: "quat",
  description: "A shorthand for THREE.Quaternion.",
  returns: "THREE.Quaternion",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The `x` component of the Quaternion."
  }, {
    name: "y",
    type: "Number",
    description: "The `y` component of the Quaternion."
  }, {
    name: "z",
    type: "Number",
    description: "The `z` component of the Quaternion."
  }, {
    name: "w",
    type: "Number",
    description: "The `w` component of the Quaternion."
  }]
});
*/

import { Quaternion } from "three";


export default function quat(x, y, z, w) {
  return new Quaternion(x, y, z, w);
}
