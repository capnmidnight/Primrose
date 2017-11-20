/*
pliny.class({
  parent: "Primrose.Displays",
  name: "BaseVRDisplay",
  description: "The base class from which all *VRDisplay types inherit, providing additional functionality over the WebVR API standard VRDisplay."
});
*/

export default class BaseVRDisplay {

  constructor() {
    this._timer = null;
    this._isAnimating = false;
  }

  startAnimation(callback) {

    /*
    pliny.method({
      parent: "Primrose.Displays.BaseVRDisplay",
      name: "startAnimation",
      description: "Starts and maintains an animation loop.",
      parameters: [{
        name: "callback",
        type: "Function",
        description: "The code to execute during the animation update."
      }]
    });
    */

    if(this._timer === null) {
      this._isAnimating = true;

      const animator = (time) => {
        this._timer = null;
        callback(time);
        this._timer = this.requestAnimationFrame(animator);
      };

      this._timer = this.requestAnimationFrame(animator);
    }
  }

  get isBaseVRDisplay() {
    return true;
  }

  get isAnimating() {
    return this._isAnimating;
  }

  stopAnimation() {

    /*
    pliny.method({
      parent: "Primrose.Displays.BaseVRDisplay",
      name: "stopAnimation",
      description: "Stop any animation loop that is currently running."
    });
    */

    if(this._timer !== null) {
      this.cancelAnimationFrame(this._timer);
      this._timer = null;
      this._isAnimating = false;
    }
  }
};
