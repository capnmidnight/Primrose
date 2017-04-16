import isMobile from "../../flags/isMobile";
import VRDisplay from "./VRDisplay";
import { Math as _Math } from "three";

const { DEG2RAD, RAD2DEG } = _Math;

let defaultFieldOfView = 100;

function defaultPose() {
  return {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1],
    linearVelocity: null,
    linearAcceleration: null,
    angularVelocity: null,
    angularAcceleration: null
  };
}

export default class StandardMonitorVRDisplay extends VRDisplay {

  static get DEFAULT_FOV () {
    return defaultFieldOfView;
  }

  static set DEFAULT_FOV (v) {
    defaultFieldOfView = v;
  }

  constructor(display) {
    super("Full Screen");
    this._display = display;
  }

  submitFrame(pose) {
    if(this._display && this._display.isPolyfilled) {
      this._display.submitFrame(pose);
    }
  }

  getPose() {
    var display = isMobile && this._display;
    if(display){
      return display.getPose();
    }
    else{
      return defaultPose();
    }
  }

  getEyeParameters (side) {
    if (side === "left") {
      const curLayer = this.getLayers()[0],
        elem = curLayer && curLayer.source || document.body,
        width = elem.clientWidth,
        height = elem.clientHeight;

      let vFOV, hFOV;
      if(height > width) {
        vFOV = defaultFieldOfView / 2,
        hFOV = calcFoV(vFOV, width, height);
      }
      else {
        hFOV = defaultFieldOfView / 2,
        vFOV = calcFoV(hFOV, height, width);
      }

      return {
        renderWidth: width * devicePixelRatio,
        renderHeight: height * devicePixelRatio,
        offset: new Float32Array([0, 0, 0]),
        fieldOfView: {
          upDegrees: vFOV,
          downDegrees: vFOV,
          leftDegrees: hFOV,
          rightDegrees: hFOV
        }
      };
    }
  }
}

function calcFoV(aFoV, aDim, bDim){
  return RAD2DEG * Math.atan(Math.tan(DEG2RAD * aFoV) * aDim / bDim);
}
