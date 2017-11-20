/*
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
*/

import { Vector3, Euler, Quaternion, Raycaster, Object3D } from "three";

import { identity } from "../util";

import {
  colored,
  hub,
  box,
  sphere,
  circle,
  ring,
  material
} from "../live-api";

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
  return obj && obj._listeners && (
      (obj._listeners.gazecomplete && obj._listeners.gazecomplete.length > 0) ||
      (obj._listeners.select && obj._listeners.select.length > 0) ||
      (obj._listeners.click && obj._listeners.click.length > 0));
}

export default class Pointer extends Entity {
  constructor(pointerName, color, highlight, s, devices, triggerDevices, options) {
    super(pointerName, options);

    this.isPointer = true;
    this.devices = devices.filter(identity);
    this.triggerDevices = triggerDevices && triggerDevices.filter(identity) || this.devices.slice();
    this.gazeTimeout = (this.options.gazeLength || 1.5) * 1000;

    this.unproject = null;

    this.picker = new Raycaster();
    this.showPointer = true;
    this.color = color;
    this.highlight = highlight;

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

  get pickable() {
    return false;
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

  setSize(width, height) {
    const w = devicePixelRatio * 2 / width,
      h = devicePixelRatio * 2 / height;
    for(let i = 0; i < this.devices.length; ++i) {
      const device = this.devices[i];
      if(device.commands.U) {
        device.commands.U.scale = w;
      }
      if(device.commands.V) {
        device.commands.V.scale = h;
      }
    }
  }

  update() {
    super.update();
    this.position.set(0, 0, 0);

    if(this.unproject) {
      QUAT_TEMP.set(0, 1, 0, 0);
      VECTOR_TEMP.set(0, 0, 0);
      for(let i = 0; i < this.devices.length; ++i) {
        const obj = this.devices[i];
        if(obj.enabled && obj.inPhysicalUse) {
          if(obj.commands.U && !obj.commands.U.disabled) {
            VECTOR_TEMP.x += obj.getValue("U") - 1;
          }
          if(obj.commands.V && !obj.commands.V.disabled) {
            VECTOR_TEMP.y += obj.getValue("V") - 1;
          }
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

  _check(curHit) {
    const curObj = curHit && curHit.object,
      lastHit = this.lastHit,
      lastObj = lastHit && lastHit.object;

    if(curObj || lastObj) {
      const moved = lastHit && curHit &&
          (curHit.point.x !== lastHit.point.x ||
          curHit.point.y !== lastHit.point.y ||
          curHit.point.z !== lastHit.point.z),
        dt = lastHit && lastHit.time && (performance.now() - lastHit.time),
        curID = curObj && curObj.id,
        lastID = lastObj && lastObj.id,
        changed = curID !== lastID,
        enterEvt = {
          pointer: this,
          buttons: 0,
          hit: curHit
        },
        leaveEvt = {
          pointer: this,
          buttons: 0,
          hit: lastHit
        };

      if(curHit){
        this.gazeInner.position.z = 0.02 - curHit.distance;
        curHit.time = performance.now();

        this.mesh.material = material("", {
          color: this.highlight,
          unshaded: true
        });
      }
      else{
        this.gazeInner.position.z = GAZE_RING_DISTANCE;
      }

      if(moved){
        lastHit.point.copy(curHit.point);
      }

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
        if(lastObj) {
          this.emit("exit", leaveEvt);
        }
        if(curObj) {
          this.emit("enter", enterEvt);
        }
      }

      let selected = false;
      if(dButtons){
        if(enterEvt.buttons){
          if(curObj) {
            this.emit("pointerstart", enterEvt);
          }
          if(lastHit){
            lastHit.time = performance.now();
          }
        }
        else if(curObj) {
          selected = !!curHit;
          this.emit("pointerend", enterEvt);
        }
      }
      else if(moved && curObj) {
        this.emit("pointermove", enterEvt);
      }

      if(this.useGaze){
        if(changed) {
          if(dt !== null && dt < this.gazeTimeout){
            this.gazeOuter.visible = false;
            if(lastObj) {
              this.emit("gazecancel", leaveEvt);
            }
          }
          if(curHit){
            this.gazeOuter.visible = true;
            if(curObj) {
              this.emit("gazestart", enterEvt);
            }
          }
        }
        else if(dt !== null) {
          if(dt >= this.gazeTimeout){
            this.gazeOuter.visible = false;
            if(curObj) {
              selected = !!curHit;
              this.emit("gazecomplete", enterEvt);
            }
            lastHit.time = null;
          }
          else if(hasGazeEvent(curObj)){
            var p = Math.round(36 * dt / this.gazeTimeout),
              a = 2 * Math.PI * p / 36;
            this.gazeOuter.geometry = ring(GAZE_RING_INNER, GAZE_RING_OUTER, 36, p, 0, a);
            if(moved && curObj) {
              this.emit("gazemove", enterEvt);
            }
          }
          else{
            this.gazeOuter.visible = false;
          }
        }
      }

      if(selected){
        this.emit("select", enterEvt);
      }

      if(!changed && curHit && lastHit) {
        curHit.time = lastHit.time;
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
      this.gazeInner.visible = this.useGaze;
      this.mesh.visible = !this.useGaze;

      // Fire phasers
      const hits = this.picker.intersectObject(objects, true);
      for(let i = 0; i < hits.length; ++i) {

        const hit = hits[i],
          origObj = hit.object;
        let obj = origObj;

        // Try to find a Primrose Entity
        while(obj && (!obj.isEntity || obj.isPointer)) {
          obj = obj.parent;
        }

        // If we didn't find a Primrose Entity, go back to using the Three.js mesh.
        if(!obj) {
          obj = origObj;
        }

        // Check to see if the object has any event handlers that we care about.
        if(obj && !obj.pickable) {
          obj = null;
        }

        // Save the setting, necessary for checking against the last value, to check for changes in which object was pointed at.
        hit.object = obj;

        if(obj && this._check(hit)) {
          this.lastHit = hit;
          return hit.object._listeners.useraction;
        }
      }

      // If we got this far, it means we didn't find any good objects, and the _check method never ran. So run the check again with no object and it will fire the necessary "end" event handlers.
      this._check();
      this.lastHit = null;
    }
  }
}

Pointer.EVENTS = ["pointerstart", "pointerend", "pointermove", "gazestart", "gazemove", "gazecomplete", "gazecancel", "exit", "enter", "select", "useraction"];
