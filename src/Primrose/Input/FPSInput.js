"use strict";

const DISPLACEMENT = new THREE.Vector3(),
  EULER_TEMP = new THREE.Euler(),
  WEDGE = Math.PI / 3;

pliny.class({
  parent: "Primrose.Input",
    name: "FPSInput",
    description: "| [under construction]"
});
class FPSInput {
  constructor(DOMElement, options) {
    DOMElement = DOMElement || window;
    this.options = options;
    this.listeners = {
      zero: [],
      motioncontroller: [],
      gamepad: []
    };

    this.managers = [];
    this.newState = [];
    this.pointers = [];
    this.motionDevices = [];
    this.velocity = new THREE.Vector3();
    this.matrix = new THREE.Matrix4();

    const keyUp = (evt) => this.currentControl && this.currentControl.keyUp && this.currentControl.keyUp(evt);
    const keyDown = (evt) => this.Keyboard.doTyping(this.currentControl && this.currentControl.focusedElement, evt);

    this.add(new Primrose.Input.Keyboard(this, null, {
      strafeLeft: {
        buttons: [-Primrose.Keys.A, -Primrose.Keys.LEFTARROW]
      },
      strafeRight: {
        buttons: [
          Primrose.Keys.D,
          Primrose.Keys.RIGHTARROW
        ]
      },
      strafe: {
        commands: ["strafeLeft", "strafeRight"]
      },
      boost: {
        buttons: [Primrose.Keys.E],
        scale: 0.2
      },
      driveForward: {
        buttons: [-Primrose.Keys.W, -Primrose.Keys.UPARROW]
      },
      driveBack: {
        buttons: [
          Primrose.Keys.S,
          Primrose.Keys.DOWNARROW
        ]
      },
      drive: {
        commands: ["driveForward", "driveBack"]
      },
      select: {
        buttons: [Primrose.Keys.ENTER]
      },
      dSelect: {
        buttons: [Primrose.Keys.ENTER],
        delta: true
      },
      zero: {
        buttons: [Primrose.Keys.Z],
        metaKeys: [-Primrose.Keys.CTRL, -Primrose.Keys.ALT, -Primrose.Keys.SHIFT, -Primrose.Keys.META],
        commandUp: emit.bind(this, "zero")
      }
    }));

    this.Keyboard.addEventListener("keydown", keyDown);
    this.Keyboard.addEventListener("keyup", keyUp);

    this.add(new Primrose.Input.Touch(DOMElement, this.Keyboard, {
      buttons: {
        axes: [Primrose.Input.Touch.FINGERS]
      },
      dButtons: {
        axes: [Primrose.Input.Touch.FINGERS],
        delta: true
      },
      dx: {
        axes: [-Primrose.Input.Touch.X0],
        delta: true,
        scale: 0.005,
        min: -5,
        max: 5
      },
      heading: {
        commands: ["dx"],
        integrate: true
      },
      dy: {
        axes: [-Primrose.Input.Touch.Y0],
        delta: true,
        scale: 0.005,
        min: -5,
        max: 5
      },
      pitch: {
        commands: ["dy"],
        integrate: true,
        min: -Math.PI * 0.5,
        max: Math.PI * 0.5
      }
    }));

    this.add(new Primrose.Input.Mouse(DOMElement, this.Keyboard, {
      buttons: {
        axes: [Primrose.Input.Mouse.BUTTONS]
      },
      dButtons: {
        axes: [Primrose.Input.Mouse.BUTTONS],
        delta: true
      },
      dx: {
        axes: [-Primrose.Input.Mouse.X],
        delta: true,
        scale: 0.005,
        min: -5,
        max: 5
      },
      heading: {
        commands: ["dx"],
        integrate: true
      },
      dy: {
        axes: [-Primrose.Input.Mouse.Y],
        delta: true,
        scale: 0.005,
        min: -5,
        max: 5
      },
      pitch: {
        commands: ["dy"],
        integrate: true,
        min: -Math.PI * 0.5,
        max: Math.PI * 0.5
      },
      pointerPitch: {
        commands: ["dy"],
        integrate: true,
        min: -Math.PI * 0.25,
        max: Math.PI * 0.25
      }
    }));

    this.add(new Primrose.Input.VR(this.options.avatarHeight, isMobile ? this.Touch : this.Mouse));

    this.motionDevices.push(this.VR);

    Primrose.Input.Gamepad.addEventListener("gamepadconnected", (pad) => {
      var padID = Primrose.Input.Gamepad.ID(pad),
        isMotion = padID.indexOf("Vive") === 0,
        padCommands = null,
        controllerNumber = 0;

      if (padID !== "Unknown" && padID !== "Rift") {
        if (isMotion) {
          padCommands = {
            buttons: {
              axes: [Primrose.Input.Gamepad.BUTTONS]
            },
            dButtons: {
              axes: [Primrose.Input.Gamepad.BUTTONS],
              delta: true
            },
            zero: {
              buttons: [Primrose.Input.Gamepad.VIVE_BUTTONS.GRIP_PRESSED],
              commandUp: emit.bind(this, "zero")
            }
          };

          for (var i = 0; i < this.managers.length; ++i) {
            var mgr = this.managers[i];
            if (mgr.currentPad && mgr.currentPad.id === pad.id) {
              ++controllerNumber;
            }
          }
        }
        else {
          padCommands = {
            buttons: {
              axes: [Primrose.Input.Gamepad.BUTTONS]
            },
            dButtons: {
              axes: [Primrose.Input.Gamepad.BUTTONS],
              delta: true
            },
            strafe: {
              axes: [Primrose.Input.Gamepad.LSX],
              deadzone: 0.2
            },
            drive: {
              axes: [Primrose.Input.Gamepad.LSY],
              deadzone: 0.2
            },
            heading: {
              axes: [-Primrose.Input.Gamepad.RSX],
              deadzone: 0.2,
              integrate: true
            },
            dHeading: {
              commands: ["heading"],
              delta: true
            },
            pitch: {
              axes: [-Primrose.Input.Gamepad.RSY],
              deadzone: 0.2,
              integrate: true
            },
            zero: {
              buttons: [Primrose.Input.Gamepad.XBOX_ONE_BUTTONS.BACK],
              commandUp: emit.bind(this, "zero")
            }
          };
        }

        var mgr = new Primrose.Input.Gamepad(pad, controllerNumber, padCommands);
        this.add(mgr);

        if (isMotion) {
          mgr.parent = this.VR;
          this.motionDevices.push(mgr);

          var shift = (this.motionDevices.length - 2) * 8,
            ptr = new Primrose.Pointer(padID + "Pointer", 0x0000ff << shift, 0x00007f << shift, true, mgr);
          this.pointers.push(ptr);
          ptr.addToBrowserEnvironment(null, this.options.scene);
          ptr.addEventListener("teleport", (evt) => this.moveStage(evt.position));
        }
        else {
          this.Keyboard.parent = mgr;
        }
      }
    });

    Primrose.Input.Gamepad.addEventListener("gamepaddisconnected", this.remove.bind(this));

    this.stage = new THREE.Object3D();

    this.mousePointer = new Primrose.Pointer("MousePointer", 0xff0000, 0x7f0000, false, this.Mouse, this.VR);
    this.pointers.push(this.mousePointer);
    this.mousePointer.addToBrowserEnvironment(null, this.options.scene);

    this.head = new Primrose.Pointer("GazePointer", 0xffff00, 0x7f7f00, false, this.VR);
    this.pointers.push(this.head);
    this.head.addToBrowserEnvironment(null, this.options.scene);

    this.pointers.forEach((ptr) => ptr.addEventListener("teleport", (evt) => this.moveStage(evt.position)));

    this.ready = Promise.all(this.managers
      .map((mgr) => mgr.ready)
      .filter(identity));
  }

