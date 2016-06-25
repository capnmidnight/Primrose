Primrose.Input.VR = (function () {
  "use strict";

  const SLERP_A = isMobile ? 0.1 : 0,
    SLERP_B = 1 - SLERP_A,
    tempQuat = [];
  pliny.class({
    parent: "Primrose.Input",
    name: "VR",
    baseClass: "Primrose.InputProcessor",
    parameters: [
      { name: "commands", type: "Array", optional: true, description: "An array of input command descriptions." },
      { name: "socket", type: "WebSocket", optional: true, description: "A socket over which to transmit device state for device fusion." }
    ],
    description: "An input manager for gamepad devices."
  });
  class VR extends Primrose.InputProcessor {
    constructor(avatarHeight, commands, socket) {
      super("VR", commands, socket);

      this.displays = null;
      this._transforms = [];
      this.transforms = null;
      this.currentDisplayIndex = -1;
      this.currentPose = {
        position: [0, 0, 0],
        orientation: [0, 0, 0, 1]
      };
      this.movePlayer = new THREE.Matrix4();
      this.avatarHeight = avatarHeight;

      console.info("Checking for displays...");
      this.ready = navigator.getVRDisplays().then((displays) => {
        console.log("Displays found:", displays.length);
        this.displays = displays;
        return this.displays;
      });
    }

    get toScene(){
      let x = 0, z = 0;
      var stage = this.currentDisplay && this.currentDisplay.stageParameters;
      if(stage){
        this.movePlayer.fromArray(stage.sittingToStandingTransform);
        x = stage.sizeX;
        z = stage.sizeZ;
      }
      else{
        this.movePlayer.makeTranslation(0, this.avatarHeight, 0);
      }
      return {
        matrix: this.movePlayer,
        sizeX: x,
        sizeZ: z
      }
    }

    requestPresent(opts) {
      if (!this.currentDisplay) {
        return Promise.reject("No display");
      }
      else {
        return this.currentDisplay.requestPresent(opts)
          .then((elem) => elem || opts[0].source);
      }
    }

    poll() {
      if (this.currentDisplay) {
        this.currentPose = this.currentDisplay.getPose() || this.currentPose;
      }
    }

    getOrientation(value) {
      value = value || new THREE.Quaternion();
      var o = this.currentPose && this.currentPose.orientation;
      if(o){
        value.toArray(tempQuat);
        for(var i = 0; i < o.length; ++i){
          tempQuat[i] = tempQuat[i] * SLERP_A + o[i] * SLERP_B;
        }
        value.fromArray(tempQuat);
      }
      return value;
    }

    getPosition(value){
      value = value || new THREE.Vector3();
      var p = this.currentPose && this.currentPose.position;
      if(p){
        value.fromArray(p);
      }
      return value;
    }

    resetTransforms(near, far) {
      if (this.currentDisplay) {
        if (!this._transforms[this.currentDisplayIndex]) {
          this._transforms[this.currentDisplayIndex] = new ViewCameraTransform(this.currentDisplay);
        }
        this.transforms = this._transforms[this.currentDisplayIndex].getTransforms(near, far);
      }
    }

    get currentDisplay() {
      return this.displays[this.currentDisplayIndex];
    }

    connect(selectedIndex) {
      this.currentPose = null;
      this.currentDisplayIndex = selectedIndex;
    }
  }

  return VR;
})();

