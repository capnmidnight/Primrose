var fs = require("fs"),
  dir = require("./server/recurseDirectory");

var files = dir("src");
function process() {
  if (files.length === 0) {
    console.log("DONE");
  }
  else {
    var f = files.shift();
    fs.readFile(f, "utf8", function (err, txt) {
      console.log(f);
      var matches, left = 0, output = "",
        test = /pliny\.issue/g;
      while (matches = test.exec(txt)) {
        var sub = txt.substring(left, matches.index);
        output += sub;
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
      }
      output += txt.substring(left);
      fs.writeFile(f, output, process);
    });
  }
}
process();