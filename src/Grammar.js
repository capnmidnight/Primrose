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


function Grammar(name, grammar) {
    this.name = name;
    // clone the preprocessing grammar to start a new grammar
    this.grammar = grammar.map(function (rule) {
        return new Rule(rule[0], rule[1]);
    });
}

function Rule(name, test) {
    this.name = name;
    this.test = test;
}

function Token(value, type, index) {
    this.value = value;
    this.type = type;
    this.index = index;
}

Grammar.prototype.tokenize = function (text) {
    // all text starts off as regular text, then gets cut up into tokens of
    // more specific type
    var tokens = [new Token(text, "regular", 0)];
    for (var i = 0; i < this.grammar.length; ++i) {
        var rule = this.grammar[i];
        for (var j = 0; j < tokens.length; ++j) {
            var left = tokens[j];

            if (left.type === "regular") {
                var res = rule.test.exec(tokens[j].value);
                if (res) {
                    // insert the new token into the token list
                    var midx = res[res.length - 1];
                    var start = res.index;
                    if (res.length === 2) {
                        start += res[0].indexOf(midx);
                    }
                    var mid = new Token(midx, rule.name, left.index + start);
                    tokens.splice(j + 1, 0, mid);

                    // if there is any string after the found token,
                    // reinsert it so it can be processed further.
                    var end = start + midx.length;
                    if (end < left.value.length) {
                        var right = new Token(left.value.substring(end), "regular", left.index + end);
                        tokens.splice(j + 2, 0, right);
                    }

                    // cut the newly created token out of the current string
                    if (start > 0) {
                        left.value = left.value.substring(0, start);
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