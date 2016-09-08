const DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  },
  EMPTY_SCALE = new THREE.Vector3();

pliny.class({
  parent: "Primrose",
    name: "PoseInputProcessor",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class PoseInputProcessor extends Primrose.InputProcessor {
  constructor(name, commands, axisNames) {
    super(name, commands, axisNames);

    this.currentDevice = null;
    this.lastPose = null;
    this.currentPose = null;
    this.posePosition = new THREE.Vector3();
    this.poseQuaternion = new THREE.Quaternion();
    this.position = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.matrix = new THREE.Matrix4();
  }

  get hasPose() {
    return !!this.currentPose;
  }

  update(dt) {
    super.update(dt);

    if (this.currentDevice) {
      var pose = this.currentPose || this.lastPose || DEFAULT_POSE;
      this.lastPose = pose;
      this.inPhysicalUse = this.currentDevice.capabilities && this.currentDevice.capabilities.hasOrientation || this.inPhysicalUse;
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

  updateStage(stageMatrix) {
    this.matrix.makeRotationFromQuaternion(this.poseQuaternion);
    this.matrix.setPosition(this.posePosition);
    this.matrix.multiplyMatrices(stageMatrix, this.matrix);
    this.matrix.decompose(this.position, this.quaternion, EMPTY_SCALE);
  }
}