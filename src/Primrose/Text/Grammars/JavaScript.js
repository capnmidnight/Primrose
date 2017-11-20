/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "JavaScript",
  description: "A grammar for the JavaScript programming language."
});
*/

import Grammar from "./Grammar";
export default new Grammar("JavaScript", [
  ["newlines", /(?:\r\n|\r|\n)/],
  ["startBlockComments", /\/\*/],
  ["endBlockComments", /\*\//],
  ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/],
  ["stringDelim", /("|')/],
  ["startLineComments", /\/\/.*$/m],
  ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
  ["keywords",
    /\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
  ],
  ["functions", /(\w+)(?:\s*\()/],
  ["members", /(\w+)\./],
  ["members", /((\w+\.)+)(\w+)/]
]);
