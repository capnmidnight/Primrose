import OperatingSystem from "./OperatingSystem";
pliny.value({
  parent: "Primrose.Text.OperatingSystems",
  name: "macOS",
  description: "Keyboard shortcuts for Apple macOS nee OSX."
});
export default macOS = new OperatingSystem(
  "macOS", "META", "ALT", "METASHIFT_z",
  "META", "LEFTARROW", "RIGHTARROW",
  "META", "UPARROW", "DOWNARROW");