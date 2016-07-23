Primrose.Input.VR = (function () {
  "use strict";

  const DEFAULT_POSE = {
      position: [0, 0, 0],
      orientation: [0, 0, 0, 1]
    },
    eulerParts = [],
    swapQuaternion = new THREE.Quaternion(),
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
      this._transformers = [];
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
        console.log("requesting", opts);
        var layers = opts;
        if(window.VRDisplay && isChrome && isMobile && this.currentDisplay instanceof VRDisplay && opts instanceof Array){
          layers = layers[0];
        }
        return this.currentDisplay.requestPresent(layers)
          .catch((exp)=>console.error("what happened?", exp))
          .then((elem) => elem || opts[0].source);
      }
    }

    cancel() {
      var promise = null;
      if (this.isPresenting) {
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
      if (this.parent.mesh) {
        this.parent.mesh.applyMatrix(this.stage.matrix);
      }
    }

    updateOrientation(excludePitch) {
      var o = this.currentPose && this.currentPose.orientation;
      if (o) {
        this.quaternion.fromArray(o);
      }
      else{
        this.quaternion.set(0, 0, 0, 1);
      }

      if (this.parent.mesh) {
        this.parent.euler.toArray(eulerParts);
        eulerParts[2] = 0;
        if (this.inVR) {
          eulerParts[0] = 0;
          var da = eulerParts[1] - this.euler.y;
          eulerParts[1] = this.euler.y;
          if (Math.abs(da) > this.rotationAngle) {
            eulerParts[1] += Math.sign(da) * this.rotationAngle;
          }
        }
        this.euler.fromArray(eulerParts);
        this.parentHeading.setFromEuler(this.euler);
        swapQuaternion.copy(this.quaternion);
        this.quaternion.copy(this.parentHeading)
          .multiply(swapQuaternion);
      }
    }

    updatePosition() {
      var p = this.currentPose && this.currentPose.position;
      if (p) {
        this.position.fromArray(p);
      }
      else{
        this.position.set(0, 0, 0);
      }

      if (this.parent.mesh) {
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

    getTransforms(near, far) {
      if (this.currentDisplay) {
        if (!this._transformers[this.currentDisplayIndex]) {
          this._transformers[this.currentDisplayIndex] = new ViewCameraTransform(this.currentDisplay);
        }
        return this._transformers[this.currentDisplayIndex].getTransforms(near, far);
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
        var params = this.currentDisplay.getEyeParameters("left"),
          fov = params.fieldOfView;
        this.rotationAngle = Math.PI * (fov.leftDegrees + fov.rightDegrees) / 360;
      }
    }
  }


  return VR;
})();