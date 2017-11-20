/*
pliny.value({
  parent: "Flags",
  name: "isGearVR",
  type: "Boolean",
  description: "Flag indicating the application is running on the Samsung Gear VR in the Samsung Internet app."
});
*/

export default navigator.userAgent.indexOf("Mobile VR") > -1;
