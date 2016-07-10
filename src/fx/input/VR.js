Primrose.Input.VR = (function () {
  "use strict";

  const DEFAULT_POSE = {
      position: [0, 0, 0],
      orientation: [0, 0, 0, 1]
    },
    tempQuat = [],
    GAZE_LENGTH = 3000;
  pliny.class({
    parent: "Primrose.Input",
      name: "VR",
      baseClass: "Primrose.InputProcessor",
      parameters: [{
        name: "commands",
        type: "Array",
        optional: true,
        description: "An array of input command descriptions."
      }, {
        name: "socket",
        type: "WebSocket",
        optional: true,
        description: "A socket over which to transmit device state for device fusion."
      }],
      description: "An input manager for gamepad devices."
  });
  class VR extends Primrose.InputProcessor {
    constructor(avatarHeight, parent, socket) {
      super("VR", parent, null, socket);

      this.displays = [];
      this._transforms = [];
      this.transforms = null;
      this.currentDisplayIndex = -1;
      this.currentPose = DEFAULT_POSE;
      this.movePlayer = new THREE.Matrix4();
      this.defaultAvatarHeight = avatarHeight;
      this.parentHeading = new THREE.Quaternion();

      console.info("Checking for displays...");
      this.ready = navigator.getVRDisplays()
        .then((displays) => {
          console.log("Displays found:", displays.length);
          this.displays.push.apply(this.displays, displays);
          return this.displays;
        });
    }

    get stageParameters() {
      let x = 0,
        z = 0;
      var stage = this.currentDisplay && this.currentDisplay.stageParameters;
      if (stage) {
        this.movePlayer.fromArray(stage.sittingToStandingTransform);
        x = stage.sizeX;
        z = stage.sizeZ;
      }
      else {
        this.movePlayer.makeTranslation(0, this.defaultAvatarHeight, 0);
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

    cancel() {
      var promise = null;
      if (this.currentDisplayIndex > -1 && this.currentDisplay.isPresenting) {
        promise = this.currentDisplay.exitPresent();
      }
      else {
        promise = Promise.resolve();
      }
      return promise.then(() => {
        this.currentDisplayIndex = -1;
        this.transforms = null;
      });
    }

    zero() {
      super.zero();
      if (this.currentDisplay) {
        this.currentDisplay.resetPose();
      }
    }

    get showPointer() {
      return super.showPointer && this.hasOrientation;
    }

    set showPointer(v) {
      super.showPointer = v;
    }

    updatePointer(dt) {
      if (this.currentDisplay) {
        this.currentPose = this.currentDisplay.getPose() || this.currentPose;
      }
      super.updatePointer(dt);
      if(this.parent.mesh){
        this.parent.mesh.applyMatrix(this.stage.matrix);
      }
    }

    updateOrientation(excludePitch) {
      var o = this.currentPose && this.currentPose.orientation;
      if (o) {
        this.quaternion.copy(o);
      }

      if(this.parent.mesh){
        this.parent.euler.toArray(tempQuat);
        tempQuat[2] = 0;
        if (this.inVR) {
          tempQuat[0] = 0;
          var da = tempQuat[1] - this.euler.y;
          tempQuat[1] = this.euler.y;
          if (Math.abs(da) > this.rotationAngle) {
            tempQuat[1] += Math.sign(da) * this.rotationAngle;
          }
        }
        this.euler.fromArray(tempQuat);
        this.parentHeading.setFromEuler(this.euler);
        this.quaternion.multiply(this.parentHeading);
      }
    }

    updatePosition() {
      var p = this.currentPose && this.currentPose.position;
      if (p) {
        this.position.fromArray(p);
      }
      if(this.parent.mesh){
        this.position.applyQuaternion(this.parentHeading);
        this.position.x += this.parent.position.x;
        this.position.z += this.parent.position.z;
      }
    }

    updateVelocity() {

    }

    resolvePicking(currentHits, lastHits, objects) {
      super.resolvePicking(currentHits, lastHits, objects);

      var currentHit = currentHits.VR,
        lastHit = lastHits && lastHits.VR,
        dt, lt;
      if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
        currentHit.startTime = lastHit.startTime;
        currentHit.gazeFired = lastHit.gazeFired;
        dt = lt - currentHit.startTime;
        if (dt >= GAZE_LENGTH && !currentHit.gazeFired) {
          currentHit.gazeFired = true;
          emit.call(this, "gazecomplete", currentHit);
          emit.call(this.pickableObjects[currentHit.objectID], "click", "Gaze");
        }
      }
      else {
        if (lastHit) {
          dt = lt - lastHit.startTime;
          if (dt < GAZE_LENGTH) {
            emit.call(this, "gazecancel", lastHit);
          }
        }
        if (currentHit) {
          currentHit.startTime = lt;
          currentHit.gazeFired = false;
          emit.call(this, "gazestart", currentHit);
        }
      }

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
      return 0 <= this.currentDisplayIndex &&
        this.currentDisplayIndex < this.displays.length &&
        this.displays[this.currentDisplayIndex];
    }

    get isPresenting() {
      return this.currentDisplay && this.currentDisplay.isPresenting;
    }

    get hasOrientation() {
      return this.currentDisplay && this.currentDisplay.capabilities.hasOrientation;
    }

    connect(selectedIndex) {
      this.currentPose = selectedIndex === 0 ? DEFAULT_POSE : null;
      this.currentDisplayIndex = selectedIndex;
      if (0 <= selectedIndex && selectedIndex <= this.displays.length) {
        var params = this.currentDisplay.getEyeParameters("left")
          .fieldOfView;
        this.rotationAngle = Math.PI * (params.leftDegrees + params.rightDegrees) / 360;
      }
    }
  }

  return VR;
})();