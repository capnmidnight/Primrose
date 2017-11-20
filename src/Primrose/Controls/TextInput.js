/*
pliny.class({
  parent: "Primrose.Controls",
    name: "TextInput",
    description: "plain text input box.",
    baseClass: "Primrose.Controls.TextBox",
    parameters: [{
      name: "idOrCanvasOrContext",
      type: "String or HTMLCanvasElement or CanvasRenderingContext2D",
      description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created."
    }, {
      name: "options",
      type: "Object",
      description: "Named parameters for creating the TextInput."
    }]
});
*/

var COUNTER = 0;

import TextBox from "./TextBox";
import PlainText from "../Text/Grammars/PlainText";
import TextInputCommands from "../Text/CommandPacks/TextInput";
export default class TextInput extends TextBox {
  constructor(options) {
    super(Object.assign({}, {
        id: "Primrose.Controls.TextInput[" + (COUNTER++) + "]",
        padding: 5,
        singleLine: true,
        disableWordWrap: true,
        hideLineNumbers: true,
        hideScrollBars: true,
        tabWidth: 1,
        tokenizer: PlainText,
        commands: TextInputCommands
      }), options);

    this.passwordCharacter = this.options.passwordCharacter;
  }

  get value() {
    return super.value;
  }

  set value(v) {
    v = v || "";
    v = v.replace(/\r?\n/g, "");
    super.value = v;
  }

  get selectedText() {
    return super.selectedText;
  }

  set selectedText(v) {
    v = v || "";
    v = v.replace(/\r?\n/g, "");
    super.selectedText = v;
  }

  drawText(ctx, txt, x, y) {
    if (this.passwordCharacter) {
      var val = "";
      for (var i = 0; i < txt.length; ++i) {
        val += this.passwordCharacter;
      }
      txt = val;
    }
    super.drawText(ctx, txt, x, y);
  }
};
