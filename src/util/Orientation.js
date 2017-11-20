export function lock(element) {
  var type = screen.orientation && screen.orientation.type || screen.mozOrientation || "";
  if (type.indexOf("landscape") === -1) {
    type = "landscape-primary";
  }
  if (screen.orientation && screen.orientation.lock) {
    return screen.orientation.lock(type);
  }
  else if (screen.mozLockOrientation) {
    var locked = screen.mozLockOrientation(type);
    if (locked) {
      return Promise.resolve(element);
    }
  }
  else {
    return Promise.reject(new Error("Pointer lock not supported."));
  }
}

export function unlock() {
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
  else if (screen.mozUnlockOrientation) {
    screen.mozUnlockOrientation();
  }
}

export default {
  lock,
  unlock
};
