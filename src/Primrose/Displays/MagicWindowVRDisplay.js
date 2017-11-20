import FusionPoseSensor from "./SensorFusion/FusionPoseSensor";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";

export default class MagicWindowVRDisplay extends PolyfilledVRDisplay {

  constructor(options) {
    super("Magic Window");
    this._poseSensor = new FusionPoseSensor(options);
  }

  get isMagicWindowVRDisplay() {
    return true;
  }

  get isStereo() {
    return false;
  }

  _getPose() {
    return this._poseSensor.getPose();
  }
};
