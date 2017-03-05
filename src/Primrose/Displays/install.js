import CardboardVRDisplay from "./CardboardVRDisplay";
import MixedRealityVRDisplay from "./MixedRealityVRDisplay";
import MockVRDisplay from "./MockVRDisplay";
import NativeVRDisplay from "./NativeVRDisplay";
import StandardMonitorVRDisplay from "./StandardMonitorVRDisplay";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";
import PolyfilledVRFrameData from "./PolyfilledVRFrameData";

import isMobile from "../../flags/isMobile";
import isGearVR from "../../flags/isGearVR";
import isiOS from "../../flags/isiOS";

import FullScreen from "../../util/FullScreen";

import getObject from "../HTTP/getObject";

const hasNativeWebVR = "getVRDisplays" in navigator,
  isCardboardCompatible = isMobile && !isGearVR;

let standardMonitorPopulated = false;

function fireVRDisplayPresentChange() {
  var event = new CustomEvent('vrdisplaypresentchange', {detail: {vrdisplay: this}});
  window.dispatchEvent(event);
}

const isExperimentalChromium51 = navigator.userAgent.indexOf("Chrome/51.0.2664.0") > -1;

function installPolyfill(options){
  // Provide the VRDisplay object.
  window.VRDisplay = window.VRDisplay || PolyfilledVRDisplay;
  window.VRFrameData = window.VRFrameData || PolyfilledVRFrameData;

  // A lot of Chrome builds don't have depthNear and depthFar, even
  // though they're in the WebVR 1.0 spec. Patch them in if they're not present.
  if(!("depthNear" in window.VRDisplay.prototype)) {
    window.VRDisplay.prototype.depthNear = 0.01;
  }

  if(!("depthFar" in window.VRDisplay.prototype)) {
    window.VRDisplay.prototype.depthFar = 10000.0;
  }
}

function installDisplays(options) {
  if(!standardMonitorPopulated && !isGearVR){
    let oldGetVRDisplays = null;
    if(hasNativeWebVR) {
      oldGetVRDisplays = navigator.getVRDisplays;
    }
    else{
      oldGetVRDisplays = () => Promise.resolve([]);
    }
    
    navigator.getVRDisplays = function () {
      return oldGetVRDisplays.call(navigator)
        .then((displays) => {

          var stdDeviceExists = false,
            mockDeviceExists = false,
            data = options && options.replayData;

          for(var i = 0; i < displays.length; ++i){
            var dsp = displays[i];
            stdDeviceExists = stdDeviceExists || dsp instanceof StandardMonitorVRDisplay;
            mockDeviceExists = mockDeviceExists || dsp instanceof MockVRDisplay;
          }

          if (isCardboardCompatible || options.forceStereo) {
            FullScreen.addChangeListener(fireVRDisplayPresentChange);
            displays.push(new CardboardVRDisplay(options));
          }

          if (!stdDeviceExists) {
            if(options && options.defaultFOV) {
              StandardMonitorVRDisplay.DEFAULT_FOV = options.defaultFOV;
            }

            const nativeDisplay = displays[0];
            if(nativeDisplay && !nativeDisplay.isPolyfilled) {
              displays[0] = new NativeVRDisplay(nativeDisplay);
              displays.unshift(new MixedRealityVRDisplay(nativeDisplay));
            }

            displays.unshift(new StandardMonitorVRDisplay(nativeDisplay));
          }

          if(data && !mockDeviceExists){
            displays.push(new MockVRDisplay(data));
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
  installDisplays(options);
};