  remove(id) {
    var mgr = this[id],
      mgrIdx = this.managers.indexOf(mgr);
    if (mgrIdx > -1) {
      this.managers.splice(mgrIdx, 1);
      delete this[id];
    }
    console.log("removed", mgr);
  }

  add(mgr) {
    for (var i = this.managers.length - 1; i >= 0; --i) {
      if (this.managers[i].name === mgr.name) {
        this.managers.splice(i, 1);
      }
    }
    this.managers.push(mgr);
    this[mgr.name] = mgr;
  }

  zero() {
    for (var i = 0; i < this.managers.length; ++i) {
      this.managers[i].zero();
    }
  }

  get hasMotionControllers() {
    return !!(this.Vive_0 && this.Vive_0.enabled && this.Vive_0.inPhysicalUse ||
      this.Vive_1 && this.Vive_1.enabled && this.Vive_1.inPhysicalUse);
  }

  get hasGamepad() {
    return !!(this.Gamepad_0 && this.Gamepad_0.enabled && this.Gamepad_0.inPhysicalUse);
  }

  get hasMouse() {
    return !!(this.Mouse && this.Mouse.enabled && this.Mouse.inPhysicalUse);
  }

  get hasTouch() {
    return !!(this.Touch && this.Touch.enabled && this.Touch.inPhysicalUse);
  }

