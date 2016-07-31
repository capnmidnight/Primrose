Primrose.PoseInputProcessor = (function () {
  "use strict";

  const DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  };

  pliny.class({
    parent: "Primrose",
      name: "PoseInputProcessor",
      baseClass: "Primrose.InputProcessor",
      description: "| [under construction]"
  });
  class PoseInputProcessor extends Primrose.InputProcessor {
    constructor(name, parent, commands, socket, axisNames) {
      super(name, parent, commands, socket, axisNames);

      this.currentDevice = null;
      this.lastPose = null;
      this.posePosition = new THREE.Vector3();
      this.poseQuaternion = new THREE.Quaternion();
      this.position = new THREE.Vector3();
      this.quaternion = new THREE.Quaternion();
    }

    update(dt) {
      super.update(dt);

      if (this.currentDevice) {
        var pose = this.currentPose || this.lastPose || DEFAULT_POSE;
        this.lastPose = pose;
        this.inPhysicalUse = this.isPresenting && !!this.currentPose;
        var orient = this.currentPose && this.currentPose.orientation,
          pos = this.currentPose && this.currentPose.position;
        if (orient) {
          this.poseQuaternion.fromArray(orient);
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

    get currentPose() {
      throw new Exception("currentPose must be implemented in child class");
    }

    updateStage(stage){
      this.quaternion
        .copy(stage.quaternion)
        .multiply(this.poseQuaternion);

      this.position.copy(this.posePosition)
        .applyQuaternion(stage.quaternion)
        .add(stage.position);
    }
  }

  return PoseInputProcessor;
})();