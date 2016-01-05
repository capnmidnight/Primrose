var pliny = ( function ( ) {
  var burlapSack = {};
  
  function openBag ( baseBag, name ) {
    var bag = baseBag,
        parts = name.split( "." );
    for ( var i = 0; i < parts.length && !!bag; ++i ) {
      bag = bag[parts[i]];
    }
    return bag;
  }

  function fillBag ( name ) {
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

  function enscribe ( type ) {
    return function ( name, info ) {
      var bag = fillBag( name );
      if ( bag && !bag.type ) {
        bag.type = type;
        Object.keys( info ).forEach( function ( k ) {
          bag[k] = info[k];
        } );
      }
    };
  }

  var docRegex = /\bpliny\s*\.\s*the\s*\.\s*elder\s*\.\s*(\w+)/gm;
  function discover ( name ) {
    var bag = openBag( window, name );
    if ( bag && typeof bag === "function" ) {
      var script = bag.toString( );
      var matches = null;
      while ( !!( matches = docRegex.exec( script ) ) ) {
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

  var pliniuses = {
    younger: function ( name ) {
      var obj = pliny.the.younger.get( name ),
          output = obj.type + ": " + obj.name;
      if ( obj.type === "function" ) {
        output += "(" +
            obj.parameters.map( function ( p ) {
              if ( !p.type ) {
                return p.name;
              }
              else if ( p.type.name ) {
                return p.type.name + ": " + p.name;
              }
              else {
                return p.type + ": " + p.name;
              }
            } ).join( ", " ) +
            ")";
      }
      output += "\n";
      if ( obj.description ) {
        output += "\tdescription: " + obj.description + "\n";
      }
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
      console.log( obj );
      console.log( output );
      return output;
    },
    elder: {
      note: function ( name, note ) {
        if ( note ) {
          var bag = fillBag( name );
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
    discover( name );
    return openBag( burlapSack, name );
  };

  [ "namespace",
    "function",
    "class",
    "method" ].forEach( function ( k ) {
    pliniuses.elder[k] = enscribe( k );
  } );
  /* */
  return {the: pliniuses};
} )( );