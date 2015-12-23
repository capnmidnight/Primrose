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
    tokenizer: Primrose.Text.Grammars.JavaScript,
    theme: Primrose.Text.Themes.Default
  } );

  function loadFile ( fileName ) {
    GET( fileName, "text", function ( file ) {
      ed.value = file;
      ed.focus();
    } );
  }

  loadFile( "../sandbox/app.js" );
  document.body.appendChild( ed.getDOMElement() );
  setInterval( ed.render.bind( ed ), 15 );
}
