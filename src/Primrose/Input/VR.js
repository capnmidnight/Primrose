const DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  },
  GAZE_LENGTH = 3000;
pliny.class({
  parent: "Primrose.Input",
    name: "VR",
    baseClass: "Primrose.PoseInputProcessor",
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
class VR extends Primrose.PoseInputProcessor {
  constructor(avatarHeight, parent, socket) {
    super("VR", parent, null, socket);

    this.displays = [];
    this._transformers = [];
    this.currentDeviceIndex = -1;
    this.movePlayer = new THREE.Matrix4();
    this.defaultAvatarHeight = avatarHeight;
    this.stage = null;
    this.lastStageWidth = null;
    this.lastStageDepth = null;

    console.info("Checking for displays...");
    this.ready = navigator.getVRDisplays()
      .then((displays) => {
        console.log("Displays found:", displays.length);
        this.displays.push.apply(this.displays, displays);
        return this.displays;
      });
  }

  get isNativeMobileWebVR() {
    return !(this.currentDevice && this.currentDevice.isPolyfilled) && isChrome && isMobile;
  }

  connect(selectedIndex) {
    this.currentDevice = null;
    this.currentDeviceIndex = selectedIndex;
    this.currentPose = null;
    if (0 <= selectedIndex && selectedIndex <= this.displays.length) {
      this.currentDevice = this.displays[selectedIndex];
      this.currentPose = this.currentDevice.getPose();
      var params = this.currentDevice.getEyeParameters("left"),
        fov = params.fieldOfView;
      this.rotationAngle = Math.PI * (fov.leftDegrees + fov.rightDegrees) / 360;
    }
  }

  requestPresent(opts) {
    if (!this.currentDevice) {
      return Promise.reject("No display");
    }
    else {
      let layers = opts;
      if (!(layers instanceof Array)) {
        layers = [layers];
      }

      if (this.isNativeMobileWebVR) {
        layers = layers[0];
      }

      var elem = opts[0].source,
        promise = FullScreen.request(elem)
        .catch((exp) => console.warn("FullScreen", exp))
        .then(() => PointerLock.request(elem))
        .catch((exp) => console.warn("PointerLock", exp))
        .then(() => this.currentDevice.requestPresent(layers))
        .catch((exp) => console.warn("requstPresent", exp));

      if (this.isNativeMobileWebVR) {
        promise = promise.then(Orientation.lock)
          .catch((exp) => console.warn("OrientationLock", exp));
      }

      return promise;
    }
  }

  cancel() {
    let promise = null;
    if (this.isPresenting) {
      promise = this.currentDevice.exitPresent();
      this.currentDevice = null;
      this.currentDeviceIndex = -1;
      this.currentPose = null;
    }
    else {
      promise = Promise.resolve();
    }

    if (this.isNativeMobileWebVR) {
      promise = promise.then(Orientation.unlock);
    }

    return promise
      .then(PointerLock.exit)
      .then(() => this.connect(0));
  }

  zero() {
    super.zero();
    if (this.currentDevice) {
      this.currentDevice.resetPose();
    }
  }

  update(dt) {
    super.update(dt);

    let x = 0,
      z = 0,
      stage = null;

    if (this.currentDevice) {
      this.currentPose = this.currentDevice.getPose();
      stage = this.currentDevice.stageParameters;
    }

    if (stage) {
      this.movePlayer.fromArray(stage.sittingToStandingTransform);
      x = stage.sizeX;
      z = stage.sizeZ;
    }
    else {
      this.movePlayer.makeTranslation(0, this.defaultAvatarHeight, 0);
    }

    var s = {
      matrix: this.movePlayer,
      sizeX: x,
      sizeZ: z
    };

    if (!this.stage || s.sizeX !== this.stage.sizeX || s.sizeZ !== this.stage.sizeZ) {
      this.stage = s;
    }
  }

  get hasStage() {
    return this.stage && this.stage.sizeX * this.stage.sizeZ > 0;
  }

  submitFrame() {
    if (this.currentDevice) {
      this.currentDevice.submitFrame(this.currentPose);
    }
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
    if (this.currentDevice) {
      if (!this._transformers[this.currentDeviceIndex]) {
        this._transformers[this.currentDeviceIndex] = new ViewCameraTransform(this.currentDevice);
      }
      return this._transformers[this.currentDeviceIndex].getTransforms(near, far);
    }
  }

  get canMirror() {
    return this.currentDevice && this.currentDevice.capabilities.hasExternalDisplay;
  }

  get isPolyfilled() {
    return this.currentDevice && this.currentDevice.isPolyfilled;
  }

  get isPresenting() {
    return this.currentDevice && this.currentDevice.isPresenting;
  }

  get hasOrientation() {
    return this.currentDevice && this.currentDevice.capabilities.hasOrientation;
  }

  get currentCanvas() {
    return this.isPresenting && this.currentDevice.getLayers()[0].source;
  }
}