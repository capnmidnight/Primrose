Primrose.Input.VR = (function () {
  "use strict";

  const DEFAULT_POSE = {
      position: [0, 0, 0],
      orientation: [0, 0, 0, 1]
    },
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
      this.stage = null;

      console.info("Checking for displays...");
      this.ready = navigator.getVRDisplays()
        .then((displays) => {
          console.log("Displays found:", displays.length);
          this.displays.push.apply(this.displays, displays);
          return this.displays;
        });
    }

    get hasStage(){
      return this.stage && this.stage.sizeX * this.stage.sizeZ > 0;
    }

    updateStage() {
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

      var s = {
        matrix: this.movePlayer,
        sizeX: x,
        sizeZ: z
      };

      if (!this.stage || s.sizeX !== this.stage.sizeX || s.sizeZ !== this.stage.sizeZ) {
        this.stage = s;
        if (this.stage.sizeX * this.stage.sizeZ === 0) {
          this.groundMesh = this.disk;
          this.stageGrid.visible = false;
          this.disk.visible = this.hasOrientation;
        }
        else {
          var scene = this.stageGrid.parent;
          scene.remove(this.stageGrid);
          this.stageGrid = textured(box(this.stage.sizeX, 2.5, this.stage.sizeZ), 0x00ff00, {
            wireframe: true,
            emissive: 0x003f00
          });
          this.stageGrid.geometry.computeBoundingBox();
          scene.add(this.stageGrid);
          this.groundMesh = this.stageGrid;
          this.stageGrid.visible = this.hasOrientation;
          this.disk.visible = false;
        }
      }

      this.mesh.updateMatrix();
      this.mesh.applyMatrix(this.stage.matrix);
    }

    requestPresent(opts) {
      if (!this.currentDisplay) {
        return Promise.reject("No display");
      }
      else {
        let layers = opts;
        if (!(layers instanceof Array)) {
          layers = [layers];
        }

        if (!this.currentDisplay.isPolyfilled && isChrome && isMobile) {
          layers = layers[0];
        }
        return this.currentDisplay.requestPresent(layers)
          .catch((exp) => console.error("what happened?", exp))
          .then((elem) => elem || opts[0].source)
          .then(PointerLock.request);
      }
    }

    cancel(){
      let promise = null;
      if (this.isPresenting) {
        promise = this.currentDisplay.exitPresent();
      }
      else {
        promise = Promise.resolve();
      }
      return promise
        .then(PointerLock.exit)
        .then(() => this.connect(0));
    }

    zero() {
      super.zero();
      if (this.currentDisplay) {
        this.currentDisplay.resetPose();
      }
    }

    update(dt) {
      super.update(dt);

      if (this.currentDisplay) {
        this.currentPose = this.currentDisplay.getPose() || this.currentPose;
        this.inPhysicalUse = this.isPresenting && !!this.currentPose;
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

    get isPolyfilled(){
      return this.currentDisplay && this.currentDisplay.isPolyfilled;
    }

    get isPresenting() {
      return this.currentDisplay && this.currentDisplay.isPresenting;
    }

    get hasOrientation() {
      return this.currentDisplay && this.currentDisplay.capabilities.hasOrientation;
    }

    get currentCanvas(){
      return this.isPresenting && this.currentDisplay.getLayers()[0].source;
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