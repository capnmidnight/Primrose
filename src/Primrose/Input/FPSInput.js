pliny.class({
  parent: "Primrose.Input",
  name: "FPSInput",
  baseClass: "Primrose.AbstractEventEmitter",
  description: "A massive hairball of a class that handles all of the input abstraction.",
  parameters: [{
    name: "DOMElement",
    type: "Element",
    description: "The DOM element on which to add most events.",
    optional: true,
    default: "window"
  }, {
    name: "options",
    type: "Object",
    description: "Optional setup: avatarHeight, gravity, and scene."
  }]
});

const DISPLACEMENT = new Vector3(),
  EULER_TEMP = new Euler(),
  QUAT_TEMP = new Quaternion(),
  WEDGE = Math.PI / 3;

import { Vector3 } from "three/src/math/Vector3";
import { Euler } from "three/src/math/Euler";
import { Quaternion } from "three/src/math/Quaternion";
import { Matrix4 } from "three/src/math/Matrix4";
import AbstractEventEmitter from "../AbstractEventEmitter";
import identity from "../../util/identity";
import hub from "../../live-api/hub";
import colored from "../../live-api/colored";
import box from "../../live-api/box";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import Gamepad from "./Gamepad";
import GamepadManager from "./GamepadManager";
import Touch from "./Touch";
import Speech from "./Speech";
import VR from "./VR";
import Keys from "../Keys";
import Pointer from "../Pointer";
export default class FPSInput extends AbstractEventEmitter {
  constructor(DOMElement, options) {
    super();

    this.options = options;
    this._handlers.zero = [];
    this._handlers.motioncontroller = [];
    this._handlers.gamepad = [];

    this.managers = [];
    this.newState = [];
    this.pointers = [];
    this.motionDevices = [];
    this.velocity = new Vector3();
    this.matrix = new Matrix4();

    if(!this.options.disableKeyboard) {
      this.add(new Keyboard(this, {
        strafeLeft: {
          buttons: [
            -Keys.A,
            -Keys.LEFTARROW
          ]
        },
        strafeRight: {
          buttons: [
            Keys.D,
            Keys.RIGHTARROW
          ]
        },
        strafe: {
          commands: ["strafeLeft", "strafeRight"]
        },
        lift: {
          buttons: [Keys.E],
          scale: 12
        },
        driveForward: {
          buttons: [
            -Keys.W,
            -Keys.UPARROW
          ]
        },
        driveBack: {
          buttons: [
            Keys.S,
            Keys.DOWNARROW
          ]
        },
        drive: {
          commands: ["driveForward", "driveBack"]
        },
        select: {
          buttons: [Keys.ENTER]
        },
        dSelect: {
          buttons: [Keys.ENTER],
          delta: true
        },
        zero: {
          buttons: [Keys.Z],
          metaKeys: [
            -Keys.CTRL,
            -Keys.ALT,
            -Keys.SHIFT,
            -Keys.META
          ],
          commandUp: this.emit.bind(this, "zero")
        }
      }));

      this.Keyboard.operatingSystem = this.options.os;
      this.Keyboard.codePage = this.options.language;
    }

    this.add(new Touch(DOMElement, {
      buttons: {
        axes: ["FINGERS"]
      },
      dButtons: {
        axes: ["FINGERS"],
        delta: true
      },
      heading: {
        axes: ["DX0"],
        integrate: true
      },
      pitch: {
        axes: ["DY0"],
        integrate: true,
        min: -Math.PI * 0.5,
        max: Math.PI * 0.5
      }
    }));

    this.add(new Mouse(DOMElement, {
      U: { axes: ["X"], min: 0, max: 2, offset: 0 },
      V: { axes: ["Y"], min: 0, max: 2 },
      buttons: {
        axes: ["BUTTONS"]
      },
      dButtons: {
        axes: ["BUTTONS"],
        delta: true
      },
      _dx: {
        axes: ["X"],
        delta: true,
        scale: 0.25
      },
      dx: {
        buttons: [0],
        commands: ["_dx"]
      },
      heading: {
        commands: ["dx"],
        integrate: true
      },
      _dy: {
        axes: ["Y"],
        delta: true,
        scale: 0.25
      },
      dy: {
        buttons: [0],
        commands: ["_dy"]
      },
      pitch: {
        commands: ["dy"],
        integrate: true,
        min: -Math.PI * 0.5,
        max: Math.PI * 0.5
      }
    }));

    this.add(new VR(this.options));
    this.motionDevices.push(this.VR);

    if(!this.options.disableGamepad && GamepadManager.isAvailable){
      this.gamepadMgr = new GamepadManager();
      this.gamepadMgr.addEventListener("gamepadconnected", (pad) => {
        const padID = Gamepad.ID(pad);
        let mgr = null;

        if (padID !== "Unknown" && padID !== "Rift") {
          if (Gamepad.isMotionController(pad)) {
            let controllerNumber = 0;
            for (let i = 0; i < this.managers.length; ++i) {
              mgr = this.managers[i];
              if (mgr.currentPad && mgr.currentPad.id === pad.id) {
                ++controllerNumber;
              }
            }

            mgr = new Gamepad(this.gamepadMgr, pad, controllerNumber, {
              buttons: {
                axes: ["BUTTONS"]
              },
              dButtons: {
                axes: ["BUTTONS"],
                delta: true
              },
              zero: {
                buttons: [Gamepad.VIVE_BUTTONS.GRIP_PRESSED],
                commandUp: this.emit.bind(this, "zero")
              }
            });

            this.add(mgr);
            this.motionDevices.push(mgr);

            const shift = (this.motionDevices.length - 2) * 8,
              color = 0x0000ff << shift,
              highlight = 0xff0000 >> shift,
              ptr = new Pointer(padID + "Pointer", color, 1, highlight, [mgr], null, this.options);
            ptr.add(colored(box(0.1, 0.025, 0.2), color, {
              emissive: highlight
            }));

            this.pointers.push(ptr);
            ptr.addToBrowserEnvironment(null, this.options.scene);
            ptr.forward(this, Pointer.EVENTS);
          }
          else {
            mgr = new Gamepad(this.gamepadMgr, pad, 0, {
              buttons: {
                axes: ["BUTTONS"]
              },
              dButtons: {
                axes: ["BUTTONS"],
                delta: true
              },
              strafe: {
                axes: ["LSX"],
                deadzone: 0.2
              },
              drive: {
                axes: ["LSY"],
                deadzone: 0.2
              },
              heading: {
                axes: ["RSX"],
                scale: -1,
                deadzone: 0.2,
                integrate: true
              },
              dHeading: {
                commands: ["heading"],
                delta: true
              },
              pitch: {
                axes: ["RSY"],
                scale: -1,
                deadzone: 0.2,
                integrate: true
              },
              zero: {
                buttons: [Gamepad.XBOX_ONE_BUTTONS.BACK],
                commandUp: emit.bind(this, "zero")
              }
            });
            this.add(mgr);
            this.mousePointer.addDevice(mgr, mgr);
          }
        }
      });

      this.gamepadMgr.addEventListener("gamepaddisconnected", this.remove.bind(this));
    }

    this.stage = hub();

    this.head = new Pointer("GazePointer", 0xffff00, 0x0000ff, 0.8, [
      this.VR
    ], [
      this.Mouse,
      this.Touch,
      this.Keyboard
    ], this.options);

    this.head.rotation.order = "YXZ";
    this.head.useGaze = this.options.useGaze;
    this.pointers.push(this.head);
    this.options.scene.add(this.head.root);
    this.options.scene.add(this.head.disk);

    this.mousePointer = new Pointer("MousePointer", 0xff0000, 0x00ff00, 1, [
      this.Mouse
    ], null, this.options);
    this.mousePointer.unproject = new Matrix4();
    this.pointers.push(this.mousePointer);
    this.head.add(this.mousePointer.root);
    this.options.scene.add(this.mousePointer.disk);


    this.pointers.forEach((ptr) => ptr.forward(this, Pointer.EVENTS));
    this.ready = Promise.all(this.managers
      .map((mgr) => mgr.ready)
      .filter(identity));
  }

