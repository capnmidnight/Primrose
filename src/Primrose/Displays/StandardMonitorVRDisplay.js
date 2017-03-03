import isMobile from "../../flags/isMobile";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";
import PolyfilledVRFrameData from "./PolyfilledVRFrameData";

let defaultFieldOfView = 100;

function calcFoV(aFoV, aDim, bDim){
  return 180 * Math.atan(Math.tan(aFoV * Math.PI / 180) * aDim / bDim) / Math.PI;
}

export default class StandardMonitorVRDisplay extends PolyfilledVRDisplay {

  static get DEFAULT_FOV () {
    return defaultFieldOfView;
  }

  static set DEFAULT_FOV (v) {
    defaultFieldOfView = v;
  }

  constructor(display, name) {
    super(name || "Full Screen");
    this.isStandardMonitorVRDisplay = true;
    this._display = display;
  }

  submitFrame() {
  }

  _getPose() {
    var display = isMobile && this._display;
    if(display){
      return display.getPose();
    }
  }

  resetPose(){
    var display = isMobile && this._display;
    if(display){
      return display.resetPose();
    }
  }

  get isStereo() {
    return false;
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

  get targetName () {
    return "Full Screen";
  }

  get renderOrder() {
    return 1;
  }
}
