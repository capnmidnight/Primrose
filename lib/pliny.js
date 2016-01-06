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

/**
 * Pliny the (Elder|Younger) is a documentation construction system.
 * You create live documentation objects on code assets with Pliny (the Elder),
 * then you read back those documentation objects with Pliny (the Younger).
 * 
 * Pliny is also capable of generating HTML output for your documentation.
 * 
 * Pliny is named after Gaius Plinius Secundus (https://en.wikipedia.org/wiki/Pliny_the_Elder),
 * a scholar and hero, who died trying to save people from the eruption of Mount
 * Vesuvius during the destruction of Pompeii. Also, his nephew Gaius Plinius Caecilius Secundus
 * (https://en.wikipedia.org/wiki/Pliny_the_Younger), through whom we know his uncle.
 */
var pliny = ( function ( ) {

  /**
   * Walks through dot-accessors to retrieve an object out of a root object.
   * 
   * @param {Object} bag - the root object.
   * @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
   * @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
   */
  function openBag ( bag, name ) {
    // Break up the object path
    var parts = name.split( "." );
    // Recurse through objects until we either run out of objects or find the
    // one we're looking for.
    for ( var i = 0; i < parts.length && !!bag; ++i ) {
      bag = bag[parts[i]];
    }
    return bag;
  }

  /**
   * Fills in intermediate levels of an object tree to make the full object tree 
   * accessible, in the documentation database.
   * 
   * @param {String} name - a period-delimited list of object accessors, naming the object we want to fill in.
   * @returns {Object} - the leaf-level filled-in object.
   */
  function fillBag ( name ) {
    // Start at the top level.
    var bag = pliny.the,
        // Break up the object path.
        parts = name.split( "." ),
        // We'll be rebuilding the path as we go, so we can name intermediate objects.
        path = "";
    // Walk through the object tree.
    for ( var i = 0; i < parts.length; ++i ) {
      // Fill in any missing objects.
      if ( !bag[parts[i]] ) {
        bag[parts[i]] = {};
      }

      // The first time we extend the path, it doesn't get a period seperator.
      if ( path.length > 0 ) {
        path += ".";
      }
      path += parts[i];

      // Drill down into the tree.
      bag = bag[parts[i]];

      // If we have a name, and the object hasn't already been named, then we
      // give it a name.
      if ( path.length > 0 && !bag.name ) {
        bag.name = path;
      }
    }
    return bag;
  }

  /**
   * Reads the documentation metadata and builds up the documentation database.
   * 
   * @param {String} type - the name of the type of object for which we're reading metadata: function, class, namespace, etc.
   * @param {String} parentName - a period-delimited list of object accessors, naming the object that stores the object being analyzed.
   * @param {String} info - the metadata object the user provided us.
   */
  function analyzeObject ( type, parentName, info ) {
    // Sometimes, this function gets called through in a contextual state, in
    // which case, we don't care about the actual function call. We fill in
    // the context when we parse any function-type objects that get documented.
    if ( info ) {
      // If the usre didn't supply a type for the metadata object, we infer it
      // from context.
      info.type = info.type || type;

      // Make an object path name for the object we're documenting.
      var fullName = info.name;
      if ( parentName.length > 0 ) {
        fullName = parentName + "." + fullName;
      }

      // After we copy the metadata, we get back the documentation database object
      // that will store the fuller data we get from other objects.
      info = copyObjectMetadata( fullName, info );

      // Find out where we're going to store the object in the metadata database.
      var parentBag = pliny.the;
      if ( parentName.length > 0 ) {
        parentBag = fillBag( parentName );
      }

      // Figure out where in the parent object we're going to store the documentation object.
      var pluralName = type + "s";
      pluralName = pluralName.replace( /ys$/, "ies" ).replace( /ss$/, "ses" );
      if ( !parentBag[pluralName] ) {
        parentBag[pluralName] = [ ];
      }
      var arr = parentBag[pluralName];

      // Make sure we haven't already stored an object by this name.
      var found = false;
      for ( var i = 0; i < arr.length; ++i ) {
        if ( arr[i].name === info.name ) {
          found = true;
        }
      }
      if ( !found ) {
        arr.push( info );
      }
    }
  }

  var scriptPattern = /\bpliny\s*\.\s*the\s*\.\s*elder\s*\.\s*(\w+)/gm;    
  /**
   * Finds the actual object in the scope hierarchy, and:
   *  A) looks for contextual scripts that might be defined in this object
   *  B) creates a live-accessible help function on the object, that we can call from the browser console/Node REPL
   * 
   * @param {String} name - a period-delimited list of object accessors, naming the real object we want to access. 
   * @returns {Object} - the actual object the name refers to, or undefined if such an object exists.
   */
  function setContextualHelp ( name ) {
    
    // Find the real object
    var obj = openBag( window, name );
    if ( obj ) {
      
      // Look for contextual scripts
      if ( typeof obj === "function" ) {
        var script = obj.toString( ),
            matches = null;
        while ( !!( matches = scriptPattern.exec( script ) ) ) {
          var type = matches[1],
              start = matches.index + matches[0].length,
              parameters = parseParameters( script, start );
          
          // Shove in the context.
          parameters.unshift( name );
          
          // And follow the normal documentation path.
          pliny.the.elder[type].apply( window, parameters );
        }
      }
      
      // Create the live-accessible documentation function
      obj.help = pliny.the.younger.bind( window, name );
    }
    return obj;
  }

  /**
   * Copies all of the data the user entered for metadata to the documetation
   * object in the documentation database.
   * 
   * @param {String} name - a period-delimited list of object accessors, naming the documentation object we want to create.
   * @param {Object} info - the metadata object from the user.
   * @returns the documentation object that we created.
   */
  function copyObjectMetadata ( name, info ) {
    var bag = fillBag( name );
    
    // Make sure we aren't setting the data for a second time.
    if ( !bag.type ) {
      
      // Copy all the fields! ALL THE FIELDS!
      for( var k in info ) {
        bag[k] = info[k];
      }
      
      // We try to see if the real object exists yet (whether the documentation
      // before or after the object it is documenting). If it doesn't, then we
      // wait a small amount of time for the rest of the script to execute and
      // then pick up where we left off.
      if ( !setContextualHelp( name ) ) {
        // The setTimeout is to allow the script to continue to load after this
        // particular function has called, so that more of the script can be
        // inspected.
        setTimeout( setContextualHelp, 1, name );
      }
    }
    return bag;
  }

  var openParens = [ '(', '{', '[' ],
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
    return openBag( pliny.the, name );
  };
  
  [ "namespace",
    "event",
    "function",
    "value",
    "class",
    "property",
    "method" ].forEach( function ( k ) {
    pliniuses.elder[k] = analyzeObject.bind( window, k );
  } );
  return {the: pliniuses};
} )( );