import haxClass from "./haxClass";
import haxFunction from "./haxFunction";

function injectIceServers(target, name) {
  haxClass(target, name, function(args) {
    if(!window.HAXICE) {
      window.HAXICE = args[0];
    }
    args[0] = args[0] || window.HAXICE;
  });
}

function injectUserMedia(target, name) {
  haxFunction(target, name, function(args) {
    args[0] = window.HAKBOX || args[0];
  });
}

injectIceServers(window, "RTCPeerConnection");
injectIceServers(window, "webkitRTCPeerConnection");

injectUserMedia(navigator, "webkitGetUserMedia");
injectUserMedia(navigator, "getUserMedia");
injectUserMedia(navigator.mediaDevices, "getUserMedia");
