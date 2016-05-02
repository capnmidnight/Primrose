"use strict";

Primrose.Text.OperatingSystems.OSX = function () {
  "use strict";

  pliny.value({
    parent: "Primrose.Text.OperatingSystems",
    name: "OSX",
    description: "| [under construction]"
  });
  return new Primrose.Text.OperatingSystem("OS X", "META", "ALT", "METASHIFT_z", "META", "LEFTARROW", "RIGHTARROW", "META", "UPARROW", "DOWNARROW");
}();