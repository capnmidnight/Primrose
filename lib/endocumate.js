/* 
 * Copyright (C) 2016 Sean T. McBeth
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


// This is a slightly rough version of Markdown that does not include the 
// full link/image sytnax, emphasis, underline, or bold, and uses its own 
// syntax for code blocks (double backticks instead of indenting).
function endocumate ( str, depth, skipParagraph ) {
  if ( depth === undefined ) {
    depth = 0;
  }
  if ( depth < 5 ) {
    var pres = [ ],
        output = "";
    if ( !skipParagraph ) {
      output += "<p>";
    }
    output += str
        .replace( /^((    [^\n]*)?(\n|$))+$/mg, function ( str ) {
          var name = "&PRE_SNIP" + pres.length + ";";
          str = "<pre><code>" +
              str
              .replace( /^    /mg, "" )
              .replace( /&/g, "&amp;" )
              .replace( /</g, "&lt;" )
              .replace( />/g, "&gt;" ) +
              "</code></pre>";
          pres.push( str );
          return name;
        } )
        .replace( /&(?!\w+;)/g, "&amp;" )
        .replace( /((\*|-)\s*){3,}\n/g, "<hr>" )
        .replace( /^([^\n]+)\n=+\n/mg, "<h1>$1</h1>" )
        .replace( /^([^\n]+)\n-+\n/mg, "<h2>$1</h2>" )
        .replace( /^(#{1,6})\s*([^#\n]+)\s*#*\n/mg, function ( str, group1, group2 ) {
          return "<h" + group1.length + ">" + group2 + "</h" + group1.length + ">";
        } )
        .replace( /^((\*+|-+|\++|\d+\.)\s+[^\n]*(\n|$))+$/mg, function ( str, g1, g2 ) {
          var lines = str.trim().split( "\n" ),
              output = "",
              tagStack = [ ];
          for ( var i = 0; i < lines.length; ++i ) {
            var line = lines[i],
                listSpec = line.match( /^(\*+|-+|\++|\d+\.)\s+(.+)/ ),
                listDef = listSpec[1],
                content = listSpec[2];
            if ( listDef.length > tagStack.length ) {
              var tag = /^\d+\./.test( line ) ? "ol" : "ul";
              tagStack.push( tag );
              output += "<" + tag + "><li>" + content;
            }
            else if ( listDef.length < tagStack.length ) {
              output += "</li></" + tagStack.pop() + "><li>" + content;
            }
            else {
              output += "</li><li>" + content;
            }
          }
          return output + "</li></" + tagStack.pop() + ">";
        } )
        .replace( /(^> [^\n]+\n)+/mg, function ( str ) {
          return "<blockquote>" + endocumate( str.substring( 2 ), depth + 1, true ) + "</blockquote>";
        }.bind( this ) )
        .replace( /!\[([^\]]+)\]\s*\(([^\)]+)\)/g, "<img title=\"$1\" alt=\"diagram\" src=\"$2\">" )
        .replace( /\[([^\]]+)\]\s*\(([^\)]+)\)/g, "<a href=\"$2\">$1</a>" )
        .replace( /<(?!\/|(a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|bgsound|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|content|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|element|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|nobr|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|rtc|ruby|s|samp|script|section|select|shadow|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)\b)/g, "&lt;" )
        .replace( /\n\s*\n/g, "</p><p>" )
        .replace( /  \n/g, "<br>" )
        .replace( /&PRE_SNIP(\d+);/g, function ( str, match ) {
          return pres[match];
        } );
    if ( !skipParagraph ) {
      output += "</p>";
    }
    return output;
  }
}