import FullScreen from "./FullScreen";
import standardLockBehavior from "./standardLockBehavior";

export default function standardFullScreenBehavior(elem) {
  return FullScreen.request(elem)
    .then(standardLockBehavior)
    .catch((exp) => console.warn("FullScreen failed", exp));
};
