/* global Primrose */

"use strict";
var ed = new Primrose.Text.Controls.TextBox( "editor", {
  autoBindEvents: true,
  keyEventSource: window
} );

function loadFile ( fileName ) {
  Primrose.HTTP.get( fileName, "text", function ( file ) {
    ed.value = file;
    ed.focus();
  } );
}

loadFile( "/examples/music/app.js" );
document.body.appendChild( ed.DOMElement );
var anim = function () {
  requestAnimationFrame( anim );
  ed.render();
};
requestAnimationFrame( anim );
