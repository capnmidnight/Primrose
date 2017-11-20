import { isMobile } from "../flags";
import Orientation from "./Orientation";
import PointerLock from "./PointerLock";

export default function standardUnlockBehavior() {
  if (isMobile) {
    Orientation.unlock();
    return Promise.resolve();
  }
  else{
    return PointerLock.exit()
      .catch((exp) => console.warn("PointerLock exit failed", exp));
  }
};
