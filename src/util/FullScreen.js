/*
pliny.class({
  parent: "Util",
  name: "FullScreenLockRequest",
  baseClass: "Util.AsyncLockRequest",
  description: "A cross browser/polyfill/mock implementation of the Fullscreen API. It includes a liar mode for systems that don't support the Fullscreen API, to make the handling of application logic more streamlined. This class itself is not exported, only a single instance of it."
});
*/

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

    if(!this.available) {
      // The other half of enabling using the back button to exit fullscreen.
      window.addEventListener("popstate", this.exit);
      this.addChangeListener(() => {
        // Cleanup after the state changes made to enable using the back button
        // to exit fullscreen.
        if(!this.isActive && document.location.hash === "#fullscreen") {
          history.back();
        }
      }, false);
    }
  }

  _onRequest() {
    // Supposedly makes iOS hide the address bar. IDK if that is actually true.
    // Web browsers on iOS are a garbage heap of dead sheep.
    window.scrollTo(0, 1);
  }

  _preDispatchChangeEvent() {
    // Enable using the back button to exit the fullscreen state.
    history.pushState(null, document.title, window.location.pathname + "#fullscreen");
  }
}

export default new FullScreenLockRequest();
