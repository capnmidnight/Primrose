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
function endocumate ( str, depth ) {
  if ( depth === undefined ) {
    depth = 0;
  }
  if ( depth < 5 ) {
    var pres = [ ];
    return "<p>" + str
        .replace( /(``?)([^`]+)\1/g, function ( str, delim, txt ) {
          var name = "&PRE_SNIP" + pres.length + ";";
          txt = txt.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" );
          txt = "<code>" + txt + "</code>";
          if ( delim === "``" ) {
            txt = "<pre>" + txt + "</pre>";
          }
          pres.push( txt );
          return name;
        } )
        .replace( /&(?!\w+;)/g, "&amp;" )
        .replace( /((\*|-)\s*){3,}\n/g, "<hr>" )
        .replace( /^([^\n]+)\n=+\n/mg, "<h1>$1</h1>" )
        .replace( /^([^\n]+)\n-+\n/mg, "<h2>$1</h2>" )
        .replace( /(#{1,6})\s*([^#\n]+)\s*#*\n/g, function ( str, group1, group2 ) {
          var h = group1.length;
          return "<h" + h + ">" + group2 + "</h" + h + ">";
        } )
        .replace( /(^(\*|-|\+|\d+\.)\s+[^\n]+\n)+/mg, function ( str ) {
          var tag = /\d/.test( str[0] ) ? "ol" : "ul";
          return "<" + tag + ">" + str.replace( /(\*|-|\+|\d+\.)\s+([^\n]+)\n/g, "<li>$2</li>" ) + "</" + tag + ">";
        } )
        .replace( /(^> [^\n]+\n)+/mg, function ( str ) {
          return "<blockquote>" + this.endocumate( str.replace( /^> /mg, "" ), depth + 1 ) + "</blockquote>";
        }.bind( this ) )
        .replace( /!\[([^\]]+)\]\s*\(([^\)]+)\)/g, "<img title=\"$1\" alt=\"diagram\" src=\"$2\">" )
        .replace( /\[([^\]]+)\]\s*\(([^\)]+)\)/g, "<a href=\"$2\">$1</a>" )
        .replace( /<(?!\/|(a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|bgsound|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|content|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|element|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|nobr|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|rtc|ruby|s|samp|script|section|select|shadow|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)\b)/g, "&lt;" )
        .replace( /\n\s*\n/g, "</p><p>" )
        .replace( /  \n/g, "<br>" )
        .replace( /&PRE_SNIP(\d+);/g, function ( str, match ) {
          return pres[match];
        } ) + "</p>";
  }
}