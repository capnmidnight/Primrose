import pliny from "pliny/pliny";

import AsyncLockRequest from "./AsyncLockRequest";
export default new AsyncLockRequest(
  "Pointer Lock",
  ["pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"],
  ["onpointerlockchange", "onmozpointerlockchange", "onwebkitpointerlockchange"],
  ["onpointerlockerror", "onmozpointerlockerror", "onwebkitpointerlockerror"],
  ["requestPointerLock", "mozRequestPointerLock", "webkitRequestPointerLock", "webkitRequestPointerLock"],
  ["exitPointerLock", "mozExitPointerLock", "webkitExitPointerLock", "webkitExitPointerLock"]);
