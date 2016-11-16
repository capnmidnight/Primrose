pliny.namespace({
  parent: "Primrose",
  name: "Input",
  description: "The Input namespace contains classes that handle user input, for use in navigating the 3D environment."
});

import { default as FPSInput } from "./FPSInput";
import { default as Gamepad } from "./Gamepad";
import { default as InputProcessor } from "./InputProcessor";
import { default as Keyboard } from "./Keyboard";
import { default as Location } from "./Location";
import { default as Mouse } from "./Mouse";
import { default as PoseInputProcessor } from "./PoseInputProcessor";
import { default as Speech } from "./Speech";
import { default as Touch } from "./Touch";
import { default as VR } from "./VR";

import * as Input from ".";
export default Input;