var pliny = ( function ( ) {

  var documentation = {};
  function openBag ( name ) {
    var bag = documentation,
        parts = name.split( "." );
    for ( var i = 0; i < parts.length; ++i ) {
      bag = bag[parts[i]];
    }
    return bag;
  }

  function fillBag ( name ) {
    var bag = documentation,
        parts = name.split( "." ),
        path = "";
    for ( var i = 0; i < parts.length; ++i ) {
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
  function documentor ( type ) {
    return function ( name, info ) {
      info.type = info.type || type;
      var bag = fillBag( name );
      if ( !bag.type ) {
        Object.keys( info ).forEach( function ( k ) {
          bag[k] = info[k];
        } );
      }
    };
  }
  var pliniuses = {
    elder: {
      log: function ( name ) {
        console.log( openBag( name ) );
      }
    },
    younger: {}
  };
  [ "namespace",
    "function",
    "class",
    "method" ].forEach( function ( k ) {
    pliniuses.younger[k] = documentor( k );
  } );
  return {the: pliniuses};
} )( );