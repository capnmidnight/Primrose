/* global Primrose */
Primrose.OperatingSystems.OSX = ( function () {
  "use strict";

  return new Primrose.OperatingSystem(
      "OS X", "META", "ALT", "METASHIFT_z",
      "META", "LEFTARROW", "RIGHTARROW",
      "META", "UPARROW", "DOWNARROW" );
} )();
