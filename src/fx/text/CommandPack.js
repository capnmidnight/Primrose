Primrose.Text.CommandPack = ( function ( ) {
  "use strict";

  pliny.class({
    parent: "Primrose.Text",
    name: "CommandPack",
    description: "| [under construction]"
  } );
  function CommandPack ( name, commands ) {
    this.name = name;
    copyObject(this, commands);
  }

  return CommandPack;
} )();

