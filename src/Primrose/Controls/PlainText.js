/*
pliny.class({
  parent: "Primrose.Controls",
  name: "PlainText",
  description: "A texture that uses Canvas2D calls to draw simple, monochrome text to a polygon.",
  parameters: [{
    name: "text",
    type: "String",
    description: "The initial text to render on the PlainText control."
  }, {
    name: "size",
    type: "Number",
    description: "The font size at which to render the text."
  }, {
    name: "fgcolor",
    type: "String",
    description: "A Canvas2D fillStyle description to use for drawing the text."
  }, {
    name: "bgcolor",
    type: "String",
    description: "A Canvas2D fillStyle description to use for drawing the background behind the text."
  }, {
    name: "x",
    type: "Number",
    description: "The X component of the position at which to set the PlainText control's polygon mesh."
  }, {
    name: "y",
    type: "Number",
    description: "The Y component of the position at which to set the PlainText control's polygon mesh."
  }, {
    name: "z",
    type: "Number",
    description: "The Z component of the position at which to set the PlainText control's polygon mesh."
  }, {
    name: "hAlign",
    type: "String",
    description: "The horizontal alignment of the text, \"left\", \"center\", or \"right\".",
    optional: true,
    default: "center"
  }]
});
*/

import { PlaneGeometry, Mesh, Texture, MeshBasicMaterial, FlatShading } from "three";
export default class PlainText {
  constructor(text, size, fgcolor, bgcolor, x, y, z, hAlign = "center") {
    text = text.replace(/\r\n/g, "\n");
    var lines = text.split("\n");
    var lineHeight = (size * 1000);
    var boxHeight = lineHeight * lines.length;

    var textCanvas = document.createElement("canvas");
    var textContext = textCanvas.getContext("2d");
    textContext.font = lineHeight + "px Arial";
    var width = textContext.measureText(text)
      .width;

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

    var texture = new Texture(textCanvas);
    texture.needsUpdate = true;

    var material = new MeshBasicMaterial({
      map: texture,
      transparent: bgcolor === "transparent",
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: FlatShading
    });

    var textGeometry = new PlaneGeometry(size * width / lineHeight,
      size * lines.length);
    textGeometry.computeBoundingBox();
    textGeometry.computeVertexNormals();

    var textMesh = new Mesh(textGeometry, material);
    if (hAlign === "left") {
      x -= textGeometry.boundingBox.min.x;
    }
    else if (hAlign === "right") {
      x += textGeometry.boundingBox.min.x;
    }
    textMesh.position.set(x, y, z);
    return textMesh;
  }
}
