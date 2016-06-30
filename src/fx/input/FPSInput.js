Primrose.Input.FPSInput = (function () {
  "use strict";

  const SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"],
    AXIS_PREFIXES = ["L", "R"],
    temp = new THREE.Quaternion(),
    euler = new THREE.Euler();

  pliny.class({
    parent: "Primrose.Input",
      name: "FPSInput",
      description: "| [under construction]"
  });
  class FPSInput {
    constructor(DOMElement, avatarHeight) {
      DOMElement = DOMElement || window;

      this.listeners = {
        zero: [],
        pointerstart: [],
        pointerend: [],
        motioncontroller: [],
        gamepad: []
      };

      this.managers = [];

      this.add(new Primrose.Input.VR(avatarHeight));

      this.add(new Primrose.Input.Keyboard(DOMElement, null, {
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

      this.add(new Primrose.Input.Mouse(DOMElement, this.Keyboard, {
        pointer: {
          buttons: [Primrose.Keys.ANY],
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        buttons: {
          axes: [Primrose.Input.Mouse.BUTTONS]
        },
        dButtons: {
          axes: [Primrose.Input.Mouse.BUTTONS],
          delta: true
        },
        pointerX: {
          axes: [Primrose.Input.Mouse.X]
        },
        pointerY: {
          axes: [Primrose.Input.Mouse.Y]
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

      this.add(new Primrose.Input.Touch(DOMElement, null, {
        fullScreen: {
          buttons: [Primrose.Keys.ANY],
          commandUp: emit.bind(this, "fullscreen")
        },
        pointer: {
          buttons: [Primrose.Keys.ANY],
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        buttons: {
          axes: [Primrose.Input.Touch.FINGERS]
        },
        dButtons: {
          axes: [Primrose.Input.Touch.FINGERS],
          delta: true
        },
        pointerX: {
          axes: [Primrose.Input.Touch.X0]
        },
        pointerY: {
          axes: [Primrose.Input.Touch.Y0]
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

      Primrose.Input.Gamepad.addEventListener("gamepadconnected", (pad) => {
        var isMotion = pad.id === "OpenVR Gamepad",
          padCommands = null,
          controllerNumber = 0;

        if (pad.id.indexOf("Unknown") !== 0) {
          if (isMotion) {
            padCommands = {
              pointer: {
                buttons: [Primrose.Input.Gamepad.VIVE_BUTTONS.TRIGGER_PRESSED],
                commandDown: emit.bind(this, "pointerstart"),
                commandUp: emit.bind(this, "pointerend")
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
              pointer: {
                buttons: [Primrose.Input.Gamepad.XBOX_ONE_BUTTONS.A],
                commandDown: emit.bind(this, "pointerstart"),
                commandUp: emit.bind(this, "pointerend")
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
              dheading: {
                commands: ["heading"],
                delta: true
              },
              pitch: {
                axes: [-Primrose.Input.Gamepad.RSY],
                deadzone: 0.2,
                integrate: true
              }
            };
          }

          var mgr = new Primrose.Input.Gamepad(pad, controllerNumber, padCommands);
          this.add(mgr);

          if (isMotion) {
            emit.call(this, "motioncontroller", mgr);
          }
          else {
            this.Keyboard.parent = mgr;
            emit.call(this, "gamepad", mgr);
          }
        }
      });

      Primrose.Input.Gamepad.addEventListener("gamepaddisconnected", this.remove.bind(this));

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
      if (this.vr && this.vr.currentDisplay) {
        this.vr.currentDisplay.resetPose();
      }
      if (this.motion) {
        this.motion.zeroAxes();
      }
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        for (var j = 0; mgr.enabled && j < SETTINGS_TO_ZERO.length; ++j) {
          mgr.setValue(SETTINGS_TO_ZERO[j], 0);
        }
      }
    }

    update(dt, stage) {
      Primrose.Input.Gamepad.poll();
      var segments = [];
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        if (mgr.enabled) {
          var seg = mgr.update(dt, stage);
          if(seg){
            segments.push(seg);
          }
        }
      }
      return segments;
    }

    addEventListener(evt, thunk, bubbles) {
      if (this.listeners[evt]) {
        this.listeners[evt].push(thunk);
      }
      else {
        this.managers.forEach(function (mgr) {
          if (mgr.addEventListener) {
            mgr.addEventListener(evt, thunk, bubbles);
          }
        });
      }
    }

    set inVR(v) {
      for (var i = 0; i < this.managers.length; ++i) {
        this.managers[i].inVR = v;
      }
    }

    getQuaternion(xValueName, yValueName, zValueName, quaternion) {
      pliny.method({
        parent: "Primrose.FPSInput",
        name: "getQuaternion2",
        returns: "THREE.Vector3",
        paramters: [{
          name: "xValueName",
          type: "String",
          description: "The name of the value to retrieve for the X axis."
        }, {
          name: "yValueName",
          type: "String",
          description: "The name of the value to retrieve for the Y axis."
        }, {
          name: "zValueName",
          type: "String",
          description: "The name of the value to retrieve for the Z axis."
        }, {
          name: "quaternion",
          type: "THREE.Quaternion",
          optional: true,
          description: "A quaternion to which to output the axis value. If no quaternion is provided, one will be created."
        }]
      });

      var x = 0,
        y = 0,
        z = 0,
        mgr;

      quaternion = quaternion || THREE.Quaternion();

      for (var i = 0; i < this.managers.length; ++i) {
        mgr = this.managers[i];
        x += mgr.getValue(xValueName);
        y += mgr.getValue(yValueName);
        z += mgr.getValue(zValueName);
      }

      euler.set(x, y, z, "YXZ");
      quaternion.setFromEuler(euler);

      return quaternion;
    }

    getVector(xValueName, yValueName, zValueName, vector) {
      pliny.method({
        parent: "Primrose.FPSInput",
        name: "getVector2",
        returns: "THREE.Vector3",
        paramters: [{
          name: "xValueName",
          type: "String",
          description: "The name of the value to retrieve for the X axis."
        }, {
          name: "yValueName",
          type: "String",
          description: "The name of the value to retrieve for the Y axis."
        }, {
          name: "zValueName",
          type: "String",
          description: "The name of the value to retrieve for the Z axis."
        }, {
          name: "vector",
          type: "THREE.Vector3",
          optional: true,
          description: "A vector to which to output the axis value. If no vector is provided, one will be created."
        }]
      });

      var x = 0,
        y = 0,
        z = 0;

      vector = vector || new THREE.Vector3();

      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        x += mgr.getValue(xValueName);
        y += mgr.getValue(yValueName);
        z += mgr.getValue(zValueName);
      }

      vector.set(x, y, z);
      return vector;
    }

    getValue(name) {
      var value = 0;
      for (var i = 0; i < this.managers.length; ++i) {
        var mgr = this.managers[i];
        if (mgr.enabled) {
          value += mgr.getValue(name);
        }
      }
      return value;
    }
  }

  return FPSInput;
})();