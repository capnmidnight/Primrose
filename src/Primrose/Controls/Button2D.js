/*
pliny.class({
  parent: "Primrose.Controls",
  name: "Button2D",
  baseClass: "Primrose.Controls.Label",
  description: "A simple button to put on a Surface.",
  parameters: [{
    name: "idOrCanvasOrContext",
    type: "String or HTMLCanvasElement or CanvasRenderingContext2D",
    description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created."
  }, {
    name: "options",
    type: "Object",
    description: "Named parameters for creating the Button."
  }]
});
*/

var COUNTER = 0;

import Label from "./Label";
export default class Button2D extends Label {

  constructor(options) {
    super(Object.assign({}, {
      id: "Primrose.Controls.Button2D[" + (COUNTER++) + "]",
      textAlign: "center"
    }, options));
    this._lastActivated = null;
  }

  startPointer(x, y) {
    this.focus();
    this._activated = true;
    this.render();
  }

  endPointer() {
    if (this._activated) {
      this._activated = false;
      this.emit("click", {
        target: this
      });
      this.render();
    }
  }

  _isChanged() {
    var activatedChanged = this._activated !== this._lastActivated,
      changed = super._isChanged || activatedChanged;
    return changed;
  }

  renderCanvasTrim() {
    this.context.lineWidth = this._activated ? 4 : 2;
    this.context.strokeStyle = this.theme.regular.foreColor || Primrose.Text.Themes.Default.regular.foreColor;
    this.context.strokeRect(0, 0, this.imageWidth, this.imageHeight);
  }
}
