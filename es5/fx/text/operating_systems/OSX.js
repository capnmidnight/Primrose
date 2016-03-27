"use strict";

/* global Primrose, pliny */

Primrose.Text.OperatingSystems.OSX = function () {
  "use strict";

  pliny.value("Primrose.Text.OperatingSystems", {
    name: "OSX",
    description: "| [under construction]"
  });
  return new Primrose.Text.OperatingSystem("OS X", "META", "ALT", "METASHIFT_z", "META", "LEFTARROW", "RIGHTARROW", "META", "UPARROW", "DOWNARROW");
}();

pliny.issue("Primrose.Text.OperatingSystems.OSX", {
  name: "document OSX",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.OperatingSystems.OSX](#Primrose_Text_OperatingSystems_OSX) class in the operating_systems/ directory"
});
