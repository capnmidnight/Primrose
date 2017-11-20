import FullScreen from "./FullScreen";
import standardLockBehavior from "./standardLockBehavior";

export default function standardFullScreenBehavior(elem) {
  return FullScreen.request(elem)
    .catch((exp) => console.warn("FullScreen failed", exp))
    .then(standardLockBehavior);
};
