// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
window.Primrose = window.Primrose || { };
window.Primrose.OperatingSystems = window.Primrose.OperatingSystems || { };
window.Primrose.OperatingSystems.OSX = ( function () {
  "use strict";

  return new Primrose.OperatingSystem(
      "OS X", "META", "ALT", "METASHIFT_z",
      "META", "LEFTARROW", "RIGHTARROW",
      "META", "UPARROW", "DOWNARROW" );
} )();