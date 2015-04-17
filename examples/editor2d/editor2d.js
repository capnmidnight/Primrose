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

  var EDITOR_CODE_KEY = "primrose-sample-code";

  var editor = new Primrose.TextBox( "editor", {
    file: getSetting( EDITOR_CODE_KEY,
        "rem print a circle\n\
1 input 'enter outer radius: ', r\n\
2 input 'enter inner radius: ', q\n\
3 if r > q then goto 10\n\
4 println 'outer radius must be larger than inner radius'\n\
5 goto 1\n\
rem\n\
rem\n\
rem use remarks to break up code\n\
rem\n\
rem\n\
10 let d = 2 * r + 1\n\
11 let y = 0\n\
20 if y >= d then goto 90\n\
30 let x = 0\n\
40 if x >= d then goto 70\n\
41 let dy = y - r\n\
42 let dx = x - r\n\
43 let z = dx * dx + dy * dy\n\
44 if q * q <= z and z <= r * r then print 'o' else print '.'\n\
50 let x = x + 1\n\
60 goto 40\n\
70 let y = y + 1\n\
71 println ''\n\
80 goto 20\n\
90 end\n\
rem hit ctrl+enter to run program\n\
rem what you see is what you get, there aren't many features\n\
rem to this simple BASIC clone" ),
    autoBindEvents: true,
    tokenizer: Primrose.Grammars.Basic,
    theme: Primrose.Themes.Dark,
    hideLineNumbers: true
  } );

  var output = new Primrose.TextBox( "testResults", {
    file: "",
    autoBindEvents: true,
    tokenizer: Primrose.Grammars.PlainText,
    theme: Primrose.Themes.Dark,
    hideLineNumbers: true
  } );

  window.onbeforeunload = function ( ) {
    setSetting( EDITOR_CODE_KEY, editor.value );
  };

  var running = false;
  var inputCallback = null;
  var currentIndex = 0;

  output.addEventListener( "keydown", function ( evt ) {
    if ( running && inputCallback && evt.keyCode === Primrose.Keys.ENTER ) {
      var str = output.value.substring( currentIndex );
      str = str.substring( 0, str.length - 1 );
      inputCallback( str );
      inputCallback = null;
    }
  } );

  editor.addEventListener( "keydown", function ( evt ) {
    if ( !running &&
        evt.ctrlKey &&
        evt.keyCode === Primrose.Keys.ENTER ) {
      running = true;

      var input = function ( callback ) {
        inputCallback = callback;
        currentIndex = output.value.length;
        editor.blur();
        output.focus();
        output.selectionStart = output.selectionEnd = currentIndex;
        output.forceDraw();
      };

      var stdout = function ( str ) {
        output.value += str;
        output.selectionStart = output.selectionEnd = output.value.length;
        output.scrollIntoView(output.frontCursor);
      };

      var stderr = stdout;

      var next = function () {
        if ( running ) {
          setTimeout( looper, 1 );
        }
      };

      var done = function () {
        if ( running ) {
          stdout( "PROGRAM COMPLETE\n" );
          running = false;
          editor.selectionStart = editor.selectionEnd = editor.value.length;
          editor.forceDraw();
        }
      };

      var clearScreen = function(){
        output.selectionStart = output.selectionEnd = 0;
        output.value = "";
        return true;
      };

      var loadFile = function(fileName, callback){
        GET(fileName.toLowerCase(), "text", function(file){
          editor.value = file;
          callback();
        });
      };

      var looper = Primrose.Grammars.Basic.interpret( editor.value, input,
          stdout,
          stderr, next, done, clearScreen, loadFile );
      next();
    }
  } );

//  var testObjects = [
//    Primrose.Grammars.Basic,
//    Primrose.Grammar,
//    Primrose.Point,
//    Primrose.Rectangle,
//    Primrose.Size
//  ];
//
//  Assert.consoleTest( testObjects );

  var container = document.getElementById( "editorContainer" );
  container.appendChild( editor.getDOMElement() );
  container.appendChild( output.getDOMElement() );
}