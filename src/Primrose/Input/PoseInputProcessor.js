pliny.class({
  parent: "Primrose.Input",
  name: "PoseInputProcessor",
  baseClass: "Primrose.Input.InputProcessor",
  description: "| [under construction]"
});

import { Vector3, Quaternion } from "three";
import InputProcessor from "./InputProcessor";

export default class PoseInputProcessor extends InputProcessor {
  constructor(name, commands, axisNames) {
    super(name, commands, axisNames);

    this.posePosition = new Vector3();
    this.poseQuaternion = new Quaternion();
    this.position = new Vector3();
    this.quaternion = new Quaternion();
  }

  update(dt) {
    super.update(dt);

    this.inPhysicalUse = this.hasOrientation || this.inPhysicalUse;
  }
};
