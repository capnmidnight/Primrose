"use strict";

function withFullScreenChange(act) {
  return new Promise(function (resolve, reject) {
    var onFullScreen,
        onFullScreenError,
        timeout,
        tearDown = function tearDown() {
      clearTimeout(timeout);
      window.removeEventListener("fullscreenchange", onFullScreen);
      window.removeEventListener("webkitfullscreenchange", onFullScreen);
      window.removeEventListener("mozfullscreenchange", onFullScreen);
      window.removeEventListener("msfullscreenchange", onFullScreen);

      window.removeEventListener("fullscreenerror", onFullScreenError);
      window.removeEventListener("webkitfullscreenerror", onFullScreenError);
      window.removeEventListener("mozfullscreenerror", onFullScreenError);
      window.removeEventListener("msfullscreenerror", onFullScreenError);
    };

    onFullScreen = function onFullScreen() {
      setTimeout(tearDown);
      resolve(document.webkitFullscreenElement || document.fullscreenElement);
    };

    onFullScreenError = function onFullScreenError(evt) {
      setTimeout(tearDown);
      reject(evt);
    };

    window.addEventListener("fullscreenchange", onFullScreen, false);
    window.addEventListener("webkitfullscreenchange", onFullScreen, false);
    window.addEventListener("mozfullscreenchange", onFullScreen, false);
    window.addEventListener("msfullscreenchange", onFullScreen, false);

    window.addEventListener("fullscreenerror", onFullScreenError, false);
    window.addEventListener("webkitfullscreenerror", onFullScreenError, false);
    window.addEventListener("mozfullscreenerror", onFullScreenError, false);
    window.addEventListener("msfullscreenerror", onFullScreenError, false);

    act();

    // Timeout wating on the fullscreen to happen, for systems like iOS that
    // don't properly support it, even though they say they do.
    timeout = setTimeout(reject, 1000);
  });
}

function requestFullScreen(elem, fullScreenParam) {
  return new Promise(function (resolve, reject) {
    withFullScreenChange(function () {
      if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(fullScreenParam || window.Element.ALLOW_KEYBOARD_INPUT);
      } else if (elem.mozRequestFullScreen && fullScreenParam) {
        elem.mozRequestFullScreen(fullScreenParam);
      } else if (elem.mozRequestFullScreen && !fullScreenParam) {
        elem.mozRequestFullScreen();
      } else if (elem.requestFullScreen) {
        elem.requestFullScreen();
      } else {
        reject();
      }
    }).then(resolve).catch(reject);
  });
}

function exitFullScreen() {
  return new Promise(function (resolve, reject) {
    withFullScreenChange(function () {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else {
        reject();
      }
    }).then(resolve).catch(reject);
  });
}
