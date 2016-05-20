const FullScreen = (function () {
  "use strict";

  function left(n, str) {
    return str && str.substring(n);
  }

  const elementName = findProperty(document, ["fullscreenElement", "mozFullScreenElement", "webkitFullscreenElement", "msFullscreenElement"]),
    requestMethodName = findProperty(document.documentElement, ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen", "webkitRequestFullScreen", "msRequestFullscreen"]),
    exitMethodName = findProperty(document, ["exitFullscreen", "mozExitFullScreen", "webkitExitFullscreen", "webkitExitFullScreen", "msExitFullscreen"]),
    changeEventName = left(2, findProperty(document, ["onfullscreenchange", "onmozfullscreenchange", "onwebkitfullscreenchange", "onmsfullscreenchange"])),
    errorEventName = left(2, findProperty(document, ["onfullscreenerror", "onmozfullscreenerror", "onwebkitfullscreenerror", "onmsfullscreenerror"]));

  function withChange(act) {
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
        resolve(FullScreen.element);
      };

      onFullScreenError = (evt) => {
        setTimeout(tearDown);
        reject(evt);
      };

      FullScreen.addChangeListener(onFullScreen, false);
      FullScreen.addErrorListener(onFullScreenError, false);

      if (act()) {
        // we've already gotten fullscreen, so don't wait for it.
        tearDown();
        resolve(FullScreen.element);
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
  }

  pliny.namespace({
    name: "FullScreen",
    description: "| [under construction]"
  });
  class FullScreen {
    static addChangeListener(thunk, bubbles) {
      document.addEventListener(changeEventName, thunk, bubbles);
    }

    static removeChangeListener(thunk) {
      document.removeEventListener(changeEventName, thunk);
    }

    static addErrorListener(thunk, bubbles) {
      document.addEventListener(errorEventName, thunk, bubbles);
    }

    static removeErrorListener(thunk) {
      document.removeEventListener(errorEventName, thunk);
    }

    static request(elem, fullScreenParam) {
      return withChange(() => {
        if (!requestMethodName) {
          console.error("No Fullscreen API support.");
          throw new Error("No Fullscreen API support.");
        }
        else if (FullScreen.isActive) {
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
    }

    static exit() {
      return withChange(() => {
        if (!exitMethodName) {
          console.error("No Fullscreen API support.");
          throw new Error("No Fullscreen API support.");
        }
        else if (!FullScreen.isActive) {
          return true;
        }
        else {
          document[exitMethodName]();
        }
      });
    }

    static get element() {
      return document[elementName];
    }

    static get isActive() {
      return !!FullScreen.element;
    }
  }

  return FullScreen;
})();