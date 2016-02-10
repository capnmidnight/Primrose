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

var endocumate = ( function ( ) {
  var escapes = [ ];
  function escaper ( match, char ) {
    var idx = escapes.indexOf( char );
    if ( idx === -1 ) {
      idx = escapes.length;
      escapes.push( char );
    }
    return "&ESCAPE" + idx + ";";
  }

  function codeSnip ( match ) {
    return escaper( null, "<pre><code>" +
        match
        .replace( /^    /mg, "" )
        .replace( /&/g, "&amp;" )
        .replace( /</g, "&lt;" )
        .replace( />/g, "&gt;" ) +
        "</code></pre>" );
  }

  function endocumate ( doc, depth ) {
    if ( depth === undefined ) {
      depth = 0;
    }
    if ( depth < 5 ) {
      var output = "";
      output += doc
          .replace( /\r\n/g, "\n" )
          .replace( /^((    [^\n]*)(\n|$))+$/mg, codeSnip )
          .replace( /\\([\\`*_{}\[\]()#+\-.!])/g, escaper )
          .replace( /( [*_] )/g, escaper )
          .replace( /`(`)/g, escaper )
          .replace( /&(?!\w+;)/g, "&amp;" )
          .replace( /^([^\n]+)\n=+(\n|$)/mg, "<h1>$1</h1>" )
          .replace( /^([^\n]+)\n-+(\n|$)/mg, "<h2>$1</h2>" )
          .replace( /((\*|-)\s*){3,}(\n|$)/g, "<hr>" )
          .replace( /^(#{1,6})\s*([^#\n]+)\s*#*(\n|$)/mg, function ( match, headerSpec, content ) {
            return "<h" + headerSpec.length + ">" + content + "</h" + headerSpec.length + ">";
          } )
          .replace( /`([^`]+)`/g, "<code>$1</code>" )
          .replace( /((^|\r?\n)(\*|\+|-|\d+\.| )+\s+[^\n]+(?=\r?\n|$))+/g, function ( match ) {
            var lines = match.split( "\n" ),
                output = "",
                tagStack = [ ],
                pop = function () {
                  output += "</" + tagStack.pop( ) + ">";
                };
            lines.forEach( function ( line ) {
              var listSpec = line.match( /^((?:\*|-|\+|\d+\.)+)\s+(.+)/ );
              if ( listSpec ) {
                var listDef = listSpec[1],
                    content = listSpec[2],
                    isNumbered = /^\d+\./.test( listDef ),
                    len = listDef.length / ( isNumbered ? 2 : 1 );
                if ( len > tagStack.length ) {
                  var tag = isNumbered ? "ol" : "ul";
                  tagStack.push( tag );
                  output += "<" + tag + "><li>" + content;
                }
                else {
                  output += "</li>";
                  if ( len < tagStack.length ) {
                    pop();
                  }
                  output += "<li>" + content;
                }
              }
              else {
                output += line + "\n";
              }
            } );
            while ( tagStack.length > 0 ) {
              pop();
            }
            return output;
          } )
          .replace( /_([^_]+)_/g, "<em>$1</em>" )
          .replace( /\*([^*]+)\*/g, "<em>$1</em>" )
          .replace( /__([^_]+)__/g, "<strong>$1</strong>" )
          .replace( /\*\*([^*]+)\*\*/g, "<strong>$1</strong>" )
          .replace( /(^> [^\n]+(\n|$))+/mg, function ( match ) {
            return "<blockquote>" + endocumate( match.replace( /^> /mg, "" ), depth + 1 ) + "</blockquote>";
          }.bind( this ) )
          .replace( /!\[([^\]]+)\]\s*\(([^\)]+)\)/g, "<img title=\"$1\" alt=\"diagram\" src=\"$2\">" )
          .replace( /\[([^\]]+)\]\s*\(([^\)]+)(\s+"([^"]|\\")+")?\)/g, function ( match, linkText, href, title ) {
            var output = "<a href=\"" + href + "\"";
            if ( /^https?:\/\//.test( href ) ) {
              output += " target=\"_blank\"";
            }
            if ( title && title.length > 0 ) {
              output += " title=\"" + title + "\"";
            }
            output += ">" + linkText + "</a>";
            return output;
          } )
          .replace( /<(https?:\/\/[^>]+)>/g, "<a href=\"$1\" target=\"_blank\">$1</a>" )
          .replace( /<(?!\/|(a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|bgsound|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|content|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|element|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|nobr|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|rtc|ruby|s|samp|script|section|select|shadow|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)\b)/g, "&lt;" )
          .replace( /  \n/g, "<br>" )
          .split( "\n\n" )
          .map( function ( block ) {
            return "<p>" + block + "</p>";
          } )
          .join( "\n" )
          .replace( /&ESCAPE(\d+);/g, function ( match, idx ) {
            return escapes[idx];
          } );
      escapes.splice( 0 );
      return output;
    }
  }
  return endocumate;
} )( );