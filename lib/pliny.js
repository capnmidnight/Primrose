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


var pliny = ( function ( ) {
  var burlapSack = {};

  function expose ( bag, name ) {
    if ( typeof name === "string" || name instanceof String ) {
      var parts = name.split( "." );
      for ( var i = 0; i < parts.length && !!bag; ++i ) {
        bag = bag[parts[i]];
      }
      return bag;
    }
  }

  function inscribe ( name ) {
    var bag = burlapSack,
        parts = name.split( "." ),
        path = "";
    for ( var i = 0; i < parts.length && !!bag; ++i ) {
      if ( !bag[parts[i]] ) {
        bag[parts[i]] = {};
      }
      if ( path.length > 0 ) {
        path += ".";
      }
      path += parts[i];
      bag = bag[parts[i]];
      if ( path.length > 0 && !bag.name ) {
        bag.name = path;
      }
    }
    return bag;
  }

  function illuminate ( name, bag ) {
    var obj = expose( window, name );
    if ( obj ) {
      obj.help = pliny.the.younger.bind( window, name );
      if ( !bag.type ) {
        bag.type = typeof obj;
      }
    }
    return obj;
  }

  function congeal ( type ) {
    var pluralName = type + "s";
    pluralName = pluralName.replace( /ys$/, "ies" );
    return function ( name, info ) {
      if ( info ) {
        var bag = inscribe( name );
        if ( bag ) {
          if ( !bag[pluralName] ) {
            bag[pluralName] = [ ];
          }
          var arr = bag[pluralName];
          if ( typeof info === "string" || info instanceof String ) {
            if ( arr.indexOf( info ) === -1 ) {
              arr.push( info );
            }
          }
          else {
            for ( var i = 0; i < arr.length; ++i ) {
              if ( arr[i].name === info.name ) {
                return;
              }
            }
            arr.push( info );
          }
        }
      }
    };
  }

  function fortify ( type ) {
    return function ( name, info ) {
      var bag = inscribe( name );
      if ( bag && !bag.type ) {
        if ( typeof info === "string" || info instanceof String ) {
          info = {description: info};
        }
        bag.type = type;
        Object.keys( info ).forEach( function ( k ) {
          bag[k] = info[k];
        } );
        if ( !illuminate( name, bag ) ) {
          setTimeout( illuminate, 1000, name, bag );
        }
      }
    };
  }

  var crystalBall = /\bpliny\s*\.\s*the\s*\.\s*elder\s*\.\s*(\w+)/gm,
      openParens = [ '(', '{', '[' ],
      closeParens = [ ')', '}', ']' ];
  function ascertain ( name ) {
    var bag = expose( window, name );
    if ( bag && typeof bag === "function" ) {
      var script = bag.toString( ),
          matches = null;
      while ( !!( matches = crystalBall.exec( script ) ) ) {
        var type = matches[1],
            start = matches.index + matches[0].length;
        var parenCount = 0,
            parameters = [ ],
            inString = false;
        for ( var i = start; i < script.length; ++i ) {
          var c = script.charAt( i );
          if ( c === '"' && ( i === 0 || script.charAt( i - 1 ) !== '\\' ) ) {
            inString = !inString;
          }

          if ( !inString ) {
            if ( openParens.indexOf( c ) > -1 ) {
              ++parenCount;
            }
            else if ( closeParens.indexOf( c ) > -1 ) {
              --parenCount;
            }
          }

          if ( parenCount === 1 && c === ',' && !inString || parenCount === 0 ) {
            var prop = script.substring( start + 1, i ).trim( ),
                pre = "",
                post = "";
            if ( openParens.indexOf( prop.charAt( 0 ) ) > -1 ) {
              pre = prop.charAt( 0 );
              post = prop.charAt( prop.length - 1 );
              prop = prop.substring( 1, prop.length - 1 );
            }
            var chunks = [ ],
                chunk = "",
                inString2 = false;
            for ( var j = 0; j < prop.length; ++j ) {
              var c2 = prop.charAt( j );
              if ( c2 === '"' && ( j === 0 || script.charAt( j - 1 ) !== '\\' ) ) {
                inString2 = !inString2;
              }
              if ( c2 === ',' && !inString2 ) {
                chunks.push( chunk.trim() );
                chunk = "";
              }
              else {
                chunk += c2;
              }
            }
            chunks.push( chunk.trim() );
            prop = pre + chunks.map( function ( chunk ) {
              var parts = [ "", "" ],
                  j = 0,
                  inString = false;
              for ( var i = 0; i < chunk.length; ++i ) {
                var c = chunk.charAt( i );
                if ( c === '"' && ( i === 0 || script.charAt( i - 1 ) !== '\\' ) ) {
                  inString = !inString;
                }
                if ( j === 0 && c === ':' && !inString ) {
                  j = 1;
                }
                else {
                  parts[j] += c;
                }
              }
              parts[0] = parts[0].trim();
              parts[1] = parts[1].trim();
              if ( parts[0].charAt( 0 ) !== '"' ) {
                parts[0] = '"' + parts[0] + '"';
              }
              if ( !/(\d|\{|\[|")/.test( parts[1].charAt( 0 ) ) ) {
                parts[1] = '"' + parts[1] + '"';
              }
              return parts.join( ":" );
            } ).join( "," ) + post;

            try {
              parameters.push( JSON.parse( prop ) );
            }
            catch ( e ) {
              console.error( prop );
              throw e;
            }
            start = i;
            if ( parenCount === 0 ) {
              break;
            }
          }
        }

        parameters.unshift( name );
        pliny.the.elder[type].apply( window, parameters );
      }
    }
  }

  function pontificate ( p ) {
    var output = "";

    if ( p.type ) {
      output += "[" + ( p.type.name || p.type ) + "] ";
    }

    output += p.name || p;

    return output;
  }

  var sectionPrefix = "-=-=- ";

  function investigate ( obj, arrName ) {
    var arr = obj[arrName];
    if ( arr ) {
      var output = sectionPrefix;
      if ( obj.type === "class" && arrName === "parameters" ) {
        output += "constructor ";
      }
      output += arrName + ":\n";
      if ( arr instanceof Array ) {
        output += arr.map( function ( n, i ) {
          var s = "\t\t" + i + ": " + pontificate( n );
          if ( n.description ) {
            s += " - " + n.description;
          }
          s += "\n";
          return s;
        } ).join( "" );
      }
      else {
        output += arr;
      }
      return output;
    }
  }

  function identity ( v ) {
    return v;
  }

  var pliniuses = {
    younger: function ( name ) {
      var obj = pliny.the.younger.get( name );
      if ( obj ) {
        var output = pontificate( obj );
        if ( ( obj.type === "function" || obj.type === "class" || obj.type === "method" ) ) {
          output += "(";
          if ( obj.parameters ) {
            output += obj.parameters.map( pontificate ).join( ", " );
          }
          output += ")\n\n";
        }

        output += [
          "parameters",
          "description",
          "events",
          "properties",
          "methods",
          "notes",
          "author" ].map( function ( p ) {
          var o = obj[p];
          if ( o ) {
            if ( o instanceof Array ) {
              return investigate( obj, p );
            }
            else {
              return sectionPrefix + p + ": " + o + "\n";
            }
          }
        } ).filter( identity ).join( "\n" );
        console.log( output );
      }
    },
    elder: {
    }
  };

  pliniuses.younger.get = function ( name ) {
    ascertain( name );
    if ( typeof name === "string" || name instanceof String ) {
      return expose( burlapSack, name );
    }
    else if ( name.help ) {
      return name.help;
    }
  };

  [ "namespace",
    "value",
    "function",
    "class",
    "method" ].forEach( function ( k ) {
    pliniuses.elder[k] = fortify( k );
  } );
  [ "event",
    "property",
    "method",
    "note" ].forEach( function ( k ) {
    pliniuses.elder[k] = congeal( k );
  } );

  return {the: pliniuses};
} )( );