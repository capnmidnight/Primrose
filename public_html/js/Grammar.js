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
    this.grammar = grammar.map(function(rule){
        return new Rule(rule[0], rule[1], rule[2]);
    });
}

function Rule(name, test, style){
    this.name = name;
    this.test = test;
    this.style = style || {};
}

Grammar.prototype.tokenize = function (text) {
    var tokens = [text];
    for(var i = 0; i < this.grammar.length; ++i){
        var rule = this.grammar[i];
        console.log("processing rule: ", rule.name);
        for(var j = 0; j < tokens.length && j < 1000; ++j){
            console.log("\tsubstring", j);
            if(!tokens[j].style){
                tokens[j].replace(rule.test, function(match){
                    match.name = rule.name;
                    match.style = rule.style;
                    var start = arguments[arguments.length - 2];
                    var left = tokens[j].substring(0, start);
                    var right = tokens[j].substring(start + match.length);
                    //tokens.splice(j + 1, 0, match, right);
                    console.log("\t\t", match, start, left, right);
                    return left;
                });
            }
        }
    }
    return tokens.filter(function(t){
        return t.length > 0;
    });
};

Grammar.tests = {
    aSimpleString: function(){
        var txt = "\"a\"";
        var tokens = Grammar.JavaScript.tokenize(txt);
        Assert.areEqual(1, tokens.length);
        Assert.areEqual("string", tokens[0].name);
        Assert.isNotNull(tokens[0].style);
        Assert.areEqual(txt, tokens[0]);
    }
};

Grammar.JavaScript = new Grammar([
    [
        "strings",
        /"(\\"|[^"])+"/,
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
        /\/\*(\/(?!\*)|[^\/])+\*\//g,
        {
            color: "green",
            fontStyle: "italic"
        }
    ],
    [
        "keywords",
        /\b(break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/,
        {
            color: "blue"
        }
    ],
    [
        "identifiers",
        /(\w+)/,
        {
            color: "#aa0000",
            fontWeight: "bold"
        }
    ]
]);