const DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  },
  GAZE_LENGTH = 3000,

  _ = priv();

pliny.class({
  parent: "Primrose.Input",
    name: "VR",
    baseClass: "Primrose.PoseInputProcessor",
    parameters: [{
      name: "avatarHeight",
      type: "Number",
      description: "The default height to use for the user, if the HMD doesn't provide a stage transform."
    }],
    description: "An input manager for gamepad devices."
});
class VR extends Primrose.PoseInputProcessor {

  static isStereoDisplay(display) {
    const leftParams = display.getEyeParameters("left"),
        rightParams = display.getEyeParameters("right");
    return !!(leftParams && rightParams);
  }

  constructor(avatarHeight) {
    super("VR");

    _(this, {
      requestPresent: (layers) => this.currentDevice.requestPresent(layers)
          .catch((exp) => console.warn("requstPresent", exp))
    });

    this.displays = [];
    this._transformers = [];
    this.currentDeviceIndex = -1;
    this.movePlayer = new THREE.Matrix4();
    this.defaultAvatarHeight = avatarHeight;
    this.stage = null;
    this.lastStageWidth = null;
    this.lastStageDepth = null;
    this.isStereo = false;
    this.ready = navigator.getVRDisplays()
      .then((displays) => {
        // We skip the WebVR-Polyfill's Mouse and Keyboard display because it does not
        // play well with our interaction model.
        this.displays.push.apply(this.displays, displays.filter((display) => display.displayName !== "Mouse and Keyboard VRDisplay (webvr-polyfill)"));
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
      var leftParams = this.currentDevice.getEyeParameters("left"),
        fov = leftParams.fieldOfView;
      this.rotationAngle = Math.PI * (fov.leftDegrees + fov.rightDegrees) / 360;
      this.isStereo = VR.isStereoDisplay(this.currentDevice);
    }
  }

  requestPresent(opts) {
    if (!this.currentDevice) {
      return Promise.reject("No display");
    }
    else {
      let layers = opts,
        elem = opts[0].source;

      if (!(layers instanceof Array)) {
        layers = [layers];
      }

      // A hack to deal with a bug in the current build of Chromium
      if (this.isNativeMobileWebVR) {
        layers = layers[0];
      }

      var promise = null,
        rp = _(this).requestPresent;

      // If we're using WebVR-Polyfill, just let it do its job.
      if(this.currentDevice.isPolyfilled) {
        // for Firefox's sake, this can't be done in a Promise.
        promise = rp(layers);
      }
      else{
        // PCs with HMD should also make the browser window on the main
        // display full-screen, so we can then also lock pointer.
        promise = WebVRStandardMonitor.standardFullScreenBehavior(elem)
          .then(() => rp(layers));
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

    var x, z, stage;

    if (this.currentDevice) {
      this.currentPose = this.currentDevice.getPose();
      stage = this.currentDevice.stageParameters;
    }
    else{
      stage = null;
    }

    if (stage) {
      this.movePlayer.fromArray(stage.sittingToStandingTransform);
      x = stage.sizeX;
      z = stage.sizeZ;
    }
    else {
      this.movePlayer.makeTranslation(0, this.defaultAvatarHeight, 0);
      x = 0;
      z = 0;
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
      this.currentDevice.depthNear = near;
      this.currentDevice.depthFar = far;
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
    if(this.isPresenting) {
      var layers = this.currentDevice.getLayers();
      if(layers.length > 0){
        return layers[0].source;
      }
    }
    return null;
  }
}