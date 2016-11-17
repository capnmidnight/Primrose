pliny.namespace({
  parent: "Primrose",
  name: "Input",
  description: "The Input namespace contains classes that handle user input, for use in navigating the 3D environment."
});

import FPSInput from "./FPSInput";
import Gamepad from "./Gamepad";
import InputProcessor from "./InputProcessor";
import Keyboard from "./Keyboard";
import Location from "./Location";
import Mouse from "./Mouse";
import PoseInputProcessor from "./PoseInputProcessor";
import Speech from "./Speech";
import Touch from "./Touch";
import VR from "./VR";

export {
  FPSInput,
  Gamepad,
  InputProcessor,
  Keyboard,
  Location,
  Mouse,
  PoseInputProcessor,
  Speech,
  Touch,
  VR
};

export default {
  FPSInput,
  Gamepad,
  InputProcessor,
  Keyboard,
  Location,
  Mouse,
  PoseInputProcessor,
  Speech,
  Touch,
  VR
};