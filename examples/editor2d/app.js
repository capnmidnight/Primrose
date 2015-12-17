/*
 * Copyright (C) 2015 Sean
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global Primrose, isOSX */
var ed;
function init () {
  "use strict";
  ed = new Primrose.Text.Controls.TextBox( "editor", {
    autoBindEvents: true,
    keyEventSource: window,
    tokenizer: Primrose.Text.Grammars.Basic,
    theme: Primrose.Text.Themes.Dark,
    hideLineNumbers: true
  } );
  var running = false,
      inputCallback = null,
      currentEditIndex = 0,
      currentProgram = null;

  function toEnd (  ) {
    ed.selectionStart = ed.selectionEnd = ed.value.length;
    ed.scrollIntoView( ed.frontCursor );
  }

  function done () {
    if ( running ) {
      flush( );
      running = false;
      ed.setTokenizer( Primrose.Text.Grammars.Basic );
      ed.value = currentProgram;
      toEnd( );
    }
  }

  function clearScreen () {
    ed.selectionStart = ed.selectionEnd = 0;
    ed.value = "";
    return true;
  }

  function loadFile ( fileName, callback ) {
    GET( fileName.toLowerCase(), "text", function ( file ) {
      if ( isOSX ) {
        file = file.replace( "CTRL+SHIFT+SPACE", "CMD+OPT+E" );
      }
      ed.value = currentProgram = file;
      if ( callback ) {
        callback();
      }
    } );
  }

  loadFile( "../oregon.bas" );

  function flush () {
    if ( buffer.length > 0 ) {
      ed.value += buffer;
      buffer = "";
    }
  }

  function input ( callback ) {
    flush();
    inputCallback = callback;
    toEnd( );
    currentEditIndex = ed.selectionStart;
  }

  var buffer = "";
  function stdout ( str ) {
    buffer += str;
    toEnd( );
  }

  ed.addEventListener( "keydown", function ( evt ) {
    if ( running && inputCallback && evt.keyCode === Primrose.Text.Keys.ENTER ) {
      var str = ed.value.substring( currentEditIndex );
      str = str.substring( 0, str.length - 1 );
      inputCallback( str );
      inputCallback = null;
    }
    else if ( !running &&
        ( !isOSX &&
            evt.ctrlKey &&
            evt.keyCode === Primrose.Text.Keys.ENTER ) ||
        ( isOSX &&
            evt.metaKey &&
            evt.altKey &&
            evt.keyCode === Primrose.Text.Keys.E ) ) {

      running = true;

      var next = function () {
        if ( running ) {
          setTimeout( looper, 1 );
        }
      };

      currentProgram = ed.value;
      var looper = Primrose.Text.Grammars.Basic.interpret( currentProgram, input,
          stdout, stdout, next, clearScreen, loadFile, done );
      ed.setTokenizer( Primrose.Text.Grammars.PlainText );
      clearScreen();
      next();
    }
  } );

  document.body.appendChild( ed.getDOMElement() );


  setInterval( ed.render.bind( ed ), 15 );
}
