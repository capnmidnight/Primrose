/* global Primrose, pliny */

////
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
///
Primrose.Text.CommandPacks.TestViewer = ( function () {
  "use strict";

  pliny.record( "Primrose.Text.CommandPacks", {
    name: "TestViewer",
    description: "<under construction>"
  } );
  return {
    name: "Basic commands",
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
      var indent = "";
      var tokenRow = tokenRows[prim.frontCursor.y];
      if ( tokenRow.length > 0 && tokenRow[0].type === "whitespace" ) {
        indent = tokenRow[0].value;
      }
      prim.selectedText = "\n" + indent;
      prim.scrollIntoView( prim.frontCursor );
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
} )();

pliny.issue( "Primrose.Text.CommandPacks.TestViewer", {
  name: "document TestViewer",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CommandPacks.TestViewer](#Primrose_Text_CommandPacks_TestViewer) class in the command_packs/ directory"
} );
