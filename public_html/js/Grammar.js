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

/*
 * 
 */
var grammars = {
    // used for all languages
    preprocessing: [
        // prevent user-code from injecting its own control sequences.
        ["ampersands", /&/g, "&amp;"],
        
        // prevent spaces from collapsing (this will eventually go away
        // when DOM-based processing goes away).
        ["spaces", / /g, "&nbsp;"]
    ],
    
    postprocessing: [
        // return the user-coded ampersands
        ["amerpsands", /&amp;/g, "&"],
        
        // prevent newlinse from collapsing (this will eventually go away
        // when DOM-based processing goes away).
        ["newlines", /\r?\n/g, "<br>"]
    ],
    
    JavaScript: [
        // remove escaped quotation marks, so they don't mess with the
        // string remover
        [
            "escapedQuotationMarks", 
            /\\"/g, 
            "&quot;"
        ],

        [
            "strings", 
            /"[^"]+"/g, 
            function (txt, state, match, groups, i) {
                var i = state.strings.length;
                // return the escaped quotation marks
                state.strings[i] = match.replace(/&quot;/g, "\\\"");
                return "&string" + i + ";";
            }
        ],

        [
            "inlineComments", 
            /\/\/[^\n]+\n/g, 
            function (txt, state, match, groups, i) {
                var i = state.comments.length;
                state.comments[i] = match;
                return "&comment" + i + ";";
            }
        ],

        [
            "blockComments", 
            /\/\*(\/(?!\*)|[^\/])+\*\//g, 
            function (txt, state, match, groups, i) {
                var i = state.comments.length;
                state.comments[i] = match;
                return "&comment" + i + ";";
            }
        ],

        [
            "keywords", 
            /\b(break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/g, 
            function (txt, state, match, groups, i) {
                return "&" + match + ";";
            }
        ],

        [
            "identifiers", 
            /(\w+)/g, 
            function (txt, state, match, groups, i) {
                if (txt[i - 1] === "&") {
                    return match;
                }
                return "<span class=\"identifier\">" + match + "</span>";
            }
        ],
        
        // These will go away when the DOM based processing is replaced with 
        // a proper tokenizer.
        [
            "replaceKeywords", 
            /&(break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with);/g,
            function (txt, state, match, groups, i) {
                return "<span class=\"keyword\">" + groups + "</span>";
            }
        ],
        
        [
            "replaceStrings", 
            /&string(\d+);/g, 
            function (txt, state, match, groups, i) {
                return "<span class=\"stringLiteral\">" + state.strings[groups] + "</span>";
            }
        ],
        
        [
            "replaceComments",
            /&comment(\d+);/g, 
            function (txt, state, match, groups, i) {
                return "<span class=\"comment\">" + state.comments[groups] + "</span>";
            }
        ]
    ]
};