window.Primrose = window.Primrose || { };
window.Primrose.CommandPack = ( function ( ) {
  "use strict";

  function CommandPack ( name, commands ) {
    this.name = name;
    copyObject(this, commands);
  }

  return CommandPack;
} )();