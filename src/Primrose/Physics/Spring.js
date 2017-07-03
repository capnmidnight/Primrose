import CANNON from "cannon";

import Component from "../Controls/Component";

export default class Spring extends Component {

  constructor(a, b, options) {
    super();
    if(!a.rigidBody) {
      console.error("Object A has no rigidBody", a);
    }
    if(!b.rigidBody) {
      console.error("Object B has no rigidBody", a);
    }

    if(!a.rigidBody || !a.rigidBody) {
      throw new Error("invalid argument");
    }

    this._spring = new CANNON.Spring(a.rigidBody, b.rigidBody, options);
  }

  postStep() {
    super.postStep();
    this._spring.applyForce();
  }

}
