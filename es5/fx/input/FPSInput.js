"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Input.FPSInput = function () {
  "use strict";

  var DISPLACEMENT = new THREE.Vector3(),
      EULER_TEMP = new THREE.Euler(),
      WEDGE = Math.PI / 3;

  pliny.class({
    parent: "Primrose.Input",
    name: "FPSInput",
    description: "| [under construction]"
  });

  var FPSInput = function () {
    function FPSInput(DOMElement, options) {
      var _this = this;

      _classCallCheck(this, FPSInput);

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

      this.add(new Primrose.Input.Keyboard(null, {
        strafeLeft: {
          buttons: [-Primrose.Keys.A, -Primrose.Keys.LEFTARROW]
        },
        strafeRight: {
          buttons: [Primrose.Keys.D, Primrose.Keys.RIGHTARROW]
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
          buttons: [Primrose.Keys.S, Primrose.Keys.DOWNARROW]
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

      Primrose.Input.Gamepad.addEventListener("gamepadconnected", function (pad) {
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
                commandUp: emit.bind(_this, "zero")
              }
            };

            for (var i = 0; i < _this.managers.length; ++i) {
              var mgr = _this.managers[i];
              if (mgr.currentPad && mgr.currentPad.id === pad.id) {
                ++controllerNumber;
              }
            }
          } else {
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
                commandUp: emit.bind(_this, "zero")
              }
            };
          }

          var mgr = new Primrose.Input.Gamepad(pad, controllerNumber, padCommands);
          _this.add(mgr);

          if (isMotion) {
            mgr.parent = _this.VR;
            _this.motionDevices.push(mgr);

            var ptr = new Primrose.Pointer(mgr, 0x0000ff, 0x00007f, true);
            _this.pointers.push(ptr);
            ptr.addToBrowserEnvironment(null, _this.options.scene);
            ptr.addEventListener("teleport", function (evt) {
              return _this.moveStage(evt.position);
            });
          } else {
            _this.Keyboard.parent = mgr;
          }
        }
      });

      Primrose.Input.Gamepad.addEventListener("gamepaddisconnected", this.remove.bind(this));

      this.stage = new THREE.Object3D();

      this.mousePointer = new Primrose.Pointer(this.Mouse, 0xff0000, 0x7f0000);
      this.pointers.push(this.mousePointer);
      this.mousePointer.addToBrowserEnvironment(null, this.options.scene);

      this.head = new Primrose.Pointer(this.VR, 0x00ff00, 0x007f00);
      this.pointers.push(this.head);
      this.head.addToBrowserEnvironment(null, this.options.scene);

      this.pointers.forEach(function (ptr) {
        return ptr.addEventListener("teleport", function (evt) {
          return _this.moveStage(evt.position);
        });
      });

      this.ready = Promise.all(this.managers.map(function (mgr) {
        return mgr.ready;
      }).filter(identity));
    }

    _createClass(FPSInput, [{
      key: "remove",
      value: function remove(id) {
        var mgr = this[id],
            mgrIdx = this.managers.indexOf(mgr);
        if (mgrIdx > -1) {
          this.managers.splice(mgrIdx, 1);
          delete this[id];
        }
        console.log("removed", mgr);
      }
    }, {
      key: "add",
      value: function add(mgr) {
        for (var i = this.managers.length - 1; i >= 0; --i) {
          if (this.managers[i].name === mgr.name) {
            this.managers.splice(i, 1);
          }
        }
        this.managers.push(mgr);
        this[mgr.name] = mgr;
      }
    }, {
      key: "zero",
      value: function zero() {
        for (var i = 0; i < this.managers.length; ++i) {
          this.managers[i].zero();
        }
      }
    }, {
      key: "update",
      value: function update(dt, avatarHeight) {
        this.Keyboard.enabled = this.Touch.enabled = this.Mouse.enabled = !this.VR.hasStage;
        if (this.Gamepad_0) {
          this.Gamepad_0.enabled = !this.VR.hasStage;
        }

        Primrose.Input.Gamepad.poll();
        for (var i = 0; i < this.managers.length; ++i) {
          this.managers[i].update(dt);
        }

        this.updateStage(dt);

        // update the motionDevices
        this.stage.updateMatrix();
        this.matrix.multiplyMatrices(this.stage.matrix, this.VR.stage.matrix);
        for (var i = 0; i < this.motionDevices.length; ++i) {
          this.motionDevices[i].updateStage(this.matrix);
        }

        this.head.update();
        this.mousePointer.update(this.head.position);

        if (this.VR.hasOrientation) {
          this.mousePointer.showPointer = (this.Mouse.inPhysicalUse || this.Gamepad_0 && this.Gamepad_0.inPhysicalUse) && !this.Touch.inPhysicalUse && !this.VR.hasStage;
          this.head.showPointer = !this.mousePointer.showPointer && !this.VR.hasStage;
        } else {
          // if we're not using an HMD, then update the view according to the mouse
          this.head.quaternion.copy(this.mousePointer.quaternion);
          this.head.showPointer = false;
          this.mousePointer.showPointer = true;
        }

        // record the position and orientation of the user
        this.newState = [];
        this.stage.position.toArray(this.newState, 0);
        this.stage.quaternion.toArray(this.newState, 3);
        this.head.position.toArray(this.newState, 7);
        this.head.quaternion.toArray(this.newState, 10);
      }
    }, {
      key: "updateStage",
      value: function updateStage(dt) {
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
          heading = WEDGE * Math.floor(heading / WEDGE + 0.5);
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

        this.moveStage(DISPLACEMENT.copy(this.velocity).multiplyScalar(dt).applyQuaternion(this.stage.quaternion).add(this.head.position));
      }
    }, {
      key: "moveStage",
      value: function moveStage(position) {
        DISPLACEMENT.copy(position).sub(this.head.position);
        this.stage.position.x += DISPLACEMENT.x;
        this.stage.position.z += DISPLACEMENT.z;
      }
    }, {
      key: "resolvePicking",
      value: function resolvePicking(currentHits, lastHits, pickableObjects) {
        for (var i = 0; i < this.pointers.length; ++i) {
          this.pointers[i].resolvePicking(currentHits, lastHits, pickableObjects);
        }
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(evt, thunk, bubbles) {
        if (this.listeners[evt]) {
          this.listeners[evt].push(thunk);
        } else {
          for (var i = 0; i < this.managers.length; ++i) {
            this.managers[i].addEventListener(evt, thunk, bubbles);
          }
        }
      }
    }, {
      key: "segments",
      get: function get() {
        var segments = [];
        for (var i = 0; i < this.pointers.length; ++i) {
          var seg = this.pointers[i].segment;
          if (seg) {
            segments.push(seg);
          }
        }
        return segments;
      }
    }, {
      key: "lockMovement",
      get: function get() {
        for (var i = 0; i < this.pointers.length; ++i) {
          var ptr = this.pointers[i];
          if (ptr.lockMovement) {
            return true;
          }
        }

        return false;
      }
    }]);

    return FPSInput;
  }();

  return FPSInput;
}();