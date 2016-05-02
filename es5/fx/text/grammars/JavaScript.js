"use strict";

Primrose.Text.Grammars.JavaScript = function () {
  "use strict";

  pliny.value({
    parent: "Primrose.Text.Grammars",
    name: "JavaScript",
    description: "| [under construction]"
  });
  return new Primrose.Text.Grammar("JavaScript", [["newlines", /(?:\r\n|\r|\n)/], ["startBlockComments", /\/\*/], ["endBlockComments", /\*\//], ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/], ["stringDelim", /("|')/], ["startLineComments", /\/\/.*$/m], ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/], ["keywords", /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/], ["functions", /(\w+)(?:\s*\()/], ["members", /(\w+)\./], ["members", /((\w+\.)+)(\w+)/]]);
}();