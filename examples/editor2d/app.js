/* global Primrose */

"use strict";
var editorContainer = document.querySelector("#editorContainer");
document.body.style.backgroundColor = Primrose.Text.Themes.Default.regular.backColor;
function loadFile(fileName) {
  Primrose.HTTP
    .getText(fileName)
    .then(function (file) {
      editorContainer.innerHTML = Primrose.Text.Grammars.JavaScript.toHTML(file);
    });
}

loadFile("/examples/music/app.js");

if (!isInIFrame) {
  var header = document.querySelector("header");
  editorContainer.style.top = header.clientHeight + "px";
}