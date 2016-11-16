import OperatingSystem from "./OperatingSystem";
pliny.value({
  parent: "Primrose.Text.OperatingSystems",
  name: "Windows",
  description: "Keyboard shortcuts for the Windows operating system."
});
export default Windows = new OperatingSystem(
  "Windows", "CTRL", "CTRL", "CTRL_y",
  "", "HOME", "END",
  "CTRL", "HOME", "END");