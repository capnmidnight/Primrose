import { isMobile, isiOS } from "../flags";
import Orientation from "./Orientation";
import PointerLock from "./PointerLock";

export default function standardLockBehavior(elem) {
  if(isiOS) {
    return Promise.resolve(elem);
  }
  else if (isMobile) {
    return Orientation.lock(elem)
      .catch((exp) => console.warn("OrientationLock failed", exp));
  }
  else {
    return PointerLock.request(elem)
      .catch((exp) => console.warn("PointerLock failed", exp));
  }
};
