var fs = require("fs"),
  through = require("through2");

module.exports = {
  carve: function (source, destination, callback) {
    fs.readFile(source, "utf-8", function (err, txt) {
      var matches,
        left = 0,
        outputLeft = "",
        outputRight = "",
        test = /pliny\.\w+/g;
      while (matches = test.exec(txt)) {
        var sub = txt.substring(left, matches.index);
        outputLeft += sub;
        var depth = 0, inString = false, found = false;
        for (left = matches.index + matches.length; left < txt.length; ++left) {
          if (txt[left] === "\"" && (left === 0 || txt[left - 1] !== "\\"))
            inString = !inString;
          if (!inString) {
            if (txt[left] === "(") {
              found = true;
              ++depth;
            }
            else if (txt[left] === ")")
              --depth;
          }
          if (depth === 0 && found)
            break;
        }
        while (left < txt.length && /[;\) \r\n]/.test(txt[left])) {
          left++;
        }

        outputRight += txt.substring(matches.index, left);
      }
      outputLeft += txt.substring(left);
      fs.writeFile(source, outputLeft, function () {
        fs.writeFile(destination, outputRight, callback);
      });
    });
  }
};