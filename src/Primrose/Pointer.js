pliny.class({
  parent: "Primrose",
  name: "Pointer",
  description: "An object that points into the scene somewhere, casting a ray at objects for picking operations.",
  parameters: [{
    name: "pointerName",
    type: "String",
    description: "A friendly name for this pointer object, to make debugging easier."
  }, {
    name: "color",
    type: "Number",
    description: "The color to use to render the teleport pad and 3D pointer cursor."
  }, {
    name: "highlight",
    type: "Number",
    description: "The color to use to highlight the teleport pad and 3D pointer cursor when it's pointing at a real thing."
  }, {
    name: "devices",
    type: "Array",
    description: "An Array of `Primrose.InputProcessor` objects that define the orientation for this pointer."
  }, {
    name: "triggerDevices",
    type: "Array",
    description: "An Array of `Primrose.InputProcessor` objects that define the button trigger for this pointer.",
    optional: true,
    default: null
    }]
});

import { Vector3 } from "three/src/math/Vector3";
import { Euler } from "three/src/math/Euler";
import { Quaternion } from "three/src/math/Quaternion";
import { Raycaster } from "three/src/core/Raycaster";
import { Object3D } from "three/src/core/Object3D";

import identity from "../util/identity";
import colored from "../live-api/colored";
import hub from "../live-api/hub";
import box from "../live-api/box";
import sphere from "../live-api/sphere";
import circle from "../live-api/circle";
import ring from "../live-api/ring";
import material from "../live-api/material";
import Entity from "./Controls/Entity";

const FORWARD = new Vector3(0, 0, -1),
  LASER_WIDTH = 0.01,
  LASER_LENGTH = 3 * LASER_WIDTH,
  GAZE_RING_DISTANCE  = -1.25,
  GAZE_RING_INNER = 0.015,
  GAZE_RING_OUTER = 0.03,
  VECTOR_TEMP = new Vector3(),
  EULER_TEMP = new Euler(),
  QUAT_TEMP = new Quaternion();


function hasGazeEvent(obj){
  return !!obj.ongazecomplete || !!obj.onselect || !!obj.onclick ||
     obj._listeners && (
      (obj._listeners.gazecomplete && obj._listeners.gazecomplete.length > 0) ||
      (obj._listeners.select && obj._listeners.select.length > 0) ||
      (obj._listeners.click && obj._listeners.click.length > 0)) ||
    obj.button && hasGazeEvent(obj.button);
}

export default class Pointer extends Entity {
  constructor(pointerName, color, highlight, s, devices, triggerDevices, options) {
    super(Object.assign({}, options, {
      id: pointerName
    }));

    this.devices = devices.filter(identity);
    this.triggerDevices = triggerDevices && triggerDevices.filter(identity) || this.devices.slice();
    this.gazeTimeout = (this.options.gazeLength || 1.5) * 1000;

    this.unproject = null;

    this.picker = new Raycaster();
    this.showPointer = true;
    this.color = color;
    this.highlight = highlight;
    this.velocity = new Vector3();

    this.mesh = box(LASER_WIDTH / s, LASER_WIDTH / s, LASER_LENGTH * s)
      .colored(this.color, {
        unshaded: true
      })
      .named(pointerName + "-pointer")
      .addTo(this)
      .at(0, 0, -1.5);

    this.gazeInner = circle(GAZE_RING_INNER / 2, 10)
      .colored(0xc0c0c0, {
        unshaded: true
      })
      .addTo(this)
      .at(0, 0, GAZE_RING_DISTANCE);

    this.gazeReference = ring(GAZE_RING_INNER * 0.5, GAZE_RING_INNER * 0.75, 10, 36, 0, 2 * Math.PI)
      .colored(0xffffff, {
        unshaded: true
      })
      .addTo(this.gazeInner);

    this.gazeOuter = ring(GAZE_RING_INNER, GAZE_RING_OUTER, 10, 36, 0, 2 * Math.PI)
      .colored(0xffffff, {
        unshaded: true
      })
      .addTo(this.gazeInner);

    this.gazeOuter.visible = false;

    this.useGaze = this.options.useGaze;
    this.lastHit = null;
  }

  get material(){
    return this.mesh.material;
  }

  set material(v){
    this.mesh.material = v;
    this.gazeInner.material = v;
    this.gazeOuter.material = v;
  }

  addDevice(orientation, trigger){
    if(orientation){
      this.devices.push(orientation);
    }

    if(trigger){
      this.triggerDevices.push(trigger);
    }
  }

  update() {
    this.position.set(0, 0, 0);

    if(this.unproject) {
      QUAT_TEMP.set(0, 1, 0, 0);
      VECTOR_TEMP.set(0, 0, 0);
      for(let i = 0; i < this.devices.length; ++i) {
        const obj = this.devices[i];
        if(obj.enabled && !obj.commands.U.disabled && !obj.commands.V.disabled) {
          VECTOR_TEMP.x += obj.getValue("U") - 1;
          VECTOR_TEMP.y += obj.getValue("V") - 1;
        }
      }
      VECTOR_TEMP.applyMatrix4(this.unproject)
        .applyQuaternion(QUAT_TEMP);
      this.lookAt(VECTOR_TEMP);
    }
    else {
      this.quaternion.set(0, 0, 0, 1);
      EULER_TEMP.set(0, 0, 0, "YXZ");
      for(let i = 0; i < this.devices.length; ++i) {
        const obj = this.devices[i];
        if(obj.enabled) {
          if(obj.quaternion) {
            this.quaternion.multiply(obj.quaternion);
          }
          if(obj.position) {
            this.position.add(obj.position);
          }
        }
      }

      QUAT_TEMP.setFromEuler(EULER_TEMP);
      this.quaternion.multiply(QUAT_TEMP);
    }
    this.updateMatrixWorld();
  }

