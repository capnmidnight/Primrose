/*
pliny.value({
  parent: "Primrose.Text.OperatingSystems",
  name: "macOS",
  description: "Keyboard shortcuts for Apple macOS nee OSX."
});
*/

import OperatingSystem from "./OperatingSystem";
export default new OperatingSystem(
  "macOS", "META", "ALT", "METASHIFT_z",
  "META", "LEFTARROW", "RIGHTARROW",
  "META", "UPARROW", "DOWNARROW");
