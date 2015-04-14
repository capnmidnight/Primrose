window.Primrose = window.Primrose || { };
window.Primrose.Grammars = window.Primrose.Grammars || { };
window.Primrose.Grammars.TestResults = (function () {
  "use strict";
  
  return new Primrose.Grammar("TestResults", [
    ["newlines", /(?:\r\n|\r|\n)/],
    ["numbers", /(\[)(o+)/],
    ["numbers", /(\d+ succeeded), 0 failed/],
    ["numbers", /^    Successes:/],
    ["functions", /(x+)\]/],
    ["functions", /[1-9]\d* failed/],
    ["functions", /^    Failures:/],
    ["comments", /(\d+ms:)(.*)/],
    ["keywords", /(Test results for )(\w+):/],
    ["strings", /        \w+/]
  ]);
})();