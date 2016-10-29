////
// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
///
pliny.value({
  parent: "Primrose.Text.OperatingSystems",
  name: "OSX",
  description: "| [under construction]"
});
const Windows = new Primrose.Text.OperatingSystem(
  "Windows", "CTRL", "CTRL", "CTRL_y",
  "", "HOME", "END",
  "CTRL", "HOME", "END");