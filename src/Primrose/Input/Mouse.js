/*
pliny.class({
  parent: "Primrose.Input",
  name: "Mouse",
  baseClass: "Primrose.Input.InputProcessor",
  description: "| [under construction]"
});
*/

import { isChrome } from "../../flags";
import { PointerLock } from "../../util";

import InputProcessor from "./InputProcessor";

export default class Mouse extends InputProcessor {
  constructor(DOMElement, commands) {
    super("Mouse", commands, ["BUTTONS", "X", "Y", "Z", "W"], "mousedown");

    var setState = (stateChange, event) => {
      this.inPhysicalUse = true;
      var state = event.buttons;
      for(let button = 0; button < Mouse.NUM_BUTTONS; ++button) {
        var isDown = state & 0x1 !== 0;
        if(isDown && stateChange || !isDown && !stateChange){
          this.setButton(button, stateChange);
        }
        state >>= 1;
      }
      this.setAxis("BUTTONS", event.buttons << 10);
      if(event.target === DOMElement){
        event.preventDefault();
      }
    };

    DOMElement.addEventListener("mousedown", setState.bind(this, true), false);
    DOMElement.addEventListener("mouseup", setState.bind(this, false), false);
    DOMElement.addEventListener("contextmenu", (event) => !(event.ctrlKey && event.shiftKey) && event.preventDefault(), false);
    DOMElement.addEventListener("mousemove", (event) => {
      setState(true, event);

      if (PointerLock.isActive) {
        var mx = event.movementX,
          my = event.movementY;

        if (mx === undefined) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        this.setAxis("X", this.getAxis("X") + mx);
        this.setAxis("Y", this.getAxis("Y") + my);
      }
      else {
        this.setAxis("X", event.layerX);
        this.setAxis("Y", event.layerY);
      }
    }, false);

    DOMElement.addEventListener("wheel", (event) => {
      if (isChrome) {
        this.W += event.deltaX;
        this.Z += event.deltaY;
      }
      else if (event.shiftKey) {
        this.W += event.deltaY;
      }
      else {
        this.Z += event.deltaY;
      }
      if(event.target === DOMElement){
        event.preventDefault();
      }
    }, false);
  }
};

Mouse.NUM_BUTTONS = 3;
