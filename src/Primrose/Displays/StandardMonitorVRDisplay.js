import isMobile from "../../flags/isMobile";
import VRDisplay from "./VRDisplay";
import getMonoscopicEyeParemtersMixin from "./getMonoscopicEyeParemtersMixin";

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
};

StandardMonitorVRDisplay.prototype.getEyeParameters = getMonoscopicEyeParemtersMixin;
