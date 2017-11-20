/*
pliny.class({
  parent: "Primrose.Displays",
  name: "PolyfilledVRFrameData",
  description: "A polyfill for the WebVR standard PolyfilledVRFrameData object."
});
*/

export default class PolyfilledVRFrameData {
  constructor () {

    /*
    pliny.property({
      parent: "Primrose.Displays.PolyfilledVRFrameData",
      name: "leftProjectionMatrix",
      type: "Float32Array",
      description: "The projection matrix for the left eye."
    });
    */
    this.leftProjectionMatrix = new Float32Array(16);

    /*
    pliny.property({
      parent: "Primrose.Displays.PolyfilledVRFrameData",
      name: "leftViewMatrix",
      type: "Float32Array",
      description: "The projection matrix for the right eye."
    });
    */
    this.leftViewMatrix = new Float32Array(16);

    /*
    pliny.property({
      parent: "Primrose.Displays.PolyfilledVRFrameData",
      name: "rightProjectionMatrix",
      type: "Float32Array",
      description: "The view matrix for the left eye."
    });
    */
    this.rightProjectionMatrix = new Float32Array(16);

    /*
    pliny.property({
      parent: "Primrose.Displays.PolyfilledVRFrameData",
      name: "rightViewMatrix",
      type: "Float32Array",
      description: "The view matrix for the right eye."
    });
    */
    this.rightViewMatrix = new Float32Array(16);

    /*
    pliny.property({
      parent: "Primrose.Displays.PolyfilledVRFrameData",
      name: "pose",
      type: "VRPose",
      description: "VRPose data, instead of using the legacy VRDisplay.prototype.getPose."
    });
    */
    this.pose = null;
  }

  get isPolyfilledVRFrameData() {
    return true;
  }
};
