/* 
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
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


function Grammar(grammar) {
    // clone the preprocessing grammar to start a new grammar
    this.grammar = grammar.map(function (rule) {
        return new Rule(rule[0], rule[1]);
    });
}

function Rule(name, test) {
    this.name = name;
    this.test = test;
}

function Token(value, type) {
    this.value = value;
    this.type = type;
}

Grammar.prototype.tokenize = function (text) {
    var tokens = [text];
    for (var i = 0; i < this.grammar.length; ++i) {
        var rule = this.grammar[i];
        for (var j = 0; j < tokens.length; ++j) {
            var str = tokens[j];
            if (!(str instanceof Token)) {
                var res = rule.test.exec(tokens[j]);
                if (res) {
                    // insert the new token into the token list
                    var mid = res[res.length - 1];
                    var start = res.index;
                    if (res.length === 2) {
                        start += res[0].indexOf(mid);
                    }
                    var token = new Token(mid, rule.name);
                    tokens.splice(j + 1, 0, token);

                    // reinsert the rest of the string for further processing
                    var end = start + mid.length;
                    if (end < str.length) {
                        var right = str.substring(end);
                        tokens.splice(j + 2, 0, right);
                    }

                    // cut the newly created token out of the string
                    if (start > 0) {
                        tokens[j] = str.substring(0, start);
                        // skip the token we just created
                        ++j;
                    }
                    else {
                        tokens.splice(j, 1);
                        // no need to backup, because the next array element
                        // will be a Token and we don't need to recheck it
                    }
                }
            }
        }
    }

    // normalize tokens
    var blockOn = false;
    for (i = 0; i < tokens.length; ++i) {
        var t = tokens[i];
        if (!(t instanceof Token)) {
            tokens[i] = t = new Token(t, "regular");
        }

        if (blockOn) {
            if (t.type === "endBlockComments") {
                blockOn = false;
            }
            if (t.type !== "newlines") {
                t.type = "comments";
            }
        }
        else if (t.type === "startBlockComments") {
            blockOn = true;
            t.type = "comments";
        }
        else if (t.type === "inlineComments") {
            t.type = "comments";
        }
        else if (/^strings\d+/.test(t.type)) {
            t.type = "strings";
        }
    }
    return tokens;
};

Grammar.JavaScript = new Grammar([
    ["newlines", /(?:\r\n|\r|\n)/],
    ["inlineComments", /\/\/.+$/],
    ["startBlockComments", /\/\*/],
    ["endBlockComments", /\*\//],
    ["strings1", /"(?:\\"|[^"]*)"/],
    ["strings2", /'(?:\\'|[^']*)'/],
    ["numbers", /\b(?:\d*\.)?\d+\b/],
    ["keywords", /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/],
    ["functions", /(\w+)(?:\s*\()/],
    ["members", /(?:(?:\w+\.)+)(\w+)/]
]);

Grammar.tests = {
    captureOnlyAGroup: function () {
        var src = "function(){ a.b.c = \"asdf\"; }";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("c", tokens[2].value, "token isn't right value");
        Assert.areEqual("members", tokens[2].type, "token types do not match");
    },
    aSimpleString: function () {
        var src = "\"a\"";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("strings", tokens[0].type, "token types do not match");
    },
    twoStrings: function () {
        var src = "\"a\" b \"c\"";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("strings", tokens[0].type, "0: token incorrect type");
        Assert.areEqual("regular", tokens[1].type, "1: token incorrect type");
        Assert.areEqual("strings", tokens[2].type, "2: token incorrect type");
    },
    singleLineBlockComment: function () {
        var src = "/* asdf one 2 three 4 */";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("comments", tokens[0].type, "token types do not match");
    },
    multiLineBlockComment: function () {
        var src = "/*\n asdf one\n2 three 4\n*/";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("comments", tokens[0].type, "token types do not match");
    },
    multipleMultiLineBlockComment: function () {
        var src = "/*\n asdf one\n2 three 4\n*/\nfunction(){\n/*\n asdf one\n2 three 4\n*/\n}";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual("comments", tokens[0].type, "0: token types do not match");
        Assert.areEqual("comments", tokens[4].type, "4: token types do not match." + tokens[5].value);
    },
    bigTest: function () {
        var src = "function Hello (){\n" +
                "    // a comment\n" +
                "    function MyFunc ( ) {\n" +
                "        var x = \"Whatever\";\n" +
                "        console.log(x + \" World\");\n" +
                "        /*\n" +
                "          a longer comment\n" +
                "        */\n" +
                "    }\n" +
                "}";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function (t) {
            return t.value;
        }).join("");
        Assert.areEqual(src, res);
    }
};