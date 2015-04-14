// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
window.Primrose = window.Primrose || { };
window.Primrose.OperatingSystems = window.Primrose.OperatingSystems || {};
window.Primrose.Windows = (function () {
  "use strict";
  
  return new Primrose.OperatingSystem(
      "Windows", "CTRL", "CTRL", "CTRL_y",
      "", "HOME", "END",
      "CTRL", "HOME", "END");
})();
