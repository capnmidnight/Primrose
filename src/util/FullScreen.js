import AsyncLockRequest from "./AsyncLockRequest";
export default AsyncLockRequest(
  "Fullscreen",
  ["fullscreenElement", "mozFullScreenElement", "webkitFullscreenElement", "msFullscreenElement"],
  ["onfullscreenchange", "onmozfullscreenchange", "onwebkitfullscreenchange", "onmsfullscreenchange"],
  ["onfullscreenerror", "onmozfullscreenerror", "onwebkitfullscreenerror", "onmsfullscreenerror"],
  ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen", "webkitRequestFullScreen", "msRequestFullscreen"],
  ["exitFullscreen", "mozExitFullScreen", "webkitExitFullscreen", "webkitExitFullScreen", "msExitFullscreen"],
  (arg) => arg || (window.Element && window.Element.ALLOW_KEYBOARD_INPUT) || undefined);