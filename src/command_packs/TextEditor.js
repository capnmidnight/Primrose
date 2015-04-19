// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
window.Primrose = window.Primrose || { };
window.Primrose.CommandPacks = window.Primrose.CommandPacks || { };
window.Primrose.CommandPacks.TextEditor = ( function () {
  "use strict";

  function TextEditor ( operatingSystem, codePage, editor ) {
    var commands = {
      NORMAL_SPACE: " ",
      SHIFT_SPACE: " ",
      NORMAL_BACKSPACE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.left( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_ENTER: function ( prim, tokenRows, currentToken ) {
        var indent = "";
        var tokenRow = tokenRows[prim.frontCursor.y];
        if ( tokenRow.length > 0 && tokenRow[0].type === "whitespace" ) {
          indent = tokenRow[0].value;
        }
        prim.overwriteText( "\n" + indent );
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.backCursor.right( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      SHIFT_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.home( tokenRows );
          prim.backCursor.end( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_TAB: function ( prim, tokenRows ) {
        var ts = prim.getTabString();
        prim.overwriteText( ts );
      }
    };

    var allCommands = { };

    copyObject( allCommands, codePage );
    copyObject( allCommands, operatingSystem );
    copyObject( allCommands, commands );

    for ( var key in allCommands ) {
      if ( allCommands.hasOwnProperty( key ) ) {
        var func = allCommands[key];
        if ( typeof func !== "function" ) {
          func = editor.overwriteText.bind( editor, func );
        }
        allCommands[key] = func;
      }
    }

    Primrose.CommandPack.call( this, "Text editor commands", allCommands );
  }
  inherit( TextEditor, Primrose.CommandPack );
  return TextEditor;
} )();