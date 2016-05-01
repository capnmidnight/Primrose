Primrose.Text.Controls.TextInput = (function () {
  "use strict";

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.Text.Controls",
    name: "TextInput",
    description: "plain text input box.",
    baseClass: "Primrose.Text.Controls.TextBox",
    parameters: [
      { name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." },
      { name: "options", type: "Object", description: "Named parameters for creating the TextInput." }
    ]
  });
  class TextInput extends Primrose.Text.Controls.TextBox {
    constructor(options) {
      super(overwrite(
        patch(options, {
          id: "Primrose.Text.Controls.TextInput[" + (COUNTER++) + "]",
          padding: 5
        }), {
          singleLine: true,
          disableWordWrap: true,
          hideLineNumbers: true,
          hideScrollBars: true,
          tabWidth: 1,
          tokenizer: Primrose.Text.Grammars.PlainText,
          commands: Primrose.Text.CommandPacks.TextInput
        }));

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
  }

  return TextInput;
})();

