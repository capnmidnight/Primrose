export default class BaseVRDisplay {

  constructor(VRFrameDataType) {
    this.frameData = new VRFrameDataType();
  }

  updateFrameData() {
    this.getFrameData(this.frameData);
  }

  startAnimation(callback) {
    this.timer = this.requestAnimationFrame(callback);
  }

  stopAnimation() {
    this.cancelAnimationFrame(this.timer);
  }

};
