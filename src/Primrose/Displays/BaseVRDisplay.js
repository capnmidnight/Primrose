import pliny from "pliny/pliny";

pliny.class({
  parent: "Primrose.Displays",
  name: "BaseVRDisplay",
  description: "The base class from which all *VRDisplay types inherit, providing additional functionality over the WebVR API standard VRDisplay."
});

export default class BaseVRDisplay {

  startAnimation(callback) {
    this.timer = this.requestAnimationFrame(callback);

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
  }

  stopAnimation() {
    this.cancelAnimationFrame(this.timer);

    pliny.method({
      parent: "Primrose.Displays.BaseVRDisplay",
      name: "stopAnimation",
      description: "Stop any animation loop that is currently running."
    });
  }
};
