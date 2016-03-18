/* global Primrose, pliny */
 
//// 
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.TextInput = ( function () {
  "use strict";

  pliny.record( "Primrose.Text.CommandPacks", {
    name: "TextInput",
    description: "<under construction>"
  } );
  function TextInput ( operatingSystem, codePage, editor ) {
    var commands = {
      NORMAL_SPACE: " ",
      SHIFT_SPACE: " ",
      NORMAL_BACKSPACE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.left( tokenRows );
        }
        prim.selectedText = "";
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_ENTER: function ( prim, tokenRows, currentToken ) {
        emit.call(prim, "change", { target: prim });
      },
      NORMAL_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.backCursor.right( tokenRows );
        }
        prim.selectedText = "";
        prim.scrollIntoView( prim.frontCursor );
      },
      SHIFT_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.home( tokenRows );
          prim.backCursor.end( tokenRows );
        }
        prim.selectedText = "";
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_TAB: function ( prim, tokenRows ) {
        prim.selectedText = prim.tabString;
      }
    };

    var allCommands = {};

    copyObject( allCommands, codePage );
    copyObject( allCommands, operatingSystem );
    copyObject( allCommands, commands );
    function overwriteText ( ed, txt ) {
      ed.selectedText = txt;
    }
    for ( var key in allCommands ) {
      if ( allCommands.hasOwnProperty( key ) ) {
        var func = allCommands[key];
        if ( typeof func !== "function" ) {
          func = overwriteText.bind( null, editor, func );
        }
        allCommands[key] = func;
      }
    }

    Primrose.Text.CommandPack.call( this, "Text editor commands", allCommands );
  }
  inherit( TextInput, Primrose.Text.CommandPack );
  return TextInput;
} )();

pliny.issue( "Primrose.Text.CommandPacks.TextInput", {
  name: "document TextInput",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CommandPacks.TextInput](#Primrose_Text_CommandPacks_TextInput) class in the command_packs/ directory"
} );
