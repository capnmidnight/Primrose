/*
pliny.class({
  parent: "Primrose.Physics",
  name: "DirectedForceField",
  description: "A component that causes two objects (the object to which the DirectedForceField is added as a component and one other object) to repel or attract each other with a set force.",
  parameters: [{
    name: "bodyStart",
    type: "THREE.Object3D",
    description: "An entity that has a rigid body component that we can manipulate for the physics system."
  }, {
    name: "bodyEnd",
    type: "THREE.Object3D",
    description: "An entity that has a rigid body component that we can manipulate for the physics system."
  }, {
    name: "options",
    type: "Object",
    optional: true,
    description: "Optional configuration values. See following parameters:"
  }, {
    name: "options.force",
    type: "Number",
    optional: true,
    default: 1,
    description: "The force to attract the two objects together. Use negative values to repel objects. If `gravitational` is true, the force will be a value for the gravitational constant G in the two-body gravity equation. The real value of G is available as `Primrose.Constants.G."
  }, {
    name: "options.gravitational",
    type: "Boolean",
    optional: true,
    default: false,
    description: "Indicate whether or not to treat the force as gravity, i.e. taking mass into consideration. If `gravitational` is true, the force will be a value for the gravitational constant G in the two-body gravity equation. The real value of G is available as `Primrose.Constants.G."
  }, {
    name: "options.falloff",
    type: "Boolean",
    optional: true,
    default: true,
    description: "Indicate whether or not to use a distance-squared fall-off for the force. If `gravitational` is specified, the fall-off is always distance-squared, regardless of setting this value."
  }]
});
*/

import CANNON from "cannon";
const { Vec3 } = CANNON;

import Component from "../Controls/Component";


const TEMP = new Vec3();

export default class DirectedForceField extends Component {
  constructor(bodyStart, bodyEnd, options) {
    super();

    this.bodyStart = bodyStart;
    this.bodyEnd = bodyEnd;

    options = Object.assign({
      force: 1,
      gravitational: false,
      falloff: true
    }, options);

    /*
    pliny.property({
      parent: "Primrose.Physics.DirectedForceField",
      name: "force",
      type: "Number",
      description: "The force to attract the two objects together. Use negative values to repel objects. If `gravitational` is true, the force will be a value for the gravitational constant G in the two-body gravity equation. The real value of G is available as `Primrose.Constants.G."
    });
    */
    this.force = options.force;

    /*
    pliny.property({
      parent: "Primrose.Physics.DirectedForceField",
      name: "gravitational",
      type: "Boolean",
      description: "Indicate whether or not to treat the force as gravity, i.e. taking mass into consideration. If `gravitational` is true, the force will be a value for the gravitational constant G in the two-body gravity equation. The real value of G is available as `Primrose.Constants.G."
    });
    */
    this.gravitational = options.gravitational;

    /*
    pliny.property({
      parent: "Primrose.Physics.DirectedForceField",
      name: "falloff",
      type: "Boolean",
      description: "Indicate whether or not to use a distance-squared fall-off for the force. If `gravitational` is specified, the fall-off is always distance-squared, regardless of setting this value."
    });
    */
    this.falloff = options.falloff;
  }

  preStep() {
    super.preStep();

    const a = this.bodyEnd.rigidBody,
      b = this.bodyStart.rigidBody;

    if(a && b) {
      b.position.vsub(a.position, TEMP);
      let d = TEMP.length(),
        f = this.force;
      if(this.gravitational) {
        f *= a.mass * b.mass;
      }
      if(this.gravitational || this.falloff) {
        // the distance is cubed so it both normalizes the displacement vector
        // `TEMP` at the same time as computes the distance-squared fall-off.
        d *= d * d;
      }
      TEMP.mult(f / d, TEMP);
      b.force.vadd(TEMP, b.force);
      TEMP.negate(TEMP);
      a.force.vadd(TEMP, a.force);
    }
  }
}
