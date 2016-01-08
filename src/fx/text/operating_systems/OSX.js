/* global Primrose */

Primrose.Text.OperatingSystems.OSX = ( function () {
  "use strict";

  return new Primrose.Text.OperatingSystem(
      "OS X", "META", "ALT", "METASHIFT_z",
      "META", "LEFTARROW", "RIGHTARROW",
      "META", "UPARROW", "DOWNARROW" );
} )();
