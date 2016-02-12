/* global Primrose, pliny */

Primrose.Text.OperatingSystem = ( function ( ) {
  "use strict";

  function setCursorCommand ( obj, mod, key, func, cur ) {
    var name = mod + "_" + key;
    obj[name] = function ( prim, tokenRows ) {
      prim["cursor" + func]( tokenRows, prim[cur + "Cursor"] );
    };
  }

  function makeCursorCommand ( obj, baseMod, key, func ) {
    setCursorCommand( obj, baseMod || "NORMAL", key, func, "front" );
    setCursorCommand( obj, baseMod + "SHIFT", key, func, "back" );
  }

  pliny.class( "Primrose.Text", {
    name: "OperatingSystem",
    description: "<under construction>"
  } );
  function OperatingSystem ( name, pre1, pre2, redo, pre3, home, end, pre4, fullHome, fullEnd ) {
    this.name = name;

    this[pre1 + "_a"] = function ( prim, tokenRows ) {
      prim.frontCursor.fullhome( tokenRows );
      prim.backCursor.fullend( tokenRows );
    };

    this[redo] = function ( prim, tokenRows ) {
      prim.redo();
      prim.scrollIntoView( prim.frontCursor );
    };

    this[pre1 + "_z"] = function ( prim, tokenRows ) {
      prim.undo();
      prim.scrollIntoView( prim.frontCursor );
    };

    if ( pre1 + "_DOWNARROW" !== pre4 + "_" + fullEnd ) {
      this[pre1 + "_DOWNARROW"] = function ( prim, tokenRows ) {
        if ( prim.scroll.y < tokenRows.length ) {
          ++prim.scroll.y;
        }
      };
    }

    if ( pre1 + "_UPARROW" !== pre4 + "_" + fullHome ) {
      this[pre1 + "_UPARROW"] = function ( prim, tokenRows ) {
        if ( prim.scroll.y > 0 ) {
          --prim.scroll.y;
        }
      };
    }

    this.isClipboardReadingEvent = function ( evt ) {
      return evt[pre1.toLowerCase() + "Key"] && //meta or ctrl
          ( evt.keyCode === 67 || // C
              evt.keyCode === 88 ); // X
    };

    makeCursorCommand( this, "", "LEFTARROW", "Left" );
    makeCursorCommand( this, "", "RIGHTARROW", "Right" );
    makeCursorCommand( this, "", "UPARROW", "Up" );
    makeCursorCommand( this, "", "DOWNARROW", "Down" );
    makeCursorCommand( this, "", "PAGEUP", "PageUp" );
    makeCursorCommand( this, "", "PAGEDOWN", "PageDown" );
    makeCursorCommand( this, pre2, "LEFTARROW", "SkipLeft" );
    makeCursorCommand( this, pre2, "RIGHTARROW", "SkipRight" );
    makeCursorCommand( this, pre3, home, "Home" );
    makeCursorCommand( this, pre3, end, "End" );
    makeCursorCommand( this, pre4, fullHome, "FullHome" );
    makeCursorCommand( this, pre4, fullEnd, "FullEnd" );
  }

  return OperatingSystem;
} )();

pliny.issue( "Primrose.Text.OperatingSystem", {
  name: "document OperatingSystem",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.OperatingSystem](#Primrose_Text_OperatingSystem) class in the text/ directory"
} );
