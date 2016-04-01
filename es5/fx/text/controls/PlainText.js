"use strict";

/* global Primrose, THREE, pliny */

Primrose.Text.Controls.PlainText = function () {

  pliny.class({
    parent: "Primrose.Text.Controls",
    name: "PlainText",
    description: "| [under construction]"
  });
  function PlainText(text, size, fgcolor, bgcolor, x, y, z, hAlign) {
    text = text.replace(/\r\n/g, "\n");
    var lines = text.split("\n");
    hAlign = hAlign || "center";
    var lineHeight = size * 1000;
    var boxHeight = lineHeight * lines.length;

    var textCanvas = document.createElement("canvas");
    var textContext = textCanvas.getContext("2d");
    textContext.font = lineHeight + "px Arial";
    var width = textContext.measureText(text).width;

    textCanvas.width = width;
    textCanvas.height = boxHeight;
    textContext.font = lineHeight * 0.8 + "px Arial";
    if (bgcolor !== "transparent") {
      textContext.fillStyle = bgcolor;
      textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
    }
    textContext.fillStyle = fgcolor;

    for (var i = 0; i < lines.length; ++i) {
      textContext.fillText(lines[i], 0, i * lineHeight);
    }

    var texture = new THREE.Texture(textCanvas);
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: bgcolor === "transparent",
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: THREE.FlatShading
    });

    var textGeometry = new THREE.PlaneGeometry(size * width / lineHeight, size * lines.length);
    textGeometry.computeBoundingBox();
    textGeometry.computeVertexNormals();

    var textMesh = new THREE.Mesh(textGeometry, material);
    if (hAlign === "left") {
      x -= textGeometry.boundingBox.min.x;
    } else if (hAlign === "right") {
      x += textGeometry.boundingBox.min.x;
    }
    textMesh.position.set(x, y, z);
    return textMesh;
  }

  return PlainText;
}();

pliny.issue({
  parent: "Primrose.Text.Controls.PlainText",
  name: "document PlainText",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Controls.PlainText](#Primrose_Text_Controls_PlainText) class in the controls/ directory"
});

pliny.issue({
  parent: "Primrose.Text.Controls.PlainText",
  name: "rename PlainText",
  type: "open",
  description: "The purpose of this control is to be an easier-to-use, simpler text area that doesn't support syntax highlighting or complex layout flows. It will probably be used most often in the single-line form."
});
