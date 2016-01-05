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

  var crystalBall = /\bpliny\s*\.\s*the\s*\.\s*elder\s*\.\s*(\w+)/gm;
  function ascertain ( name ) {
    var bag = expose( window, name );
    if ( bag && typeof bag === "function" ) {
      var script = bag.toString( );
      var matches = null;
      while ( !!( matches = crystalBall.exec( script ) ) ) {
        var type = matches[1],
            start = matches.index + matches[0].length;
        var parenCount = 0,
            parameters = [ ];
        for ( var i = start; i < script.length; ++i ) {
          var c = script.charAt( i );
          if ( c === '(' ) {
            ++parenCount;
          }
          else if ( c === ')' ) {
            --parenCount;
          }

          if ( c === ',' || parenCount === 0 ) {
            var temp = script.substring( start + 1, i ).trim( );
            temp = temp.replace( /\b([^"]+):/g, function ( v, m ) {
              return "\"" + m + "\":";
            } );
            parameters.push( JSON.parse( temp ) );
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
    var output = p.name;
    if ( p.type ) {
      output += " [" + ( p.type.name || p.type ) + "]";
    }
    return output;
  }

  var vitals = [ "author", "description" ],
      pliniuses = {
        younger: function ( name ) {
          var obj = pliny.the.younger.get( name );
          if ( obj ) {
            var output = pontificate( obj );
            if ( obj.type === "function" ) {
              output += "(" +
                  obj.parameters.map( pontificate ).join( ", " ) +
                  ")";
            }
            output += "\n" + vitals.map( function ( p ) {
              if ( obj[p] ) {
                return "\t" + p + ": " + obj[p] + "\n";
              }
            } ).filter( function ( s ) {
              return s;
            } )
                .join( "" );

            if ( obj.notes ) {
              output += "\tnotes:\n";
              if ( obj.notes instanceof Array ) {
                output += obj.notes.map( function ( n, i ) {
                  return "\t\t" + i + ": " + n;
                } ).join( "\n" );
              }
              else {
                output += obj.notes;
              }
            }
            console.log( output );
          }
        },
        elder: {
          note: function ( name, note ) {
            if ( note ) {
              var bag = inscribe( name );
              if ( bag ) {
                if ( !bag.notes ) {
                  bag.notes = [ ];
                }
                if ( bag.notes.indexOf( note ) === -1 ) {
                  bag.notes.push( note );
                }
              }
            }
          }
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

  return {the: pliniuses};
} )( );