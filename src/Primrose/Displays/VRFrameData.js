import pliny from "pliny/pliny";

pliny.class({
  parent: "Primrose.Displays",
  name: "VRFrameData",
  description: "A polyfill for the WebVR standard VRFrameData object."
});

export default class VRFrameData {
  constructor () {

    pliny.property({
      parent: "Primrose.Displays.VRFrameData",
      name: "leftProjectionMatrix",
      type: "Float32Array",
      description: "The projection matrix for the left eye."
    });
    this.leftProjectionMatrix = new Float32Array(16);

    pliny.property({
      parent: "Primrose.Displays.VRFrameData",
      name: "rightProjectionMatrix",
      type: "Float32Array",
      description: "The projection matrix for the right eye."
    });
    this.leftViewMatrix = new Float32Array(16);

    pliny.property({
      parent: "Primrose.Displays.VRFrameData",
      name: "leftViewMatrix",
      type: "Float32Array",
      description: "The view matrix for the left eye."
    });
    this.rightProjectionMatrix = new Float32Array(16);

    pliny.property({
      parent: "Primrose.Displays.VRFrameData",
      name: "rightViewMatrix",
      type: "Float32Array",
      description: "The view matrix for the right eye."
    });
    this.rightViewMatrix = new Float32Array(16);

    pliny.property({
      parent: "Primrose.Displays.VRFrameData",
      name: "pose",
      type: "VRPose",
      description: "Legacy VRPose data."
    });
    this.pose = null;
  }
};
