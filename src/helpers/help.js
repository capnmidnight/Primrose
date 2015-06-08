function help ( obj ) {
  var funcs = { };
  var props = { };
  var evnts = [ ];
  if ( obj ) {
    for ( var field in obj ) {
      if ( field.indexOf( "on" ) === 0 && ( obj !== navigator || field !==
          "onLine" ) ) {
        // `online` is a known element that is not an event, but looks like
        // an event to the most basic assumption.
        evnts.push( field.substring( 2 ) );
      }
      else if ( typeof ( obj[field] ) === "function" ) {
        funcs[field] = obj[field];
      }
      else {
        props[field] = obj[field];
      }
    }

    var type = typeof ( obj );
    if ( type === "function" ) {
      type = obj.toString()
          .match( /(function [^(]*)/ )[1];
    }
    else if ( type === "object" ) {
      type = null;
      if ( obj.constructor && obj.constructor.name ) {
        type = obj.constructor.name;
      }
      else {
        var q = [ { prefix: "", obj: window } ];
        var traversed = [ ];
        while ( q.length > 0 && type === null ) {
          var parentObject = q.shift();
          parentObject.___traversed___ = true;
          traversed.push( parentObject );
          for ( field in parentObject.obj ) {
            var testObject = parentObject.obj[field];
            if ( testObject ) {
              if ( typeof ( testObject ) === "function" ) {
                if ( testObject.prototype && obj instanceof testObject ) {
                  type = parentObject.prefix + field;
                  break;
                }
              }
              else if ( !testObject.___tried___ ) {
                q.push( { prefix: parentObject.prefix + field + ".",
                  obj: testObject } );
              }
            }
          }
        }
        traversed.forEach( function ( o ) {
          delete o.___traversed___;
        } );
      }
    }
    obj = {
      type: type,
      events: evnts,
      functions: funcs,
      properties: props
    };

    return obj;
  }
  else {
    console.warn( "Object was falsey." );
  }
}
