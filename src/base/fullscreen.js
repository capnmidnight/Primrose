var FullScreen = (function () {
  "use strict";

  var elementName = findProperty(document, ["fullscreenElement", "mozFullScreenElement", "webkitFullscreenElement", "msFullscreenElement"]),
    changeEventName = findProperty(document, ["onfullscreenchange", "onmozfullscreenchange", "onwebkitfullscreenchange", "onmsfullscreenchange"]),
    errorEventName = findProperty(document, ["onfullscreenerror", "onmozfullscreenerror", "onwebkitfullscreenerror", "onmsfullscreenerror"]),
    requestMethodName = findProperty(document.documentElement, ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen", "webkitRequestFullScreen", "msRequestFullscreen"]),
    exitMethodName = findProperty(document, ["exitFullscreen", "mozExitFullScreen", "webkitExitFullscreen", "webkitExitFullScreen", "msExitFullscreen"]);

  changeEventName = changeEventName && changeEventName.substring(2);
  errorEventName = errorEventName && errorEventName.substring(2);

  return {
    addChangeListener: (thunk, bubbles) => document.addEventListener(changeEventName, thunk, bubbles),
    removeChangeListener: (thunk) => document.removeEventListener(changeEventName, thunk),
    addErrorListener: (thunk, bubbles) => document.addEventListener(errorEventName, thunk, bubbles),
    removeErrorListener: (thunk) => document.removeEventListener(errorEventName, thunk),
    getElement: () => document[elementName],
    withChange: (act) => {
      return new Promise((resolve, reject) => {
        var onFullScreen,
          onFullScreenError,
          timeout,
          tearDown = () => {
            if (timeout) {
              clearTimeout(timeout);
            }
            FullScreen.removeChangeListener(onFullScreen);
            FullScreen.removeErrorListener(onFullScreenError);
          };

        onFullScreen = () => {
          setTimeout(tearDown);
          resolve(FullScreen.getElement());
        };

        onFullScreenError = (evt) => {
          setTimeout(tearDown);
          reject(evt);
        };

        FullScreen.addChangeListener(onFullScreen, false);
        FullScreen.addErrorListener(onFullScreenError, false);

        if (act()) {
          tearDown();
          resolve();
        }
        else {      
          // Timeout wating on the fullscreen to happen, for systems like iOS that
          // don't properly support it, even though they say they do.
          timeout = setTimeout(() => {
            tearDown();
            reject("Fullscreen state did not change in allotted time");
          }, 1000);
        }
      });
    },
    request: (elem, fullScreenParam) => {
      return FullScreen.withChange(() => {
        if (!requestMethodName) {
          throw new Error("No Fullscreen API support.");
        }
        else if (FullScreen.getElement()) {
          return true;
        }
        else if (fullScreenParam) {
          elem[requestMethodName](fullScreenParam);
        }
        else if (isChrome) {
          elem[requestMethodName](window.Element.ALLOW_KEYBOARD_INPUT);
        } else {
          elem[requestMethodName]();
        }
      });
    },
    exit: () => {
      return FullScreen.withChange(() => {
        if (!exitMethodName) {
          throw new Error("No Fullscreen API support.");
        }
        else if (!FullScreen.getElement()) {
          return true;
        }
        else {
          document[exitMethodName]();
        }
      });
    }
  }
})();