Primrose.Text.Grammar = (function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Text",
    name: "Grammar",
    parameters: [
      { name: "name", type: "String", description: "A user-friendly name for the grammar, to be able to include it in an options listing." },
      { name: "rules", type: "Array", description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code." }
    ],
    description: "A Grammar is a collection of rules for processing text into tokens. Tokens are special characters that tell us about the structure of the text, things like keywords, curly braces, numbers, etc. After the text is tokenized, the tokens get a rough processing pass that groups them into larger elements that can be rendered in color on the screen.\n\
\n\
As tokens are discovered, they are removed from the text being processed, so order is important. Grammar rules are applied in the order they are specified, and more than one rule can produce the same token type.\n\
\n\
See [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names.",
    examples: [
      {
        name: "A plain-text \"grammar\".", description: "Plain text does not actually have a grammar that needs to be processed. However, to get the text to work with the rendering system, a basic grammar is necessary to be able to break the text up into lines and prepare it for rendering.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var plainTextGrammar = new Primrose.Text.Grammar(\n\
      // The name is for displaying in options views.\n\
      \"Plain-text\", [\n\
      // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
      [\"newlines\", /(?:\\r\\n|\\r|\\n)/] \n\
    ] );"},
      {
        name: "A grammar for BASIC", description: "The BASIC programming language is now defunct, but a grammar for it to display in Primrose is quite easy to build.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var basicGrammar = new Primrose.Text.Grammar( \"BASIC\",\n\
      // Grammar rules are applied in the order they are specified.\n\
      [\n\
        // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
        [ \"newlines\", /(?:\\r\\n|\\r|\\n)/ ],\n\
        // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.\n\
        [ \"lineNumbers\", /^\\d+\\s+/ ],\n\
        // Comments were lines that started with the keyword \"REM\" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.\n\
        [ \"startLineComments\", /^REM\\s/ ],\n\
        // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.\n\
        [ \"strings\", /\"(?:\\\\\"|[^\"])*\"/ ],\n\
        [ \"strings\", /'(?:\\\\'|[^'])*'/ ],\n\
        // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).\n\
        [ \"numbers\", /-?(?:(?:\\b\\d*)?\\.)?\\b\\d+\\b/ ],\n\
        // Keywords are really just a list of different words we want to match, surrounded by the \"word boundary\" selector \"\\b\".\n\
        [ \"keywords\",\n\
          /\\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\\b/\n\
        ],\n\
        // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.\n\
        [ \"keywords\", /^DEF FN/ ],\n\
        // These are all treated as mathematical operations.\n\
        [ \"operators\",\n\
          /(?:\\+|;|,|-|\\*\\*|\\*|\\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\\(|\\)|\\[|\\])/\n\
        ],\n\
        // Once everything else has been matched, the left over blocks of words are treated as variable and function names.\n\
        [ \"identifiers\", /\\w+\\$?/ ]\n\
      ] );"}
    ]
  });
  function Grammar(name, rules) {
    pliny.property({
      parent: "Primrose.Text.Grammar",
      name: " name",
      type: "String",
      description: "A user-friendly name for the grammar, to be able to include it in an options listing."
    });
    this.name = name;

    pliny.property({
      parent: "Primrose.Text.Grammar",
      name: "grammar",
      type: "Array",
      description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
    });
    // clone the preprocessing grammar to start a new grammar
    this.grammar = rules.map(function (rule) {
      return new Primrose.Text.Rule(rule[0], rule[1]);
    });

    function crudeParsing(tokens) {
      var commentDelim = null,
        stringDelim = null,
        line = 0,
        i, t;
      for (i = 0; i < tokens.length; ++i) {
        t = tokens[i];
        t.line = line;
        if (t.type === "newlines") {
          ++line;
        }

        if (stringDelim) {
          if (t.type === "stringDelim" && t.value === stringDelim && (i === 0 || tokens[i - 1].value[tokens[i - 1].value.length - 1] !== "\\")) {
            stringDelim = null;
          }
          if (t.type !== "newlines") {
            t.type = "strings";
          }
        }
        else if (commentDelim) {
          if (commentDelim === "startBlockComments" && t.type === "endBlockComments" ||
            commentDelim === "startLineComments" && t.type === "newlines") {
            commentDelim = null;
          }
          if (t.type !== "newlines") {
            t.type = "comments";
          }
        }
        else if (t.type === "stringDelim") {
          stringDelim = t.value;
          t.type = "strings";
        }
        else if (t.type === "startBlockComments" || t.type === "startLineComments") {
          commentDelim = t.type;
          t.type = "comments";
        }
      }

      // recombine like-tokens
      for (i = tokens.length - 1; i > 0; --i) {
        var p = tokens[i - 1];
        t = tokens[i];
        if (p.type === t.type && p.type !== "newlines") {
          p.value += t.value;
          tokens.splice(i, 1);
        }
      }
    }

    Grammar.prototype.toHTML = function (txt) {
      var tokenRows = this.tokenize(txt),
        temp = document.createElement("div");
      for (var y = 0; y < tokenRows.length; ++y) {
        // draw the tokens on this row
        var t = tokenRows[y];
        if (t.type === "newlines") {
          temp.appendChild(document.createElement("br"));
        }
        else {
          var style = Primrose.Text.Themes.Default[t.type] || {},
            elem = document.createElement("span");
          elem.style.fontWeight = style.fontWeight || Primrose.Text.Themes.Default.regular.fontWeight;
          elem.style.fontStyle = style.fontStyle || Primrose.Text.Themes.Default.regular.fontStyle || "";
          elem.style.color = style.foreColor || Primrose.Text.Themes.Default.regular.foreColor;
          elem.style.backgroundColor = style.backColor || Primrose.Text.Themes.Default.regular.backColor;
          elem.style.fontFamily = style.fontFamily || Primrose.Text.Themes.Default.fontFamily;
          elem.appendChild(document.createTextNode(t.value));
          temp.appendChild(elem);
        }
      }
      return temp.innerHTML;
    };

    pliny.method({
      parent: "Primrose.Text.Grammar",
      name: "tokenize",
      parameters: [{ name: "text", type: "String", description: "The text to tokenize." }],
      returns: "An array of tokens, ammounting to drawing instructions to the renderer. However, they still need to be layed out to fit the bounds of the text area.",
      description: "Breaks plain text up into a list of tokens that can later be rendered with color.",
      examples: [
        {
          name: 'Tokenize some JavaScript', description: 'Primrose comes with a grammar for JavaScript built in.\n\
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
    ]'}
      ]
    });
    this.tokenize = function (text) {
      // all text starts off as regular text, then gets cut up into tokens of
      // more specific type
      var tokens = [new Primrose.Text.Token(text, "regular", 0)];
      for (var i = 0; i < this.grammar.length; ++i) {
        var rule = this.grammar[i];
        for (var j = 0; j < tokens.length; ++j) {
          rule.carveOutMatchedToken(tokens, j);
        }
      }

      crudeParsing(tokens);
      return tokens;
    };
  }

  return Grammar;
})();

