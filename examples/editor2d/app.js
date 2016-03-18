/* global Primrose */

"use strict";
var ed = new Primrose.Text.Controls.TextBox({
  id: "editor",
  autoBindEvents: true,
  keyEventSource: window
}),
  editorContainer = document.querySelector("#editorContainer");

function loadFile ( fileName ) {
  Primrose.HTTP.get( "text", fileName, function ( file ) {
    ed.value = file;
    ed.focus();
  } );
}

loadFile( "/examples/music/app.js" );
editorContainer.appendChild(ed.canvas);

if (!isInIFrame) {
  var header = document.querySelector("header");
  editorContainer.style.top = header.clientHeight + "px";
}

window.addEventListener("resize", ed.resize.bind(ed), false);
ed.resize();