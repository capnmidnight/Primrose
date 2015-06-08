/* global Primrose */
Primrose.UI.Text.CommandPack = ( function ( ) {
  "use strict";

  function CommandPack ( name, commands ) {
    this.name = name;
    copyObject(this, commands);
  }

  return CommandPack;
} )();
