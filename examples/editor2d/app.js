/* global Primrose */

"use strict";
var editorContainer = document.querySelector("#editorContainer");
document.body.style.backgroundColor = Primrose.Text.Themes.Default.regular.backColor;

Primrose.HTTP.getText("/examples/music/app.js")
  .then(function (file) {
    editorContainer.innerHTML = Primrose.Text.Grammars.JavaScript.toHTML(file);
  });