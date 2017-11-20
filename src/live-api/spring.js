/*
pliny.function({
  parent: "Live API",
  name: "spring",
  parameters: [{
    name: "a",
    type: "Primrose.Controls.Entity",
    description: "One half of the spring."
  }, {
    name: "b",
    type: "Primrose.Controls.Entity",
    description: "The other half of the spring."
  }, {
    name: "options",
    type: "Object",
    optional: true,
    description: "Options to pass to the `CANNON.Spring` constructor."
  }],
  description: "Creates a spring physics constraint between two objects."
});
*/

import CANNON from "cannon";

import Spring from "../Primrose/Physics/Spring";


export default function spring(a, b, options) {
  const constraint = new Spring(a, b, options);
  a.components.push(constraint);
  return constraint;
};
