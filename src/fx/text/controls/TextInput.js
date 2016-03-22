/* global qp, Primrose, isOSX, isIE, isOpera, isChrome, isFirefox, isSafari, devicePixelRatio, HTMLCanvasElement, pliny */

Primrose.Text.Controls.TextInput = (function () {
  "use strict";

  var COUNTER = 0;

  pliny.class("Primrose.Text.Controls", {
    name: "TextInput",
    description: "plain text input box.",
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
  }

  return TextInput;
})();

pliny.issue("Primrose.Text.Controls.TextInput", {
  name: "document TextInput",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Controls.TextInput](#Primrose_Text_Controls_TextInput)\n\
class in the controls/ directory."
});

pliny.issue("Primrose.Text.Controls.TextInput", {
  name: "TextInput does not render blank lines",
  type: "open",
  description: "If a line contains only a newline character, the line doesn't get\n\
rendered at all. The next line gets rendered instead, with the line number it *would*\n\
have had, had the blank line been rendered. Adding whitespace to the line causes\n\
it to render. This seems to only happen for text that is loaded into the textbox,\n\
not text that is entered by the keyboard."
});

pliny.issue("Primrose.Text.Controls.TextInput", {
  name: "TextInput should re-render only on updates, not require an animation loop.",
  type: "open",
  description: "Currently, the TextInput knows quite a bit about when it needs to\n\
update, but it doesn't use this information to actually kick off a render. It first\n\
requires us to ask it to render, and then it decides if it's time to render. Instead,\n\
the invalidation that causes it to decide to render should just kick off a render."
});