  remove(id) {
    const mgr = this[id],
      mgrIdx = this.managers.indexOf(mgr);
    if (mgrIdx > -1) {
      this.managers.splice(mgrIdx, 1);
      delete this[id];
    }
    console.log("removed", mgr);
  }

  add(mgr) {
    for (let i = this.managers.length - 1; i >= 0; --i) {
      if (this.managers[i].name === mgr.name) {
        this.managers.splice(i, 1);
      }
    }
    this.managers.push(mgr);
    this[mgr.name] = mgr;
  }

  zero() {
    for (let i = 0; i < this.managers.length; ++i) {
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
    return !this.hasTouch && !!(this.Mouse && this.Mouse.enabled && this.Mouse.inPhysicalUse);
  }

  get hasTouch() {
    return !!(this.Touch && this.Touch.enabled && this.Touch.inPhysicalUse);
  }

  submitFrame() {
    this.VR.submitFrame();
  }

  update(dt) {
    const hadGamepad = this.hasGamepad;
    if(this.gamepadMgr) {
      this.gamepadMgr.poll();
    }
    for (let i = 0; i < this.managers.length; ++i) {
      this.managers[i].update(dt);
    }

    if (!hadGamepad && this.hasGamepad) {
      this.Mouse.inPhysicalUse = false;
    }

    this.head.showPointer = this.VR.hasOrientation && this.options.showHeadPointer;
    this.mousePointer.showPointer = (this.hasMouse || this.hasGamepad) && !this.hasMotionControllers;

    if(this.Keyboard) {
      this.Keyboard.enabled = this.Touch.enabled = this.Mouse.enabled = !this.hasMotionControllers;
    }

    if (this.Gamepad_0) {
      this.Gamepad_0.enabled = !this.hasMotionControllers;
    }

    this.updateStage(dt);
    this.stage.position.y = this.options.avatarHeight;
    for (let i = 0; i < this.motionDevices.length; ++i) {
      this.motionDevices[i].posePosition.y -= this.options.avatarHeight;
    }

    // update the motionDevices
    this.stage.updateMatrix();
    this.matrix.multiplyMatrices(this.stage.matrix, this.VR.stage.matrix);
    for (let i = 0; i < this.motionDevices.length; ++i) {
      this.motionDevices[i].updateStage(this.matrix);
    }

    for (let i = 0; i < this.pointers.length; ++i) {
      this.pointers[i].update();
    }

    // record the position and orientation of the user
    this.newState = [];
    this.head.updateMatrix();
    this.stage.rotation.x = 0;
    this.stage.rotation.z = 0;
    this.stage.quaternion.setFromEuler(this.stage.rotation);
    this.stage.updateMatrix();
    this.head.position.toArray(this.newState, 0);
    this.head.quaternion.toArray(this.newState, 3);
  }

  updateStage(dt) {
    // get the linear movement from the mouse/keyboard/gamepad
    let heading = 0,
      pitch = 0,
      strafe = 0,
      drive = 0,
      lift = 0;
    for (let i = 0; i < this.managers.length; ++i) {
      const mgr = this.managers[i];
      if(mgr.enabled){
        if(mgr.name !== "Mouse"){
          heading += mgr.getValue("heading");
        }
        pitch += mgr.getValue("pitch");
        strafe += mgr.getValue("strafe");
        drive += mgr.getValue("drive");
        lift += mgr.getValue("lift");
      }
    }

    if(this.hasMouse) {
      let mouseHeading = null;
      if (this.VR.hasOrientation) {
        mouseHeading = this.mousePointer.root.rotation.y;
        const newMouseHeading = WEDGE * Math.floor((mouseHeading / WEDGE) + 0.5);
        if(newMouseHeading !== 0){
          this.Mouse.commands.U.offset -= this.Mouse.getValue("U") - 1;
        }
        mouseHeading = newMouseHeading + this.Mouse.commands.U.offset * 2;
      }
      else{
        mouseHeading = this.Mouse.getValue("heading");
      }
      heading += mouseHeading;
    }
    if (this.VR.hasOrientation) {
      pitch = 0;
    }

    // move stage according to heading and thrust
    EULER_TEMP.set(pitch, heading, 0, "YXZ");
    this.stage.quaternion.setFromEuler(EULER_TEMP);

    // update the stage's velocity
    this.velocity.set(strafe, lift, drive);

    if (this.stage.isOnGround) {
      if(this.velocity.y > 0){
        this.stage.isOnGround = false;
      }
    }
    else {
      this.velocity.y -= this.options.gravity;
      if (this.stage.position.y < 0) {
        this.velocity.y = 0;
        this.stage.position.y = 0;
        this.stage.isOnGround = true;
      }
    }

    QUAT_TEMP.copy(this.head.quaternion);
    EULER_TEMP.setFromQuaternion(QUAT_TEMP);
    EULER_TEMP.x = 0;
    EULER_TEMP.z = 0;
    QUAT_TEMP.setFromEuler(EULER_TEMP);

    this.moveStage(DISPLACEMENT
      .copy(this.velocity)
      .multiplyScalar(dt)
      .applyQuaternion(QUAT_TEMP)
      .add(this.head.position));
  }

  cancelVR() {
    this.VR.cancel();
    this.Mouse.commands.U.offset = 0;
  }

  moveStage(position) {
    DISPLACEMENT.copy(position)
      .sub(this.head.position);
    this.stage.position.add(DISPLACEMENT);
  }

  get segments() {
    const segments = [];
    for (let i = 0; i < this.pointers.length; ++i) {
      const seg = this.pointers[i].segment;
      if (seg) {
        segments.push(seg);
      }
    }
    return segments;
  }

  resolvePicking(objects) {
    for (let i = 0; i < this.pointers.length; ++i) {
      const ptr = this.pointers[i];
      ptr.resolvePicking(objects);
    }
  }
};