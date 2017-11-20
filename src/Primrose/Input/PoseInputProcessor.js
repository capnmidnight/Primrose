/*
pliny.class({
  parent: "Primrose.Input",
  name: "PoseInputProcessor",
  baseClass: "Primrose.Input.InputProcessor",
  description: "| [under construction]"
});
*/

const DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  },
  EMPTY_SCALE = new Vector3(),
  IE_CORRECTION = new Quaternion(1, 0, 0, 0);

import { Vector3, Quaternion, Matrix4 } from "three";

import { isMobile, isIE } from "../../flags";

import InputProcessor from "./InputProcessor";

export default class PoseInputProcessor extends InputProcessor {
  constructor(name, commands, axisNames) {
    super(name, commands, axisNames);

    this.currentDevice = null;
    this.lastPose = null;
    this.currentPose = null;
    this.posePosition = new Vector3();
    this.poseQuaternion = new Quaternion();
    this.position = new Vector3();
    this.quaternion = new Quaternion();
    this.matrix = new Matrix4();
  }

  get hasPose() {
    return !!this.currentPose;
  }

  update(dt) {
    super.update(dt);

    if (this.currentDevice) {
      var pose = this.currentPose || this.lastPose || DEFAULT_POSE;
      this.lastPose = pose;
      this.inPhysicalUse = this.hasOrientation || this.inPhysicalUse;
      var orient = this.currentPose && this.currentPose.orientation,
        pos = this.currentPose && this.currentPose.position;
      if (orient) {
        this.poseQuaternion.fromArray(orient);
        if(isMobile && isIE){
          this.poseQuaternion.multiply(IE_CORRECTION);
        }
      }
      else {
        this.poseQuaternion.set(0, 0, 0, 1);
      }
      if (pos) {
        this.posePosition.fromArray(pos);
      }
      else {
        this.posePosition.set(0, 0, 0);
      }
    }
  }

  updateStage(stageMatrix) {
    this.matrix.makeRotationFromQuaternion(this.poseQuaternion);
    this.matrix.setPosition(this.posePosition);
    this.matrix.multiplyMatrices(stageMatrix, this.matrix);
    this.matrix.decompose(this.position, this.quaternion, EMPTY_SCALE);
  }
};
