import pliny from "pliny";

export default class BaseVRDisplay {

  constructor(VRFrameDataType) {
    this.frameData = new VRFrameDataType();
  }

  startAnimation(callback) {
    this.timer = this.requestAnimationFrame(callback);
  }

  stopAnimation() {
    this.cancelAnimationFrame(this.timer);
  }
};
