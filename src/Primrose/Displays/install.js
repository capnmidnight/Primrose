import CardboardVRDisplay from "./CardboardVRDisplay";
import VRDisplay from "./VRDisplay";
import VRFrameData from "./VRFrameData";
import frameDataFromPose from "./frameDataFromPose";
import isMobile from "../../flags/isMobile";
import isGearVR from "../../flags/isGearVR";
import StandardMonitorVRDisplay from "./StandardMonitorVRDisplay";

const hasNativeWebVR = "getVRDisplays" in navigator,
  allDisplays = [];

let polyFillDevicesPopulated = false,
  standardMonitorPopulated = false;

function upgrade1_0_to_1_1(){
  // Put a shim in place to update the API to 1.1 if needed.
  if ("VRDisplay" in window && !("VRFrameData" in window)) {
    // Provide the VRFrameData object.
    window.VRFrameData = VRFrameData;

    // A lot of Chrome builds don't have depthNear and depthFar, even
    // though they're in the WebVR 1.0 spec. Patch them in if they're not present.
    if(!("depthNear" in window.VRDisplay.prototype)) {
      window.VRDisplay.prototype.depthNear = 0.01;
    }

    if(!("depthFar" in window.VRDisplay.prototype)) {
      window.VRDisplay.prototype.depthFar = 10000.0;
    }

    window.VRDisplay.prototype.getFrameData = function(frameData) {
      return frameDataFromPose(frameData, this.getPose(), this);
    };
  }
}

function getPolyfillDisplays(options) {
  if (!polyFillDevicesPopulated) {
    if (isMobile || options.FORCE_ENABLE_VR) {
      allDisplays.push(new CardboardVRDisplay(options));
    }

    polyFillDevicesPopulated = true;
  }

  return new Promise(function(resolve, reject) {
    try {
      resolve(allDisplays);
    } catch (e) {
      reject(e);
    }
  });
}

function installPolyfill(options){
  if (!hasNativeWebVR) {
    // Provide navigator.getVRDisplays.
    navigator.getVRDisplays = getPolyfillDisplays.bind(window, options);

    // Provide the VRDisplay object.
    window.VRDisplay = VRDisplay;

    // Provide navigator.vrEnabled.
    var self = this;
    Object.defineProperty(navigator, "vrEnabled", {
      get: function () {
        return self.isCardboardCompatible() &&
          (document.fullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.webkitFullscreenEnabled ||
            false);
      }
    });

    // Provide the VRFrameData object.
    window.VRFrameData = VRFrameData;
  }
}

function installStandardMonitor(options) {
  if(!standardMonitorPopulated && !isGearVR){
    var oldGetVRDisplays = navigator.getVRDisplays;
    navigator.getVRDisplays = function () {
      return oldGetVRDisplays.call(navigator)
        .then((displays) => {
          var created = false;
          for(var i = 0; i < displays.length && !created; ++i){
            var dsp = displays[i];
            created = dsp instanceof StandardMonitorVRDisplay;
          }
          if (!created) {
            displays.unshift(new StandardMonitorVRDisplay(displays[0]));
          }
          return displays;
        });
    };

    standardMonitorPopulated = true;
  }
}

export default function install(options) {
  options = Object.assign({
      // Forces availability of VR mode, even for non-mobile devices.
      FORCE_ENABLE_VR: false
    }, options);

  installPolyfill(options);
  installStandardMonitor(options);
  upgrade1_0_to_1_1();
};