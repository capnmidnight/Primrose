import CardboardVRDisplay from "./CardboardVRDisplay";
import MagicWindowVRDisplay from "./MagicWindowVRDisplay";
import MockVRDisplay from "./MockVRDisplay";
import NativeVRDisplay from "./NativeVRDisplay";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";
import PolyfilledVRFrameData from "./PolyfilledVRFrameData";
import StandardMonitorVRDisplay from "./StandardMonitorVRDisplay";

import { isMobile, isGearVR, isiOS } from "../../flags";

import { FullScreen } from "../../util";

import { getObject } from "../HTTP";

const allDisplays = [],
  isCardboardCompatible = isMobile && !isGearVR;

let polyFillDevicesPopulated = false,
  nativeDisplaysWrapped = false,
  standardMonitorPopulated = false,
  magicWindowPopulated = false,
  mockDisplayPopulated = false;

function getPolyfillDisplays(options) {
  if (!polyFillDevicesPopulated) {
    FullScreen.addChangeListener(fireVRDisplayPresentChange);
    if (isCardboardCompatible || options.forceStereo) {
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
  const event = new CustomEvent('vrdisplaypresentchange', {detail: {vrdisplay: this}});
  window.dispatchEvent(event);
}

function polyfillWebVR(options){
  if(!("VRDisplay" in window)){
    console.log("Polyfilling WebVR");

    navigator.getVRDisplays = () => getPolyfillDisplays(options);

    window.VRDisplay = PolyfilledVRDisplay;

    Object.defineProperty(navigator, "vrEnabled", {
      get() {
        return isCardboardCompatible && FullScreen.available;
      }
    });
  }

  if(!("VRFrameData" in window)) {
    console.log("upgrade 1.0 to 1.1");
    // Provide the VRFrameData object.
    window.VRFrameData = PolyfilledVRFrameData;
  }
}

function wrapGetVRDisplays(thunk){
  const oldGetVRDisplays = navigator.getVRDisplays;
  navigator.getVRDisplays = () =>
    oldGetVRDisplays.call(navigator)
      .then(thunk);
}

function wrapNativeVRDisplays() {
  if(!nativeDisplaysWrapped) {
    wrapGetVRDisplays((displays) => {
      for(let i = 0; i < displays.length; ++i){
        if(!displays[i].isBaseVRDisplay){
          displays[i] = new NativeVRDisplay(displays[i]);
        }
      }
      return displays;
    });
    nativeDisplaysWrapped = true;
  }
}

function findDisplayOfType(Type, displays) {
  for(let i = 0; i < displays.length; ++i) {
    const dsp = displays[i];
    if(dsp instanceof Type) {
      return dsp;
    }
  }
  return false;
}

function prefixDisplays(Type, options) {
  wrapGetVRDisplays((displays) => {
    if (!findDisplayOfType(Type, displays)) {
      displays.unshift(new Type(options));
    }
    return displays;
  });
}

function installMagicWindow(options) {
  if(!magicWindowPopulated && !(options && options.disableMotion)) {
    prefixDisplays(MagicWindowVRDisplay, options);
    magicWindowPopulated = true;
  }
}

function installStandardMonitor() {
  if(!standardMonitorPopulated) {
    prefixDisplays(StandardMonitorVRDisplay);
    standardMonitorPopulated = true;
  }
}

function installMonoDisplay(options){
  if(!isGearVR) {

    if(options && options.defaultFOV) {
      MagicWindowVRDisplay.DEFAULT_FOV = options.defaultFOV;
      StandardMonitorVRDisplay.DEFAULT_FOV = options.defaultFOV;
    }

    if(isMobile) {
      installMagicWindow(options);
    }
    else{
      installStandardMonitor();
    }

  }
}

function installMockDisplay(options) {
  const data = options && options.replayData;
  if(data && !mockDisplayPopulated){
    wrapGetVRDisplays((displays) => {
      if (findDisplayOfType(MockVRDisplay, displays)) {
        return displays;
      }
      else {
        let dataReady = null;
        if (typeof data === "object") {
          dataReady = Promise.resolve(data);
        }
        else if (/\.json$/.test(data)) {
          dataReady = getObject(data);
        }
        else {
          dataReady = Promise.resolve(JSON.parse(data));
        }

        return dataReady
          .then((obj) => {
            displays.push(new MockVRDisplay(obj));
            return displays;
          })
      }
    });

    mockDisplayPopulated = true;
  }
}

export default function install(options) {
  options = Object.assign({
      // Forces availability of VR mode, even for non-mobile devices.
      FORCE_ENABLE_VR: false
    }, options);

  polyfillWebVR(options);
  wrapNativeVRDisplays();
  installMonoDisplay(options);
  installMockDisplay(options);
};
