/*
pliny.class({
  parent: "Util",
  name: "PointerLockRequest",
  baseClass: "Util.AsyncLockRequest",
  description: "A cross browser/polyfill/mock implementation of the PointerLock API. It includes a liar mode for systems that don't support the PointerLock API, to make the handling of application logic more streamlined. This class itself is not exported, only a single instance of it."
});
*/

import AsyncLockRequest from "./AsyncLockRequest";

class PointerLockRequest extends AsyncLockRequest {
  constructor() {
    super(
      "Pointer Lock",
      ["pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"],
      ["onpointerlockchange", "onmozpointerlockchange", "onwebkitpointerlockchange"],
      ["onpointerlockerror", "onmozpointerlockerror", "onwebkitpointerlockerror"],
      ["requestPointerLock", "mozRequestPointerLock", "webkitRequestPointerLock", "webkitRequestPointerLock"],
      ["exitPointerLock", "mozExitPointerLock", "webkitExitPointerLock", "webkitExitPointerLock"]);
  }
}

export default new PointerLockRequest();
