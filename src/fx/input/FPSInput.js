Primrose.Input.FPSInput = (function () {
  "use strict";

  const VELOCITY = new THREE.Vector3(),
    swapQuaternion = new THREE.Quaternion(),
    euler = new THREE.Euler(),
    eulerParts = [],
    CARRY_OVER = new THREE.Vector3(),
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
      this.motionDevices = [];

      this.add(new Primrose.Input.Keyboard(null, {
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
          mgr.addEventListener("teleport", (evt) => this.moveStage(evt));

          if (isMotion) {
            mgr.parent = this.VR;
            mgr.makePointer(this.options.scene, 0x0000ff, 0x00007f, true);
            this.motionDevices.push(mgr);
          }
          else {
            this.Keyboard.parent = mgr;
          }
        }
      });

      Primrose.Input.Gamepad.addEventListener("gamepaddisconnected", this.remove.bind(this));

      this.stage = isMobile ? this.Touch : this.Mouse;
      this.stage.makePointer(this.options.scene, 0xff0000, 0x7f0000);

      this.head = this.VR;
      this.head.makePointer(this.options.scene, 0x00ff00, 0x007f00);

      this.managers.forEach((mgr) => mgr.addEventListener("teleport", (position) => this.moveStage(position)));

      this.ready = Promise.all(this.managers
        .map((mgr) => mgr.ready)
        .filter(identity));
    }

    moveStage(evt) {
      CARRY_OVER.x += evt.position.x - this.head.position.x;
      CARRY_OVER.z += evt.position.z - this.head.position.z;
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

    update(dt) {
      Primrose.Input.Gamepad.poll();
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        mgr.update(dt);
      }

      var status = this.managers
        .filter((mgr) => mgr.inPhysicalUse)
        .map((mgr) => mgr.name)
        .join(", ");
      if (status !== this.lastStatus) {
        console.log(status);
        this.lastStatus = status;
      }

      // get the linear movement from the mouse/keyboard/gamepad
      var head = this.stage,
        pitch = 0,
        heading = 0,
        dx = 0,
        dz = 0;
      while (head) {
        pitch += head.getValue("pitch");
        heading += head.getValue("heading");
        dx += head.getValue("strafe");
        dz += head.getValue("drive");
        head = head.parent;
      }

      // move stage according to heading and thrust
      this.stage.position.copy(CARRY_OVER);
      euler.set(0, heading, 0, "YXZ");
      this.stage.quaternion.setFromEuler(euler);
      this.stage.velocity.x = dx;
      this.stage.velocity.z = dz;
      if (!this.stage.isOnGround) {
        this.stage.velocity.y -= this.options.gravity * dt;
        if (this.stage.position.y < 0) {
          this.stage.velocity.y = 0;
          this.stage.position.y = 0;
          this.stage.isOnGround = true;
        }
      }

      this.stage.position.add(VELOCITY
        .copy(this.stage.velocity)
        .multiplyScalar(dt)
        .applyQuaternion(this.stage.quaternion));

      // figure out the stage orientation.
      if (this.VR.hasOrientation) {
        var newHeading = WEDGE * Math.floor((heading / WEDGE) + 0.5);
        euler.set(0, newHeading, 0, "YXZ");
        swapQuaternion.setFromEuler(euler);
      }
      else {
        swapQuaternion.copy(this.stage.quaternion);
      }


      // update the pointers
      for (const mgr of this.motionDevices) {
        this.updateMotionObject(mgr, swapQuaternion);
      }

      // record the position on the ground of the user
      this.newState = [];
      this.stage.position.toArray(this.newState, 0);
      this.stage.quaternion.toArray(this.newState, 3);

      // move the mouse pointer into place
      euler.set(pitch, heading, 0, "YXZ");
      this.stage.quaternion.setFromEuler(euler);
      CARRY_OVER.copy(this.stage.position);
      this.stage.position.copy(this.head.position);

      // if we're not using an HMD, then update the view according to the mouse
      if (this.VR.hasOrientation) {
        this.stage.showPointer = this.Mouse.inPhysicalUse && !this.Touch.inPhysicalUse;
        this.head.showPointer = !this.stage.showPointer;
      }
      else {
        this.head.quaternion.copy(this.stage.quaternion)
          .multiply(this.head.poseQuaternion);
        this.head.showPointer = false;
        this.stage.showPointer = true;
      }

      // record the position of the head of the user
      this.head.position.toArray(this.newState, 7);
      this.head.quaternion.toArray(this.newState, 10);
    }

    updateMotionObject(mgr, stageQuat) {
      // move the pointer onto the stage
      mgr.quaternion
        .copy(stageQuat)
        .multiply(mgr.poseQuaternion);

      mgr.position.copy(mgr.posePosition)
        .applyQuaternion(stageQuat)
        .add(this.stage.position);

      // adjust for the player's height
      mgr.updateMatrix();
      mgr.applyMatrix(this.VR.stage.matrix);
    }

    get segments() {
      var segments = [];
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        if (mgr.enabled) {
          var seg = mgr.segment;
          if (seg) {
            segments.push(seg);
          }
        }
      }
      return segments;
    }

    get lockMovement() {
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        if (mgr.lockMovement) {
          return true;
        }
      }

      return false;
    }

    resolvePicking(currentHits, lastHits, pickableObjects) {
      for (const mgr of this.managers) {
        mgr.resolvePicking(currentHits, lastHits, pickableObjects);
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

  return FPSInput;
})();