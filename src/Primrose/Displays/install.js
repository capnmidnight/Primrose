import pliny from "pliny";

import frameDataFromPose from "./frameDataFromPose";
import CardboardVRDisplay from "./CardboardVRDisplay";
import MockVRDisplay from "./MockVRDisplay";
import StandardMonitorVRDisplay from "./StandardMonitorVRDisplay";
import VRDisplay from "./VRDisplay";
import VRFrameData from "./VRFrameData";

import { isMobile, isGearVR, isiOS } from "../../flags";

import { FullScreen } from "../../util";

import { getObject } from "../HTTP";

const hasNativeWebVR = "getVRDisplays" in navigator,
  allDisplays = [],
  isCardboardCompatible = isMobile && !isGearVR;

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
    if (isCardboardCompatible || options.forceStereo) {
      FullScreen.addChangeListener(fireVRDisplayPresentChange);
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

function fireVRDisplayPresentChange() {
  var event = new CustomEvent('vrdisplaypresentchange', {detail: {vrdisplay: this}});
  window.dispatchEvent(event);
}

function installPolyfill(options){
  let oldGetVRDisplays = null;
  if(hasNativeWebVR) {
    oldGetVRDisplays = navigator.getVRDisplays;
  }
  else{
    oldGetVRDisplays = () => Promise.resolve([]);
  }

  // Provide navigator.getVRDisplays.
  navigator.getVRDisplays = function () {
    return oldGetVRDisplays.call(navigator)
      .then((displays) => {
        if(displays.length === 0 || navigator.userAgent === "Mozilla/5.0 (Linux; Android 6.0.1; SM-G930V Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2664.0 Mobile Safari/537.36") {
          options.overrideOrientation = displays[0];
          return getPolyfillDisplays(options);
        }
        else {
          return displays;
        }
      });
    };

  // Provide the VRDisplay object.
  window.VRDisplay = window.VRDisplay || VRDisplay;

  // Provide navigator.vrEnabled.
  Object.defineProperty(navigator, "vrEnabled", {
    get: function () {
      return isCardboardCompatible &&
        (FullScreen.available || isiOS); // just fake it for iOS
    }
  });
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
            if(options && options.defaultFOV) {
              StandardMonitorVRDisplay.DEFAULT_FOV = options.defaultFOV;
            }
            displays.unshift(new StandardMonitorVRDisplay(displays[0]));
          }
          return displays;
        });
    };

    standardMonitorPopulated = true;
  }
}

function installMockDisplay(options) {
  var data = options && options.replayData;
  if(data){
    var oldGetVRDisplays = navigator.getVRDisplays;
    navigator.getVRDisplays = () => oldGetVRDisplays.call(navigator)
      .then((displays) => {
        const mockDeviceExists = displays
          .map((d) => d instanceof MockVRDisplay)
          .reduce((a, b) => a || b, false);

        if (mockDeviceExists) {
          return displays;
        }
        else {
          var done = (obj) => {
            displays.push(new MockVRDisplay(obj));
            resolve(displays);
          };

          if (typeof data === "object") {
            return Promise.resolve(data);
          }
          else if (/\.json$/.test(data)) {
            return getObject(data);
          }
          else {
            return Promise.resolve(JSON.parse(data));
          }
        }
      });
  }
}

export default function install(options) {
  options = Object.assign({
      // Forces availability of VR mode, even for non-mobile devices.
      FORCE_ENABLE_VR: false
    }, options);

  installPolyfill(options);
  installStandardMonitor(options);
  installMockDisplay(options);
  upgrade1_0_to_1_1();
};
