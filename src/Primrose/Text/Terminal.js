/*
pliny.class({
  parent: "Primrose.Text",
    name: "Terminal",
    description: "| [under construction]"
});
*/

import { isMacOS } from "../../flags";

import getText from "../HTTP/getText";
import PlainText from "./Grammars/PlainText";

export default class Terminal {
  constructor(inputEditor, outputEditor) {
    outputEditor = outputEditor || inputEditor;

    var inputCallback = null,
      currentProgram = null,
      originalGrammar = null,
      currentEditIndex = 0,
      pageSize = 40,
      outputQueue = [],
      buffer = "",
      restoreInput = inputEditor === outputEditor,
      self = this;

    this.running = false;
    this.waitingForInput = false;

    function toEnd(editor) {
      editor.selectionStart = editor.selectionEnd = editor.value.length;
      editor.scrollIntoView(editor.frontCursor);
    }

    function done() {
      if (self.running) {
        flush();
        self.running = false;
        if (restoreInput) {
          inputEditor.tokenizer = originalGrammar;
          inputEditor.value = currentProgram;
        }
        toEnd(inputEditor);
      }
    }

    function clearScreen() {
      outputEditor.selectionStart = outputEditor.selectionEnd = 0;
      outputEditor.value = "";
      return true;
    }

    function flush() {
      if (buffer.length > 0) {
        var lines = buffer.split("\n");
        for (var i = 0; i < pageSize && lines.length > 0; ++i) {
          outputQueue.push(lines.shift());
        }
        if (lines.length > 0) {
          outputQueue.push(" ----- more -----");
        }
        buffer = lines.join("\n");
      }
    }

    function input(callback) {
      inputCallback = callback;
      self.waitingForInput = true;
      flush();
    }

    function stdout(str) {
      buffer += str;
    }

    this.sendInput = function (evt) {
      if (buffer.length > 0) {
        flush();
      }
      else {
        outputEditor.keyDown(evt);
        var str = outputEditor.value.substring(currentEditIndex);
        inputCallback(str.trim());
        inputCallback = null;
        this.waitingForInput = false;
      }
    };

    this.execute = function () {
      pageSize = 10;
      originalGrammar = inputEditor.tokenizer;
      if (originalGrammar && originalGrammar.interpret) {
        this.running = true;
        var looper,
          next = function () {
            if (self.running) {
              setTimeout(looper, 1);
            }
          };

        currentProgram = inputEditor.value;
        looper = originalGrammar.interpret(currentProgram, input, stdout,
          stdout, next, clearScreen, this.loadFile.bind(this), done);
        outputEditor.tokenizer = PlainText;
        clearScreen();
        next();
      }
    };

    this.loadFile = function (fileName) {
      return getText(fileName.toLowerCase())
        .then(function (file) {
          if (isMacOS) {
            file = file.replace("CTRL+SHIFT+SPACE", "CMD+OPT+E");
          }
          inputEditor.value = currentProgram = file;
          return file;
        });
    };

    this.update = function () {
      if (outputQueue.length > 0) {
        outputEditor.value += outputQueue.shift() + "\n";
        toEnd(outputEditor);
        currentEditIndex = outputEditor.selectionStart;
      }
    };
  }
}
