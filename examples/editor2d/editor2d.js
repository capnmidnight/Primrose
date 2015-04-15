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

  var editor = new Primrose.TextBox( "editor", {
    file: "10 INPUT \"A value: \", X\n\
20 IF X < 1 THEN GOTO 60 ELSE PRINT \"HOKAY MANG\"\n\
30 IF X > 0 THEN PRINT \"FIZZ\" ELSE GOTO 10\n\
40 LET X = X - 1\n\
50 GOTO 30\n\
60 END",
    autoBindEvents: true,
    tokenizer: Primrose.Grammars.Basic,
    renderer: Primrose.Renderers.Canvas
  } );

  var running = false;
  var inputCallback = null;
  var currentIndex = 0;
  editor.addEventListener( "keydown", function ( evt ) {
    if ( evt.keyCode === Primrose.Keys.ENTER) {
      if(running && inputCallback){
        var str = editor.value.substring(currentIndex);
        str = str.substring(0, str.length - 1);
        inputCallback(str);
        inputCallback = null;
      }
      else if ( !running && evt.ctrlKey ) {
        running = true;
        var input = function ( callback ) {
          inputCallback = callback;
          currentIndex = editor.value.length;
          editor.selectionStart = editor.selectionEnd = currentIndex;
          editor.forceDraw();
        };
        var output = function ( str ) {
          editor.value += str;
        };
        var error = output;
        var next = function () {
          if ( running ) {
            setTimeout( looper, 1 );
          }
        };
        var done = function () {
          if ( running ) {
            output( "program complete\n" );
            running = false;
            editor.selectionStart = editor.selectionEnd = editor.value.length;
            editor.forceDraw();
          }
        };
        var looper = Primrose.Grammars.Basic.interpret( editor.value, input,
            output,
            error, next, done );
        editor.value += "\n";
        next();
      }
    }
  } );

  var testObjects = [
    Primrose.Grammars.Basic,
    Primrose.Grammar,
    Primrose.Point,
    Primrose.Rectangle,
    Primrose.Size
  ];

  var tests = new Primrose.TextBox( "testResults", {
    file: Assert.stringTest( testObjects ),
    readOnly: true,
    autoBindEvents: true,
    tokenizer: Primrose.Grammars.TestResults,
    theme: Primrose.Themes.Dark,
    renderer: Primrose.Renderers.Canvas
  } );

  var container = document.getElementById( "editorContainer" );
  container.appendChild( editor.getDOMElement() );
  container.appendChild( tests.getDOMElement() );

  editor.appendControls( document.getElementById( "controls" ) );
}