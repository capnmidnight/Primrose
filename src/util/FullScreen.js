import pliny from "pliny";

import AsyncLockRequest from "./AsyncLockRequest";
import findProperty from "./findProperty";

class FullScreenLockRequest extends AsyncLockRequest {
  constructor() {
    // Notice the spelling difference for the Mozilla cases. They require a capital S for Screen.
    super("Fullscreen", [
              "fullscreenElement",
            "msFullscreenElement",
           "mozFullScreenElement",
        "webkitFullscreenElement"
      ], [
              "onfullscreenchange",
            "onmsfullscreenchange",
           "onmozfullscreenchange",
        "onwebkitfullscreenchange"
      ], [
              "onfullscreenerror",
            "onmsfullscreenerror",
           "onmozfullscreenerror",
        "onwebkitfullscreenerror"
      ], [
              "requestFullscreen",
            "msRequestFullscreen",
           "mozRequestFullScreen",
        "webkitRequestFullscreen"
      ], [
              "exitFullscreen",
            "msExitFullscreen",
           "mozExitFullScreen",
        "webkitExitFullscreen"
      ]);

    this._fullScreenEnabledProperty = findProperty(document, [
            "fullscreenEnabled",
          "msFullscreenEnabled",
         "mozFullScreenEnabled",
      "webkitFullscreenEnabled"
    ]);
  }

  get available() {
    return !!(this._fullScreenEnabledProperty && document[this._fullScreenEnabledProperty]);
  }
}

export default new FullScreenLockRequest();
