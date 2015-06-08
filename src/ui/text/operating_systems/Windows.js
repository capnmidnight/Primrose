// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
/* global Primrose */
Primrose.UI.Text.OperatingSystems.Windows = (function () {
  "use strict";

  return new Primrose.UI.Text.OperatingSystem(
      "Windows", "CTRL", "CTRL", "CTRL_y",
      "", "HOME", "END",
      "CTRL", "HOME", "END");
})();
