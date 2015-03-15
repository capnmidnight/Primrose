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

function Rule(name, test) {
    "use strict";
    this.name = name;
    this.test = test;
}

var Token = (function () {
    "use strict";
    function Token(value, type, index, line) {
        this.value = value;
        this.type = type;
        this.index = index;
        this.line = line;
    }

    Token.prototype.clone = function () {
        return new Token(this.value, this.type, this.index, this.line);
    };

    Token.prototype.splitAt = function (i) {
        var next = this.value.substring(i);
        this.value = this.value.substring(0, i);
        return new Token(next, this.type, this.index + i, this.line);
    };

    return Token;
})();

function Grammar(name, grammar) {
    "use strict";
    this.name = name;
    // clone the preprocessing grammar to start a new grammar
    this.grammar = grammar.map(function (rule) {
        return new Rule(rule[0], rule[1]);
    });

    this.tokenize = function (text) {
        // all text starts off as regular text, then gets cut up into tokens of
        // more specific type
        var tokens = [new Token(text, "regular", 0)];
        for (var i = 0; i < this.grammar.length; ++i) {
            var rule = this.grammar[i];
            for (var j = 0; j < tokens.length; ++j) {
                var left = tokens[j];

                if (left.type === "regular") {
                    var res = rule.test.exec(left.value);
                    if (res) {
                        // insert the new token into the token list
                        var midx = res[res.length - 1];
                        var start = res.index;
                        for(var k = 1; k < res.length - 1; ++k){
                            start += res[k].length;
                        }
                        var end = start + midx.length;
                        if(start === 0){
                            // the rule matches the start of the token
                            left.type = rule.name;
                            if(end < left.value.length){
                                // but not the end
                                var next = left.splitAt(end);
                                next.type = "regular";
                                tokens.splice(j + 1, 0, next);
                            }
                        }
                        else{
                            // the rule matches from the middle of the token
                            var mid = left.splitAt(start);
                            if(midx.length < mid.value.length) {
                                // but not the end
                                var right = mid.splitAt(midx.length);
                                tokens.splice(j + 1, 0, right);
                            }
                            mid.type = rule.name;
                            tokens.splice(j + 1, 0, mid);
                        }
                    }
                }
            }
        }

        // normalize tokens
        var blockOn = false, line = 0;
        for (i = 0; i < tokens.length; ++i) {
            var t = tokens[i];
            t.line = line;
            if (t.type === "newlines") {
                ++line;
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
        }
        return tokens;
    };
}