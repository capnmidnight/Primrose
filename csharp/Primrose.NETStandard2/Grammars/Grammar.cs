using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Primrose
{
    public partial class Grammar
    {
        public static readonly Dictionary<string, Grammar> grammars = new Dictionary<string, Grammar>() {
            {"basic", Basic },
            { "bas", Basic },
            { "html", HTML },
            { "javascript", JavaScript },
            { "js", JavaScript },
            { "plaintext", PlainText },
            { "txt", PlainText }
        };

        private static readonly (string type, Regex pattern)[] DefaultRules = new (string, Regex)[] {
            ( "newlines", new Regex("(?:\\r\\n|\\r|\\n)", RegexOptions.Compiled)),
            ( "whitespace", new Regex("(?:\\s+)", RegexOptions.Compiled) )
        };

        /// <summary>
        /// A user-friendly name for the grammar, to be able to include it in an options listing.
        /// </summary>
        public string name { get; }


        /*
        pliny.property({
          parent: "Primrose.Text.Grammar",
          name: "grammar",
          type: "Array",
          description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
        });
        */
        // clone the preprocessing grammar to start a new grammar
        private Rule[] grammar { get; }

        public Grammar(string grammarName, (string type, Regex pattern)[] rules)
        {
            name = grammarName;

            grammar = DefaultRules
                .Concat(rules)
                .Select((rule) =>
                new Rule(rule.type, rule.pattern))
                .ToArray();

        }

        /*
        pliny.method({
          parent: "Primrose.Text.Grammar",
          name: "tokenize",
          parameters: [{
            name: "text",
            type: "String",
            description: "The text to tokenize."
          }],
          returns: "An array of tokens, ammounting to drawing instructions to the renderer. However, they still need to be layed out to fit the bounds of the text area.",
          description: "Breaks plain text up into a list of tokens that can later be rendered with color.",
          examples: [{
            name: 'Tokenize some JavaScript',
            description: 'Primrose comes with a grammar for JavaScript built in.\n\
      \n\
      ## Code:\n\
      \n\
        grammar(\"JavaScript\");\n\
        var tokens = new Primrose.Text.Grammars.JavaScript\n\
          .tokenize("var x = 3;\\n\\\n\
        var y = 2;\\n\\\n\
        console.log(x + y);");\n\
        console.log(JSON.stringify(tokens));\n\
      \n\
      ## Result:\n\
      \n\
        grammar(\"JavaScript\");\n\
        [ \n\
          { "value": "var", "type": "keywords", "index": 0, "line": 0 },\n\
          { "value": " x = ", "type": "regular", "index": 3, "line": 0 },\n\
          { "value": "3", "type": "numbers", "index": 8, "line": 0 },\n\
          { "value": ";", "type": "regular", "index": 9, "line": 0 },\n\
          { "value": "\\n", "type": "newlines", "index": 10, "line": 0 },\n\
          { "value": " y = ", "type": "regular", "index": 11, "line": 1 },\n\
          { "value": "2", "type": "numbers", "index": 16, "line": 1 },\n\
          { "value": ";", "type": "regular", "index": 17, "line": 1 },\n\
          { "value": "\\n", "type": "newlines", "index": 18, "line": 1 },\n\
          { "value": "console", "type": "members", "index": 19, "line": 2 },\n\
          { "value": ".", "type": "regular", "index": 26, "line": 2 },\n\
          { "value": "log", "type": "functions", "index": 27, "line": 2 },\n\
          { "value": "(x + y);", "type": "regular", "index": 30, "line": 2 }\n\
        ]'
          }]
        });
        */
        public virtual List<Token> tokenize(string text)
        {
            // all text starts off as regular text, then gets cut up into tokens of
            // more specific type
            var tokens = new List<Token>();
            tokens.Add(new Token(text, "regular", 0));

            foreach (var rule in grammar)
            {
                for (var j = 0; j < tokens.Count; ++j)
                {
                    rule.carveOutMatchedToken(tokens, j);
                }
            }

            CrudeParsing(tokens);

            return tokens;
        }

        private void CrudeParsing(List<Token> tokens)
        {
            string commentDelim = null,
                stringDelim = null;
            for (var i = 0; i < tokens.Count; ++i)
            {
                var t = tokens[i];

                if (stringDelim != null)
                {
                    if (t.type == "stringDelim"
                        && t.value == stringDelim
                        && (i == 0
                            || tokens[i - 1].value[tokens[i - 1].length - 1] != '\\'))
                    {
                        stringDelim = null;
                    }

                    if (t.type != "newlines")
                    {
                        t.type = "strings";
                    }
                }
                else if (commentDelim != null)
                {
                    if (commentDelim == "startBlockComments" && t.type == "endBlockComments" ||
                        commentDelim == "startLineComments" && t.type == "newlines")
                    {
                        commentDelim = null;
                    }

                    if (t.type != "newlines")
                    {
                        t.type = "comments";
                    }
                }
                else if (t.type == "stringDelim")
                {
                    stringDelim = t.value;
                    t.type = "strings";
                }
                else if (t.type == "startBlockComments" || t.type == "startLineComments")
                {
                    commentDelim = t.type;
                    t.type = "comments";
                }
            }

            // recombine like-tokens
            for (var i = tokens.Count - 1; i > 0; --i)
            {
                Token p = tokens[i - 1],
                    t = tokens[i];
                if (p.type == t.type
                    && p.type != "newlines")
                {
                    p.value += t.value;
                    tokens.RemoveAt(i);
                }
            }

            // remove empties
            for (var i = tokens.Count - 1; i >= 0; --i)
            {
                if (tokens[i].length == 0)
                {
                    tokens.RemoveAt(i);
                }
            }
        }
    }
}