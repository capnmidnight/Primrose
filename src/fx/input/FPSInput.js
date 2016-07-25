Primrose.Input.FPSInput = (function () {
  "use strict";

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

      Primrose.Input.Gamepad.addEventListener("gamepadconnected", (pad) => {
        var padID = Primrose.Input.Gamepad.ID(pad),
          isMotion = padID === "OpenVR Gamepad",
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
          this.add(mgr)
          ;mgr.addEventListener("teleport", (position) => this.moveStage(position));

          if (isMotion) {
            mgr.parent = this.VR;
            emit.call(this, "motioncontroller", mgr);
          }
          else {
            this.Keyboard.parent = mgr;
            emit.call(this, "gamepad", mgr);
          }
        }
      });

      Primrose.Input.Gamepad.addEventListener("gamepaddisconnected", this.remove.bind(this));

      this.stage = isMobile ? this.Touch : this.Mouse;
      this.player = this.VR;

      this.managers.forEach((mgr) => mgr.addEventListener("teleport", (position) => this.moveStage(position)));

      this.ready = Promise.all(this.managers
        .map((mgr) => mgr.ready)
        .filter(identity));
    }

    moveStage(position){
      this.stage.position.copy(position);
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
      this.player.updateStage();
      if (!this.stage.isOnGround) {
        this.stage.velocity.y -= this.options.gravity * dt;
        if (this.stage.position.y < 0) {
          this.stage.velocity.y = 0;
          this.stage.position.y = 0;
          this.stage.isOnGround = true;
        }
      }
      Primrose.Input.Gamepad.poll();
      for (var i = 0; i < this.managers.length; ++i) {
        this.managers[i].update();
      }
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

    get lockedToEditor() {
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        if (mgr.lockedToEditor) {
          return true;
        }
      }

      return false;
    }

    resolvePicking(currentHits, lastHits, pickableObjects) {
      for (var i = 0; i < this.managers.length; ++i) {
        this.managers[i].resolvePicking(currentHits, lastHits, pickableObjects);
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

    set inVR(v) {
      for (var i = 0; i < this.managers.length; ++i) {
        this.managers[i].inVR = v;
      }
    }
  }

  return FPSInput;
})();