  _check(currentHit) {
    const lastHit = this.lastHit,
      obj = currentHit && currentHit.object,
      lastObj = lastHit && lastHit.object;
    if(obj && obj.name === "disk") {
      console.log(currentHit);
    }
    if(obj || lastObj) {
      const moved = lastHit && currentHit &&
        (currentHit.point.x !== lastHit.point.x ||
        currentHit.point.y !== lastHit.point.y ||
        currentHit.point.z !== lastHit.point.z),
      dt = lastHit && lastHit.time && (performance.now() - lastHit.time),
      changed = !lastHit && currentHit ||
        lastHit && !currentHit ||
        lastHit && currentHit && currentHit.object.id !== lastHit.object.id,
      enterEvt = {
        pointer: this,
        buttons: 0,
        hit: currentHit
      },
      leaveEvt = {
        pointer: this,
        buttons: 0,
        hit: lastHit
      };


      if(currentHit){
        this.gazeInner.position.z = 0.02 - currentHit.distance;
      }
      else{
         this.gazeInner.position.z = GAZE_RING_DISTANCE;
      }
      this.mesh.position.z = this.gazeInner.position.z - 0.02;

      if(currentHit){
        currentHit.time = performance.now();

        this.mesh.material = material("", {
          color: this.highlight,
          unshaded: true
        });
      }

      if(moved){
        lastHit.point.copy(currentHit.point);
      }

      this.gazeInner.visible = this.useGaze;
      this.mesh.visible = !this.useGaze;

      var dButtons = 0;
      for(let i = 0; i < this.triggerDevices.length; ++i) {
        const obj = this.triggerDevices[i];
        if(obj.enabled){
          enterEvt.buttons |= obj.getValue("buttons");
          dButtons |= obj.getValue("dButtons");
        }
      }

      leaveEvt.buttons = enterEvt.buttons;

      if(changed){
        if(lastHit && lastHit.object) {
          lastHit.object.emit("exit", leaveEvt);
        }
        if(obj) {
          obj.emit("enter", enterEvt);
        }
      }

      let selected = false;
      if(dButtons){
        if(enterEvt.buttons){
          if(obj) {
            obj.emit("pointerstart", enterEvt);
          }
          if(lastHit){
            lastHit.time = performance.now();
          }
        }
        else{
          selected = !!currentHit;
          if(obj) {
            obj.emit("pointerend", enterEvt);
          }
        }
      }
      else if(moved && obj) {
        obj.emit("pointermove", enterEvt);
      }

      if(this.useGaze){
        if(changed) {
          if(dt !== null && dt < this.gazeTimeout){
            this.gazeOuter.visible = false;
            if(obj) {
              obj.emit("gazecancel", leaveEvt);
            } else if(lastHit && lastHit.object) {
              lastHit.object.emit("gazecancel", leaveEvt);
            }
          }
          if(currentHit){
            this.gazeOuter.visible = true;
            if(obj) {
              obj.emit("gazestart", enterEvt);
            }
          }
        }
        else if(dt !== null) {
          if(dt >= this.gazeTimeout){
            this.gazeOuter.visible = false;
            selected = !!currentHit;
            if(obj) {
              obj.emit("gazecomplete", enterEvt);
            }
            lastHit.time = null;
          }
          else if(currentHit && currentHit.object && hasGazeEvent(currentHit.object)){
            var p = Math.round(36 * dt / this.gazeTimeout),
              a = 2 * Math.PI * p / 36;
            this.gazeOuter.geometry = ring(GAZE_RING_INNER, GAZE_RING_OUTER, 36, p, 0, a);
            if(moved && obj) {
              obj.emit("gazemove", enterEvt);
            }
          }
          else{
            this.gazeOuter.visible = false;
          }
        }
      }

      if(selected && obj){
        obj.emit("select", enterEvt);
      }

      if(changed){
        this.lastHit = currentHit;
      }
      return true;
    }
    return false;
  }

  resolvePicking(objects) {
    this.mesh.visible = false;
    this.gazeInner.visible = false;
    this.mesh.material = material("", {
      color: this.color,
      unshaded: true
    });

    if(this.showPointer){
      VECTOR_TEMP.set(0, 0, 0)
        .applyMatrix4(this.matrixWorld);
      FORWARD.set(0, 0, -1)
        .applyMatrix4(this.matrixWorld)
        .sub(VECTOR_TEMP);
      this.picker.set(VECTOR_TEMP, FORWARD);
      const hits = this.picker.intersectObject(objects, true);
      let found = false;
      for(let i = 0; i < hits.length && !found; ++i) {
        const hit = hits[i];
        if(hit.object.pickable && this._check(hit)) {
          found = true;
        }
      }

      if(!found){
        this._check();
      }
    }
  }
}

Pointer.EVENTS = ["pointerstart", "pointerend", "pointermove", "gazestart", "gazemove", "gazecomplete", "gazecancel", "exit", "enter", "select"];