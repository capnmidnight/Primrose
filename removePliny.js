var fs = require("fs");

var q = ["src"];

while(q.length > 0){
  var next = q.shift();
  var files = fs.readdirSync(next);
  files.forEach(function(f) {
    f = next + "/" + f;
    var stat = fs.lstatSync(f);
    if(stat.isDirectory()){
      q.push(f);
    }
    else{
      rewrite(f);
    }
  });
}

function rewrite(f){
  var text = fs.readFileSync(f, "utf8");
  var pattern = /pliny\.\w+\(/g;
  var match = pattern.exec(text);
  var last = 0;
  var output = "";
  while(match) {
    var part = text.substring(last, match.index);
    if(part.indexOf("pliny.") > -1) {
      console.log(f, part);
    }
    output += part;
    var start = match.index + match[0].length;
    var end = 0;
    var parens = 1;
    var inString = false;
    var lastDelim = null;
    for(var i = start; i < text.length && parens > 0; ++i) {
      var isDelim = text[i] === '"' || text[i] === '`' || text[i] === "'";
      if(!inString) {
        if(isDelim) {
          inString = true;
          lastDelim = text[i];
        }
        else if(text[i] === '(') {
          ++parens;
        }
        else if(text[i] === ')') {
          --parens;
        }
      }
      else if(isDelim && text[i] === lastDelim) {
        inString = false;
      }

      if(parens === 0){
        end = i + 1;
        while(text[end] === ';' || text[end] === '\n') {
          ++end;
        }
      }
    }

    if(end > start) {
      output += "/*\n";
      output += text.substring(match.index, end).replace(/\*\//g, "* /");
      output += "\n*/";
      match.lastIndex = last = end;
      match = pattern.exec(text);
    }
    else {
      break;
    }
  }

  var leftover = text.substring(last);
  if(leftover.indexOf("pliny.") > -1) {
    console.log(f, leftover);
  }
  output += leftover;

  fs.writeFileSync(f, output);
}
