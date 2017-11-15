import pliny from "pliny/pliny";

import { isMobile } from "../../flags";
import mixinMonoscopicEyeParameters from "./mixinMonoscopicEyeParameters";
import PolyfilledVRDisplay from "./PolyfilledVRDisplay";

export default class MagicWindowVRDisplay extends PolyfilledVRDisplay {

  constructor(display) {
    super("Magic Window");
    this._display = display;
  }

  get isMagicWindowVRDisplay() {
    return true;
  }

  get isStereo() {
    return false;
  }

  submitFrame() {
    this._display.submitFrame();
  }

  makeVRFrameDataObject() {
    return this._display.makeVRFrameDataObject();
  }

  getFrameData(frameData) {
    this._display.getFrameData(frameData);
  }
};

mixinMonoscopicEyeParameters(MagicWindowVRDisplay);
