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
  function openBag ( bag, name ) {
    if ( typeof name === "string" || name instanceof String ) {
      var parts = name.split( "." );
      for ( var i = 0; i < parts.length && !!bag; ++i ) {
        bag = bag[parts[i]];
      }
      return bag;
    }
  }

  function fillBag ( name ) {
    var bag = pliny.the,
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

  function childAnalyzer ( type ) {
    var pluralName = type + "s";
    pluralName = pluralName.replace( /ys$/, "ies" )
        .replace( /ss$/, "ses" );
    return function ( parentName, info ) {
      if ( info ) {
        info.type = info.type || type;
        var fullName = parentName.length > 0 ? parentName + "." + info.name : info.name;

        info = parentAnalyzer( info.type )( fullName, info );

        var parentBag = parentName.length > 0 && fillBag( parentName ) || pliny.the;
        if ( parentBag ) {
          if ( !parentBag[pluralName] ) {
            parentBag[pluralName] = [ ];
          }
          var arr = parentBag[pluralName];
          for ( var i = 0; i < arr.length; ++i ) {
            if ( arr[i].name === info.name ) {
              return;
            }
          }
          arr.push( info );
        }
      }
    };
  }

  function setContextualHelp ( name, bag ) {
    var obj = openBag( window, name );
    if ( obj ) {
      if ( typeof obj === "function" ) {
        var script = obj.toString( ),
            matches = null;
        while ( !!( matches = crystalBall.exec( script ) ) ) {
          var type = matches[1],
              start = matches.index + matches[0].length,
              parameters = parseParameters( script, start );
          parameters.unshift( name );
          pliny.the.elder[type].apply( window, parameters );
        }
      }
      obj.help = pliny.the.younger.bind( window, name );
    }
    return obj;
  }

  function parentAnalyzer ( type ) {
    return function ( name, info ) {
      var bag = fillBag( name );
      if ( bag && !bag.type ) {
        if ( typeof info === "string" || info instanceof String ) {
          info = {description: info};
        }

        bag.type = type;
        Object.keys( info ).forEach( function ( k ) {
          if ( k !== "value" ) {
            bag[k] = info[k];
          }
          else {
            var parts = name.split( "." ),
                key = parts.pop(),
                elem = parts.join( "." ),
                obj = openBag( window, elem );
            if ( obj ) {
              obj[key] = info.value;
            }
          }
        } );

        if ( !setContextualHelp( name, bag ) ) {
          // The setTimeout is to allow the script to continue to load after this
          // particular function has called, so that more of the script can be
          // inspected.
          setTimeout( setContextualHelp, 1, name, bag );
        }
      }
      return bag;
    };
  }

  var crystalBall = /\bpliny\s*\.\s*the\s*\.\s*elder\s*\.\s*(\w+)/gm,
      openParens = [ '(', '{', '[' ],
      closeParens = [ ')', '}', ']' ];

  function parseParameters ( script, start ) {
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
        parameters.push( parseParameter( script, start, i ) );
        start = i;
        if ( parenCount === 0 ) {
          break;
        }
      }
    }
    return parameters;
  }

  function parseParameter ( script, start, i ) {
    var subScript = script.substring( start + 1, i ).trim( ),
        param = subScript.replace( /\b([^"]+)\b\s*:/g, "\"$1\":" );

    try {
      return JSON.parse( param );
    }
    catch ( e ) {
      console.error( subScript, "=>", param );
      throw e;
    }
  }

  function shortDescription ( p ) {
    var output = "";

    if ( p.type ) {
      output += "[" + ( p.type.name || p.type ) + "] ";
    }

    output += p.name || p;

    if ( p.type === "function" || p.type === "method" ) {
      output += "(";
      if ( p.parameters ) {
        output += p.parameters.map( shortDescription ).join( "," );
      }
      output += ")";
    }

    return output;
  }

  var sectionPrefix = "-=-=- ";

  function arrayDescription ( obj, arrName ) {
    var arr = obj[arrName];
    if ( arr ) {
      var output = sectionPrefix;
      if ( obj.type === "class" && arrName === "parameters" ) {
        output += "constructor ";
      }
      output += arrName + ":\n";
      if ( arr instanceof Array ) {
        output += arr.map( function ( n, i ) {
          var s = "\t\t" + i + ": " + shortDescription( n );
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
        var output = shortDescription( obj );
        if ( ( obj.type === "function" || obj.type === "class" || obj.type === "method" ) ) {
          output += "(";
          if ( obj.parameters ) {
            output += obj.parameters.map( shortDescription ).join( ", " );
          }
          output += ")";
        }
        
        output += "\n\n" + [
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
              return arrayDescription( obj, p );
            }
            else {
              return sectionPrefix + p + ": " + o + "\n";
            }
          }
        } ).filter( identity ).join( "\n" );
        console.log( output );
      }
    },
    elder: {}
  };

  pliniuses.younger.get = function ( name ) {
    if ( typeof name === "string" || name instanceof String ) {
      return openBag( pliny.the, name );
    }
  };

  [ "namespace",
    "event",
    "function",
    "value",
    "class",
    "property",
    "method" ].forEach( function ( k ) {
    pliniuses.elder[k] = childAnalyzer( k );
  } );

  return {the: pliniuses};
} )( );