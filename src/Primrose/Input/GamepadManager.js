/*
pliny.class({
  parent: "Primrose.Input",
  name: "GamepadManager",
  baseClass: "THREE.EventDispatcher",
  description: "| [under construction]"
});
*/

const blackList = [
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2910.0 Safari/537.36"
];


navigator.getGamepads = navigator.getGamepads ||
  navigator.webkitGetGamepads;

import { EventDispatcher } from "three";
import Gamepad from "./Gamepad";
export default class GamepadManager extends EventDispatcher {

  static get isAvailable() {
    return blackList.indexOf(navigator.userAgent) === -1
     && !!navigator.getGamepads;
  }

  constructor(){
    super();
    this.currentDevices = [];
    this.currentDeviceIDs = [];
    this.currentManagers = {};
  }

  poll() {
    if(GamepadManager.isAvailable){
      var maybePads = navigator.getGamepads(),
        pads = [],
        padIDs = [],
        newPads = [],
        oldPads = [],
        i, padID;

      if (maybePads) {
        for (i = 0; i < maybePads.length; ++i) {
          var maybePad = maybePads[i];
          if (maybePad) {
            padID = Gamepad.ID(maybePad);
            var padIdx = this.currentDeviceIDs.indexOf(padID);
            pads.push(maybePad);
            padIDs.push(padID);
            if (padIdx === -1) {
              newPads.push(maybePad);
              this.currentDeviceIDs.push(padID);
              this.currentDevices.push(maybePad);
              delete this.currentManagers[padID];
            }
            else {
              this.currentDevices[padIdx] = maybePad;
            }
          }
        }
      }

      for (i = this.currentDeviceIDs.length - 1; i >= 0; --i) {
        padID = this.currentDeviceIDs[i];
        var mgr = this.currentManagers[padID],
          pad = this.currentDevices[i];
        if (padIDs.indexOf(padID) === -1) {
          oldPads.push(padID);
          this.currentDevices.splice(i, 1);
          this.currentDeviceIDs.splice(i, 1);
        }
        else if (mgr) {
          mgr.checkDevice(pad);
        }
      }

      newPads.forEach(this.emit.bind(this, "gamepadconnected"));
      oldPads.forEach(this.emit.bind(this, "gamepaddisconnected"));
    }
  }

  registerPad(id, mgr){
    this.currentManagers[id] = mgr;
  }

  get pads() {
    return this.currentDevices;
  }
}
