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

/* global rosetta_24_game, Assert, Primrose */

function editor2d () {
  "use strict";
//  addFullScreenShim(window);

  var editor = new Primrose.TextBox( "editor", {
    autoBindEvents: true,
    tokenizer: Primrose.Grammars.Basic,
    theme: Primrose.Themes.Dark,
    hideLineNumbers: true
  } );

  var running = false;
  var inputCallback = null;
  var currentIndex = 0;
  var currentProgram = null;

  function toEnd (  ) {
    editor.selectionStart = editor.selectionEnd = editor.value.length;
    editor.scrollIntoView( editor.frontCursor );
    editor.forceUpdate();
  }

  function done () {
    if ( running ) {
      running = false;
      editor.setTokenizer( Primrose.Grammars.Basic );
      editor.value = currentProgram;
      toEnd( );
    }
  }

  function clearScreen () {
    editor.selectionStart = editor.selectionEnd = 0;
    editor.value = "";
    return true;
  }

  function loadFile ( fileName, callback ) {
    GET( fileName.toLowerCase(), "text", function ( file ) {
      editor.value = currentProgram = file;
      if ( callback ) {
        callback();
      }
    } );
  }

  loadFile( "oregon.bas" );

  function input ( callback ) {
    inputCallback = callback;
    toEnd( );
    currentIndex = editor.selectionStart;
  }

  function stdout ( str ) {
    editor.value += str;
    toEnd( );
  }

  editor.addEventListener( "keydown", function ( evt ) {
    if ( running && inputCallback && evt.keyCode === Primrose.Keys.ENTER ) {
      var str = editor.value.substring( currentIndex );
      str = str.substring( 0, str.length - 1 );
      inputCallback( str );
      inputCallback = null;
    }
    else if ( !running &&
        evt.ctrlKey &&
        evt.keyCode === Primrose.Keys.ENTER ) {

      running = true;

      var next = function () {
        if ( running ) {
          setTimeout( looper, 1 );
        }
      };

      currentProgram = editor.value;
      var looper = Primrose.Grammars.Basic.interpret( currentProgram, input,
          stdout, stdout, next, clearScreen, loadFile, done );
      editor.setTokenizer( Primrose.Grammars.PlainText );
      clearScreen();
      next();
    }
  } );

  var container = document.getElementById( "editorContainer" );
  container.appendChild( editor.getDOMElement() );
}