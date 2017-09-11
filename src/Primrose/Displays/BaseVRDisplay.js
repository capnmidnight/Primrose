import pliny from "pliny/pliny";

export default class BaseVRDisplay {

  startAnimation(callback) {
    this.timer = this.requestAnimationFrame(callback);
  }

  stopAnimation() {
    this.cancelAnimationFrame(this.timer);
  }
};