  submitFrame() {
    this.VR.submitFrame();
  }

  update(dt) {
    this.Keyboard.enabled = this.Touch.enabled = this.Mouse.enabled = !this.hasMotionControllers;
    if (this.Gamepad_0) {
      this.Gamepad_0.enabled = !this.hasMotionControllers;
    }

    var hadGamepad = this.hasGamepad;
    Primrose.Input.Gamepad.poll();
    for (var i = 0; i < this.managers.length; ++i) {
      this.managers[i].update(dt);
    }
    if (!hadGamepad && this.hasGamepad) {
      this.Mouse.inPhysicalUse = false;
    }

    this.updateStage(dt);

    // update the motionDevices
    this.stage.updateMatrix();
    this.matrix.multiplyMatrices(this.stage.matrix, this.VR.stage.matrix);
    for (var i = 0; i < this.motionDevices.length; ++i) {
      this.motionDevices[i].updateStage(this.matrix);
    }

    for (var i = 0; i < this.pointers.length; ++i) {
      this.pointers[i].update();
    }

    if (this.VR.hasOrientation) {
      this.mousePointer.showPointer = (this.hasMouse || this.hasGamepad) && !(this.hasTouch || this.hasMotionControllers);
      this.head.showPointer = !(this.mousePointer.showPointer || this.hasMotionControllers);
    }
    else {
      // if we're not using an HMD, then update the view according to the mouse
      this.head.quaternion.copy(this.mousePointer.quaternion);
      this.head.showPointer = false;
      this.mousePointer.showPointer = true;
    }

    // record the position and orientation of the user
    this.newState = [];
    this.head.updateMatrix();
    this.stage.updateMatrix();
    this.head.position.toArray(this.newState, 0);
    this.stage.quaternion.toArray(this.newState, 3);
    this.head.quaternion.toArray(this.newState, 7);
  }

  updateStage(dt) {
    // get the linear movement from the mouse/keyboard/gamepad
    var heading = 0,
      strafe = 0,
      drive = 0;
    for (var i = 0; i < this.managers.length; ++i) {
      var mgr = this.managers[i];
      heading += mgr.getValue("heading");
      strafe += mgr.getValue("strafe");
      drive += mgr.getValue("drive");
    }

    // move stage according to heading and thrust
    if (this.VR.hasOrientation) {
      heading = WEDGE * Math.floor((heading / WEDGE) + 0.5);
    }

    EULER_TEMP.set(0, heading, 0, "YXZ");
    this.stage.quaternion.setFromEuler(EULER_TEMP);

    // update the stage's velocity
    this.velocity.x = strafe;
    this.velocity.z = drive;

    if (!this.stage.isOnGround) {
      this.velocity.y -= this.options.gravity * dt;
      if (this.stage.position.y < 0) {
        this.velocity.y = 0;
        this.stage.position.y = 0;
        this.stage.isOnGround = true;
      }
    }

    this.moveStage(DISPLACEMENT
      .copy(this.velocity)
      .multiplyScalar(dt)
      .applyQuaternion(this.stage.quaternion)
      .add(this.head.position));
  }

  moveStage(position) {
    DISPLACEMENT.copy(position)
      .sub(this.head.position);
    this.stage.position.x += DISPLACEMENT.x;
    this.stage.position.z += DISPLACEMENT.z;
  }

  get segments() {
    var segments = [];
    for (var i = 0; i < this.pointers.length; ++i) {
      var seg = this.pointers[i].segment;
      if (seg) {
        segments.push(seg);
      }
    }
    return segments;
  }

  get lockMovement() {
    for (var i = 0; i < this.pointers.length; ++i) {
      var ptr = this.pointers[i];
      if (ptr.lockMovement) {
        return true;
      }
    }

    return false;
  }

  get currentControl() {
    for (var i = 0; i < this.pointers.length; ++i) {
      var ptr = this.pointers[i];
      if (ptr.currentControl) {
        return ptr.currentControl;
      }
    }
  }

  resolvePicking(currentHits, lastHits, pickableObjects) {
    for (var i = 0; i < this.pointers.length; ++i) {
      this.pointers[i].resolvePicking(currentHits, lastHits, pickableObjects);
    }
  }

  addEventListener(evt, thunk, bubbles) {
    if (this.listeners[evt]) {
      this.listeners[evt].push(thunk);
    }
    else {
      for (var i = 0; i < this.managers.length; ++i) {
        this.managers[i].addEventListener(evt, thunk, bubbles);
      }
    }
  }
}