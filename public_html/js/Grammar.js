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
        return new Rule(rule[0], rule[1], rule[2]);
    });
}

function Rule(name, test, style) {
    this.name = name;
    this.test = test;
    this.style = style || {};
}

function Token(value, rule) {
    this.value = value;
    this.rule = rule;
}

Grammar.prototype.tokenize = function (text, defaultRule) {
    defaultRule = defaultRule || new Rule("default", null, {});
    var tokens = [text];
    for (var i = 0; i < this.grammar.length; ++i) {
        var rule = this.grammar[i];
        for (var j = 0; j < tokens.length; ++j) {
            var str = tokens[j];
            if (!(str instanceof Token)) {
                var res = rule.test.exec(tokens[j]);
                if (res) {
                    // insert the new token into the token list
                    var mid = res[0];
                    var token = new Token(mid, rule);
                    tokens.splice(j + 1, 0, token);
                    
                    // reinsert the rest of the string for further processing
                    var start = res.index;
                    var end = start + mid.length;
                    if (end < str.length) {
                        var right = str.substring(end);
                        tokens.splice(j + 2, 0, right);
                    }
                    
                    // cut the newly created token out of the string
                    if(start > 0){
                        tokens[j] = str.substring(0, start);
                        // skip the token we just created
                        ++j;
                    }
                    else{
                        tokens.splice(j, 1);
                        // no need to backup, because the next array element
                        // will be a Token and we don't need to recheck it
                    }
                }
            }
        }
    }
    for (var i = 0; i < tokens.length; ++i) {
        if (!(tokens[i] instanceof Token)) {
            tokens[i] = new Token(tokens[i], defaultRule);
        }
    }
    return tokens;
};

Grammar.tests = {
    aSimpleString: function () {
        var src = "\"a\"";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function(t){ return t.value; }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual(1, tokens.length, "number of tokens does not match");
        Assert.areEqual(src, tokens[0].value, "token isn't right value");
        Assert.isNotNull(tokens[0].rule, "token does not have a rule");
        Assert.isNotNull(tokens[0].rule.style, "token does not have a style");
        Assert.areEqual("strings", tokens[0].rule.name, "token types do not match");
    },
    twoStrings: function () {
        var src = "\"a\" b \"c\"";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function(t){ return t.value; }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual(5, tokens.length, "number of tokens does not match");
        Assert.areEqual("strings", tokens[0].rule.name, "0: token incorrect type");
        Assert.areEqual("default", tokens[1].rule.name, "1: token incorrect type");
        Assert.areEqual("identifiers", tokens[2].rule.name, "2: token incorrect type");
        Assert.areEqual("default", tokens[3].rule.name, "3: token incorrect type");
        Assert.areEqual("strings", tokens[4].rule.name, "4: token incorrect type");
    },
    singleLineBlockComment: function(){
        var src = "/* asdf one 2 three 4 */";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function(t){ return t.value; }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual(1, tokens.length, "number of tokens does not match");
        Assert.areEqual(src, tokens[0].value, "token isn't right value");
        Assert.isNotNull(tokens[0].rule, "token does not have a rule");
        Assert.isNotNull(tokens[0].rule.style, "token does not have a style");
        Assert.areEqual("blockComments", tokens[0].rule.name, "token types do not match");
    },
    multiLineBlockComment: function(){
        var src = "/*\n asdf one\n2 three 4\n*/";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function(t){ return t.value; }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual(1, tokens.length, "number of tokens does not match");
        Assert.areEqual(src, tokens[0].value, "token isn't right value");
        Assert.isNotNull(tokens[0].rule, "token does not have a rule");
        Assert.isNotNull(tokens[0].rule.style, "token does not have a style");
        Assert.areEqual("blockComments", tokens[0].rule.name, "token types do not match");
    },
    multipleMultiLineBlockComment: function(){
        var src = "/*\n asdf one\n2 three 4\n*/\nfunction(){\n/*\n asdf one\n2 three 4\n*/\n}";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function(t){ return t.value; }).join("");
        Assert.areEqual(src, res);
        Assert.areEqual(6, tokens.length, "number of tokens does not match");
        Assert.areEqual("blockComments", tokens[0].rule.name, "0: token types do not match");
        Assert.areEqual("blockComments", tokens[4].rule.name, "4: token types do not match." + tokens[5].value);
    },
    bigTest: function(){
        var src = "function Hello (){\n"
            + "    // a comment\n"
            + "    function MyFunc ( ) {\n"
            + "        var x = \"Whatever\";\n"
            + "        console.log(x + \" World\");\n"
            + "        /*\n"
            + "          a longer comment\n"
            + "        */\n"
            + "    }\n"
            + "}";
        var tokens = Grammar.JavaScript.tokenize(src);
        var res = tokens.map(function(t){ return t.value; }).join("");
        Assert.areEqual(src, res);
    }
};

Grammar.JavaScript = new Grammar([
    [
        "strings",
        /"(?:\\"|[^"]+)"/,
        {
            color: "#aa9900",
            fontStyle: "italic"
        }
    ],
    [
        "inlineComments",
        /\/\/[^\n]+\n/,
        {
            color: "green",
            fontStyle: "italic"
        }
    ],
    [
        "blockComments",
        /\/\*(?:\/(?!\*)|[^\/])+\*\//,
        {
            color: "green",
            fontStyle: "italic"
        }
    ],
    [
        "keywords",
        /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/,
        {
            color: "blue"
        }
    ],
    [
        "identifiers",
        /(?:\w+)/,
        {
            color: "#aa0000",
            fontWeight: "bold"
        }
    ]
]);