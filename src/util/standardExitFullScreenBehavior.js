import pliny from "pliny/pliny";

import standardUnlockBehavior from "./standardUnlockBehavior";
import FullScreen from "./FullScreen";

export default function standardExitFullScreenBehavior() {
  return standardUnlockBehavior()
    .then(() => FullScreen.exit())
    .catch((exp) => console.warn("FullScreen failed", exp));
};
