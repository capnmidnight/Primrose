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
define( function ( require ) {
  "use strict";

  var qp = require( "../../src/core" ),
      rosetta_24_game = require( "../rosetta_24_game" ),
      Primrose = require( "../../src/Primrose" ),
      Assert = require( "../../test/testing" ),
      Point = require( "../../test/Point" ),
      Size = require( "../../test/Size" ),
      Rectangle = require( "../../test/Rectangle" ),
      Grammar = require( "../../test/Grammar" ),
      ctrls = qp.findEverything(),
      editor = new Primrose( ctrls.editorCanvas, rosetta_24_game.toString() ),
      testText = [
        Point,
        Size,
        Rectangle,
        Grammar
      ].map( Assert.stringTest )
      .join(
          "\n===---===---===---===---===---===---===---===---===---===\n\n" ),
      tests = new Primrose( ctrls.testResultsCanvas, {
        file: testText,
        readOnly: true,
        tokenizer: Primrose.Grammars.TestResults,
        theme: Primrose.Themes.Dark
      } );

  editor.focus();

  function update () {
    requestAnimationFrame( update );
    editor.drawText();
    tests.drawText();
  }

  requestAnimationFrame( update );

  ctrls.controls.appendChild( editor.operatingSystemSelect );
  ctrls.controls.appendChild( editor.keyboardSelect );
  ctrls.controls.appendChild( editor.commandSystemSelect );
  ctrls.controls.appendChild( editor.tokenizerSelect );
  ctrls.controls.appendChild( editor.themeSelect );

  function onToggle ( e, f ) {
    e.addEventListener( "change", function () {
      editor["set" + f]( e.checked );
    } );
    e.checked = editor["get" + f]();
  }
  ;

  onToggle( ctrls.toggleLineNumbers, "ShowLineNumbers" );
  onToggle( ctrls.toggleScrollBars, "ShowScrollBars" );
  onToggle( ctrls.toggleWordWrap, "WordWrap" );
} );