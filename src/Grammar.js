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
    var tokens = [new Token(text, "regular")], t = null;
    for (var i = 0; i < this.grammar.length; ++i) {
        var rule = this.grammar[i];
        for (var j = 0; j < tokens.length; ++j) {
            t = tokens[j];
            if (t.type === "regular") {
                var res = rule.test.exec(tokens[j].value);
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
                    if (end < t.value.length) {
                        var right = new Token(t.value.substring(end), "regular");
                        tokens.splice(j + 2, 0, right);
                    }

                    // cut the newly created token out of the string
                    if (start > 0) {
                        t.value = t.value.substring(0, start);
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
        t = tokens[i];

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