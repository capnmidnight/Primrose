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

  function emphasis ( str, spec, content ) {
    var tag = spec.length === 1 ? "em" : "strong";
    return "<" + tag + ">" + content + "</" + tag + ">";
  }

  var escapes = [ ];
  function escaper ( str, char ) {
    var idx = escapes.indexOf( char );
    if ( idx === -1 ) {
      idx = escapes.length;
      escapes.push( char );
    }
    return "&ESCAPE" + idx + ";";
  }

  function codeSnip ( str ) {
    str = "<pre><code>" +
        str
        .replace( /^    /mg, "" )
        .replace( /&/g, "&amp;" )
        .replace( /</g, "&lt;" )
        .replace( />/g, "&gt;" ) +
        "</code></pre>";
    return escaper( null, str );
  }

  function endocumate ( str, depth, skipParagraph ) {
    if ( depth === undefined ) {
      depth = 0;
    }
    if ( depth < 5 ) {
      var output = "";
      if ( !skipParagraph ) {
        output += "<p>";
      }
      output += str
          .replace( /^((    [^\n]*)(\n|$))+$/mg, codeSnip )
          .replace( /\\([\\`*_{}\[\]()#+\-.!])/g, escaper )
          .replace( /( [*_] )/g, escaper )
          .replace( /&(?!\w+;)/g, "&amp;" )
          .replace( /``/g, "&BACKTICK;" )
          .replace( /((\*|-)\s*){3,}(\n|$)/g, "<hr>" )
          .replace( /^([^\n]+)\n=+(\n|$)/mg, "<h1>$1</h1>" )
          .replace( /^([^\n]+)\n-+(\n|$)/mg, "<h2>$1</h2>" )
          .replace( /^(#{1,6})\s*([^#\n]+)\s*#*(\n|$)/mg, function ( str, group1, group2 ) {
            return "<h" + group1.length + ">" + group2 + "</h" + group1.length + ">";
          } )
          .replace( /`([^`]+)`/g, "<code>$1</code>" )
          .replace( /((^|\r?\n)(\*|\+|-|\d+\.| )+\s+[^\n]+(?=\r?\n|$))+/g, function ( str ) {
            var lines = str.trim( ).split( "\n" ),
                output = "",
                tagStack = [ ];
            for ( var i = 0; i < lines.length; ++i ) {
              var line = lines[i],
                  listSpec = line.match( /^((\*|-|\+|\d+\.)+)\s+(.+)/ );
              if ( listSpec ) {
                var listDef = listSpec[1],
                    content = listSpec[3],
                    isNumbered = /^\d+\./.test( line ),
                    len = listDef.length / (isNumbered ? 2 : 1);
                if ( len > tagStack.length ) {
                  var tag = isNumbered ? "ol" : "ul";
                  tagStack.push( tag );
                  output += "<" + tag + "><li>" + content;
                }
                else if ( len < tagStack.length ) {
                  output += "</li></" + tagStack.pop( ) + "><li>" + content;
                }
                else {
                  output += "</li><li>" + content;
                }
              }
              else{
                output += line + "\n";
              }
            }
            while(tagStack.length > 0){
              output + "</li></" + tagStack.pop( ) + ">";
            }
            return output;
          } )
          .replace( /(\_\_?)([^_]+)\1/g, emphasis )
          .replace( /(\*\*?)([^*]+)\1/g, emphasis )
          .replace( /(^> [^\n]+(\n|$))+/mg, function ( str ) {
            return "<blockquote>" + endocumate( str.replace( /^> /mg, "" ), depth + 1, true ) + "</blockquote>";
          }.bind( this ) )
          .replace( /!\[([^\]]+)\]\s*\(([^\)]+)\)/g, "<img title=\"$1\" alt=\"diagram\" src=\"$2\">" )
          .replace( /\[([^\]]+)\]\s*\(([^\)]+)\)/g, "<a href=\"$2\">$1</a>" )
          .replace( /<(?!\/|(a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|bgsound|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|content|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|element|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|nobr|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|rtc|ruby|s|samp|script|section|select|shadow|small|source|span|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)\b)/g, "&lt;" )
          .replace( /\n\s*\n/g, "</p><p>" )
          .replace( /  \n/g, "<br>" )
          .replace( /&BACKTICK;/g, "`" )
          .replace( /&ESCAPE(\d+);/g, function ( str, idx ) {
            return escapes[idx];
          } );
      if ( !skipParagraph ) {
        output += "</p>";
      }
      return output;
    }
  }
  return endocumate;
} )( );