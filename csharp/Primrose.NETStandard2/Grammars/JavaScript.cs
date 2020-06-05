/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "JavaScript",
  description: "A grammar for the JavaScript programming language."
});
*/
using System.Text.RegularExpressions;

namespace Primrose {
    public partial class Grammar {
        public static readonly Grammar JavaScript = new Grammar("JavaScript", new (string, Regex)[] {
            ("startBlockComments", new Regex("\\/\\*", RegexOptions.Compiled)),
            ("endBlockComments", new Regex("\\*\\/", RegexOptions.Compiled)),
            ("regexes", new Regex(" (?: ^|,|;|\\(|\\[|\\{)(?:\\s*)(\\/(?:\\\\\\/|[^\\n\\/])+\\/)", RegexOptions.Compiled)),
            ("stringDelim", new Regex("(\"|'|`)", RegexOptions.Compiled)),
            ("startLineComments", new Regex("\\/\\/.*$", RegexOptions.Multiline | RegexOptions.Compiled)),
            ("numbers", new Regex("-?(?:(?:\\b\\d*)?\\.)?\\b\\d+\\b", RegexOptions.Compiled)),
            ("keywords", new Regex("\\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\\b", RegexOptions.Compiled)),
            ("functions", new Regex("(\\w+)(?:\\s*\\()", RegexOptions.Compiled)),
            ("members", new Regex("(\\w+)\\.", RegexOptions.Compiled)),
            ("members", new Regex("((\\w+\\.)+)(\\w+)", RegexOptions.Compiled))
        });
    }
}