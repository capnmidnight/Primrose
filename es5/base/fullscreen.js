"use strict";

var FullScreen = function () {
  "use strict";

  var elementName = findProperty(document, ["fullscreenElement", "mozFullScreenElement", "webkitFullscreenElement", "msFullscreenElement"]),
      changeEventName = findProperty(document, ["onfullscreenchange", "onmozfullscreenchange", "onwebkitfullscreenchange", "onmsfullscreenchange"]),
      errorEventName = findProperty(document, ["onfullscreenerror", "onmozfullscreenerror", "onwebkitfullscreenerror", "onmsfullscreenerror"]),
      requestMethodName = findProperty(document.documentElement, ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen", "webkitRequestFullScreen", "msRequestFullscreen"]),
      exitMethodName = findProperty(document, ["exitFullscreen", "mozExitFullScreen", "webkitExitFullscreen", "webkitExitFullScreen", "msExitFullscreen"]);

  changeEventName = changeEventName && changeEventName.substring(2);
  errorEventName = errorEventName && errorEventName.substring(2);

  var ns = {
    addChangeListener: function addChangeListener(thunk, bubbles) {
      return document.addEventListener(changeEventName, thunk, bubbles);
    },
    removeChangeListener: function removeChangeListener(thunk) {
      return document.removeEventListener(changeEventName, thunk);
    },
    addErrorListener: function addErrorListener(thunk, bubbles) {
      return document.addEventListener(errorEventName, thunk, bubbles);
    },
    removeErrorListener: function removeErrorListener(thunk) {
      return document.removeEventListener(errorEventName, thunk);
    },
    withChange: function withChange(act) {
      return new Promise(function (resolve, reject) {
        var onFullScreen,
            onFullScreenError,
            timeout,
            tearDown = function tearDown() {
          if (timeout) {
            clearTimeout(timeout);
          }
          FullScreen.removeChangeListener(onFullScreen);
          FullScreen.removeErrorListener(onFullScreenError);
        };

        onFullScreen = function onFullScreen() {
          setTimeout(tearDown);
          resolve(FullScreen.element);
        };

        onFullScreenError = function onFullScreenError(evt) {
          setTimeout(tearDown);
          reject(evt);
        };

        FullScreen.addChangeListener(onFullScreen, false);
        FullScreen.addErrorListener(onFullScreenError, false);

        if (act()) {
          // we've already gotten fullscreen, so don't wait for it.
          tearDown();
          resolve(FullScreen.element);
        } else {
          // Timeout wating on the fullscreen to happen, for systems like iOS that
          // don't properly support it, even though they say they do.
          timeout = setTimeout(function () {
            tearDown();
            reject("Fullscreen state did not change in allotted time");
          }, 1000);
        }
      });
    },
    request: function request(elem, fullScreenParam) {
      return FullScreen.withChange(function () {
        if (!requestMethodName) {
          console.error("No Fullscreen API support.");
          throw new Error("No Fullscreen API support.");
        } else if (FullScreen.isActive) {
          return true;
        } else if (fullScreenParam) {
          elem[requestMethodName](fullScreenParam);
        } else if (isChrome) {
          elem[requestMethodName](window.Element.ALLOW_KEYBOARD_INPUT);
        } else {
          elem[requestMethodName]();
        }
      });
    },
    exit: function exit() {
      return FullScreen.withChange(function () {
        if (!exitMethodName) {
          console.error("No Fullscreen API support.");
          throw new Error("No Fullscreen API support.");
        } else if (!FullScreen.isActive) {
          return true;
        } else {
          document[exitMethodName]();
        }
      });
    }
  };

  Object.defineProperties(ns, {
    element: {
      get: function get() {
        return document[elementName];
      }
    },
    isActive: {
      get: function get() {
        return !!FullScreen.element;
      }
    }
  });

  return ns;
}();