/*
pliny.value({
  parent: "Flags",
  name: "isCardboard",
  type: "Boolean",
  description: "Flag indicating the current system is a \"mobile\" device, but is not a Samsung Gear VR (or Google Daydream)."
});
*/

import isMobile from "./isMobile";
import isGearVR from "./isGearVR";


export default isMobile && !isGearVR;
