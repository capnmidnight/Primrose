import pliny from "pliny/pliny";

pliny.class({
  parent: "Util",
  name: "FullScreenLockRequest",
  baseClass: "Util.AsyncLockRequest",
  description: "A cross browser/polyfill/mock implementation of the Fullscreen API. It includes a liar mode for systems that don't support the Fullscreen API, to make the handling of application logic more streamlined. This class itself is not exported, only a single instance of it."
});

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

      console.log("Mocking fullscreen API");

      this._elementName = "mockFullscreenElement";
      this._changeEventName = "mockfullscreenchange";
      this._errorEventName = "mockfullscreenerror";
      this._requestMethodName = "mockRequestFullscreen";
      this._exitMethodName = "mockExitFullscreen";

      // The Fullscreen API spec says the property should be `null` when not fullscreen,
      // not `undefined`.
      document[this._elementName] = null;

      // Mock out the request process. We have to use the `self` pattern because
      // we need to use the Element's `this` to set `document.mockFullscreenElement`
      // property to the element on which the fullscreen state was requested.
      const self = this;
      Element.prototype[this._requestMethodName] = function() {
        window.scrollTo(0, 1); // supposedly makes iOS hide the address bar. IDK if that is actually true. Web browsers on iOS are a garbage heap of dead sheep.

        // We kick out to a timeout so the rest of the processing from AsyncLockRequest
        // can take place and AsyncLockRequest can follow through.
        setTimeout(() => {
          // The FullScreen API specifies recording which element is actively in the
          // the fullscreen state.
          document[self._elementName] = this;

          // Enable using the back button to exit the fullscreen state.
          history.pushState(null, document.title, window.location.pathname + "#fullscreen");

          // Say we succeeded, even though we didn't really.
          document.dispatchEvent(new Event(self._changeEventName));
        });
      };

      // Mock out the exit process.
      document[this._exitMethodName] = () => {
        // We never actually succeeded in the first place, so just undo the state
        // changes we made when we lied in the first place.
        document[this._elementName] = null;
        document.dispatchEvent(new Event(this._changeEventName));
      };

      // The other half of enabling using the back button to exit fullscreen.
      window.addEventListener("popstate", this.exit);
      this.addChangeListener(() => {
        // Cleanup after the state changes made to enable using the back button
        // to exit fullscreen.
        if(!this.isActive && document.location.hash === "#fullscreen") {
          history.back();
        }
      }, false);

      // Enable using the escape key to exit fullscreen.
      window.addEventListener("keydown", (evt) => {
        if(evt.keyCode === 27) {
          this.exit();
        }
      });
    }
  }

  get available() {
    pliny.property({
      parent: "Util.FullScreenLockRequest",
      name: "available",
      type: "Boolean",
      description: "Returns true if the system actually supports the FullScreen API."
    })
    return !!(this._fullScreenEnabledProperty && document[this._fullScreenEnabledProperty]);
  }
}

export default new FullScreenLockRequest();
