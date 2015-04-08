/* 
 * Copyright (C) 2015 Sean
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

require([
  "../../src/core",
  "../rosetta_24_game",
  "../../src/themes/Dark",
  "../../src/Primrose",
  "../../test/testing",
  "../../test/Point",
  "../../test/Size",
  "../../test/Rectangle",
  "../../test/Grammar"], function (qp, rosetta_24_game, Themes, Primrose, Assert, Point, Size, Rectangle, Grammar) {
  "use strict";
  var ctrls = qp.findEverything();
  var editor = new Primrose(ctrls.editorCanvas);
  editor.value = rosetta_24_game.toString();

  var testText = [
    Point,
    Size,
    Rectangle,
    Grammar
  ].map(Assert.stringTest)
      .join(
          "\n===---===---===---===---===---===---===---===---===---===\n\n");
  var tests = new Primrose(ctrls.testResultsCanvas, {
    file: testText,
    readOnly: true,
    tokenizer: Grammar.TestResults,
    theme: Themes.Dark
  });

  editor.focus();

  function update() {
    requestAnimationFrame(update);
    editor.drawText();
    tests.drawText();
  }

  requestAnimationFrame(update);

  ctrls.controls.appendChild(editor.operatingSystemSelect);
  ctrls.controls.appendChild(editor.keyboardSelect);
  ctrls.controls.appendChild(editor.commandSystemSelect);
  ctrls.controls.appendChild(editor.tokenizerSelect);
  ctrls.controls.appendChild(editor.themeSelect);

  function onToggle(e, f) {
    e.addEventListener("change", function () {
      editor["set" + f](e.checked);
    });
    e.checked = editor["get" + f]();
  }
  ;

  onToggle(ctrls.toggleLineNumbers, "ShowLineNumbers");
  onToggle(ctrls.toggleScrollBars, "ShowScrollBars");
  onToggle(ctrls.toggleWordWrap, "WordWrap");
});