/* global Primrose */

////
// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
///
Primrose.Text.OperatingSystems.Windows = (function () {
  "use strict";

  return new Primrose.Text.OperatingSystem(
      "Windows", "CTRL", "CTRL", "CTRL_y",
      "", "HOME", "END",
      "CTRL", "HOME", "END");
})();

pliny.issue( "Primrose.Text.OperatingSystems.Windows", {
  name: "document Windows",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.OperatingSystems.Windows](#Primrose_Text_OperatingSystems_Windows) class in the operating_systems/ directory"
} );
