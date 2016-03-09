/*
  Primrose v0.21.1 2016-03-06
  
  Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com> (https://www.seanmcbeth.com)
  http://www.primrosevr.com
  https://github.com/capnmidnight/Primrose.git
*/
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

/* global pliny, Primrose */

// Pliny is a documentation construction system. You create live documentation
// objects on code assets with pliny, then you read back those documentation objects
// with pliny.
// 
// Pliny is also capable of generating HTML output for your documentation.
// 
// Pliny is named after Gaius Plinius Secundus (https://en.wikipedia.org/wiki/Pliny_the_Elder),
// a scholar and hero, who died trying to save people from the eruption of Mount
// Vesuvius during the destruction of Pompeii. Also, his nephew Gaius Plinius Caecilius Secundus
// (https://en.wikipedia.org/wiki/Pliny_the_Younger), through whom we know his uncle.

( function ( module, require ) {

  //////////////////////////////////////////////////////////////////////////////
  // Pliny's author is not smart enough to figure out how to make it possible //
  // to use it to document itself, so here's a bunch of comments.             //
  //////////////////////////////////////////////////////////////////////////////
  
  var markdown = require("marked");

  // The default storage location.
  var database = {
    fieldType: "database",
    fullName: "[Global]",
    id: "Global",
    description: "These are the elements in the global namespace."
  };

  function hash ( buf ) {
    var s1 = 1,
        s2 = 0,
        buffer = buf.split( "" ).map( function ( c ) {
      return c.charCodeAt( 0 );
    } );

    for ( var n = 0; n < buffer.length; ++n ) {
      s1 = ( s1 + buffer[n] ) % 32771;
      s2 = ( s2 + s1 ) % 32771;
    }
    return ( s2 << 8 ) | s1;
  }

  // Walks through dot-accessors to retrieve an object out of a root object.
  // 
  // @param {Object} bag - the root object.
  // @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
  // @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
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

  // Figures out if the maybeName parameter is a bag or a string path to a bag,
  // then either gives you back the bag, or finds the bag that the path refers to
  // and gives you that.
  // 
  // @param {Object} bag - the root object.
  // @param {String} maybeName - a period-delimited list of object accessors, naming the object we want to access.
  // @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
  function resolveBag ( bag, maybeName ) {
    if ( typeof maybeName === "string" || maybeName instanceof String ) {
      return openBag( bag, maybeName );
    }
    else {
      return maybeName;
    }
  }

  /////
  // Fills in intermediate levels of an object tree to make the full object tree 
  // accessible, in the documentation database.
  // 
  // @param {String} name - a period-delimited list of object accessors, naming the object we want to fill in.
  // @param {Object} rootObject - the object on which to fill in values.
  // @returns {Object} - the leaf-level filled-in object.
  ///
  function fillBag ( name ) {
    // Start at the top level.
    var bag = database;
    if ( typeof name !== "undefined" && name.length > 0 ) {
      // Break up the object path.
      var parts = name.split( "." ),
          // We'll be rebuilding the path as we go, so we can name intermediate objects.
          path = "",
          // The first time we extend the path, it doesn't get a period seperator.
          sep = "";
      // Walk through the object tree.
      for ( var i = 0; i < parts.length; ++i ) {
        // Fill in any missing objects.
        if ( typeof bag[parts[i]] === "undefined" ) {
          bag[parts[i]] = {};
        }

        path += sep + parts[i];
        sep = ".";

        // Drill down into the tree.
        bag = bag[parts[i]];

        // If we have a name, and the object hasn't already been named, then we
        // give it a name.
        if ( path.length > 0 && !bag.name ) {
          bag.name = path;
        }
      }
    }
    return bag;
  }

  /////
  // Reads the documentation metadata and builds up the documentation database.
  // 
  // @param {String} fieldType - the name of the type of object for which we're reading metadata: function, class, namespace, etc.
  // @param {String} parentName - a period-delimited list of object accessors, naming the object that stores the object being analyzed.
  // @param {String} info - the metadata object the user provided us.
  ///
  function analyzeObject ( fieldType, parentName, info ) {
    // Sometimes, this function gets called through in a contextual state, in
    // which case, we don't care about the actual function call. We fill in
    // the context when we parse any function-type objects that get documented.
    if ( info ) {
      if ( typeof info === "string" || info instanceof String ) {
        var objectName = null;
        // If the object type is a page, then just treat it as a very simple
        // name/description pair that can get Markdown-formatted for display.
        if ( fieldType === "page" ) {
          objectName = parentName;
          parentName = "";
        }
        else {
          var parts = parentName.split( "." );
          objectName = parts.pop();
          parentName = parts.join( "." );
        }
        info = {name: objectName, description: info};
      }

      // If the user didn't supply a type for the metadata object, we infer it
      // from context.
      if ( typeof info.fieldType === 'undefined' ) {
        info.fieldType = fieldType;
      }

      // Make an object path name for the object we're documenting.
      if ( !info.parent && parentName.length > 0 ) {
        info.parent = parentName;
      }

      // Find out where we're going to store the object in the metadata database.
      var parentBag = fillBag( parentName );

      // Figure out where in the parent object we're going to store the documentation object.
      var pluralName = fieldType + "s";
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
        var subArrays = {};

        [ "examples",
          "issues",
          "comments" ].forEach( function ( k ) {
          if ( typeof info[k] !== "undefined" ) {
            subArrays[k] = info[k];
            delete info[k];
          }
        } );

        // After we copy the metadata, we get back the documentation database object
        // that will store the fuller data we get from other objects.
        info = copyObjectMetadata( info );

        arr.push( info );

        // Handle other parent-child relationships.
        if ( info.fieldType === "class" && info.baseClass ) {
          pliny.subClass( info.baseClass, info );
        }

        for ( var k in subArrays ) {
          var subArr = subArrays[k],
              type = k.substring( 0, k.length - 1 );
          for ( var i = 0; i < subArr.length; ++i ) {
            pliny[type]( info.fullName.replace( /::/g, "." ), subArr[i] );
          }
        }
      }
      return info.value;
    }
  }

  /////
  // Copies all of the data the user entered for metadata to the documetation
  // object in the documentation database.
  // 
  // @param {String} name - a period-delimited list of object accessors, naming the documentation object we want to create.
  // @param {Object} info - the metadata object from the user.
  // @returns the documentation object that we created.
  ///
  function copyObjectMetadata ( info ) {
    var fullName = ( info.parent && ( info.parent + "." ) || "" ) + info.name,
        bag = fillBag( fullName );

    // Make sure we aren't setting the data for a second time.
    if ( !bag.fieldType ) {

      // Copy all the fields! ALL THE FIELDS!
      // TODO: don't copy metadata directly to bag object. The bag objects are used
      // as the search path for finding code objects, and some of the metadata field
      // names might clash with code object field names. Maybe have a new metadata
      // table.
      for ( var k in info ) {
        bag[k] = info[k];
      }

      // The fullName is used in titles on documentation articles.
      if ( !bag.fullName ) {
        if ( bag.fieldType === "issue" ) {
          Object.defineProperty( bag, "issueID", {
            get: function () {
              return hash( this.parent + "." + this.name );
            }
          } );
        }
        Object.defineProperty( bag, "fullName", {
          get: function () {
            var output = "";
            if ( this.parent ) {
              output += this.parent;

              // Print the seperator between the parent identifier and the name of
              // the object.
              if ( this.fieldType === "method" || this.fieldType === "property" || this.fieldType === "event" ) {
                // Methods, properties, and events aren't invokable from their class
                // objects, so print them in a different way that doesn't suggest you
                // can dot-access them. I'm using the typical C++ notation for member
                // fields here.
                output += "::";
              }
              else if ( this.fieldType === "example" || this.fieldType === "issue" ) {
                output += ": ";
              }
              else {
                output += ".";
              }
            }
            output += this.name;
            return output;
          }
        } );
      }

      // The ID is used to make DOM elements.
      if ( !bag.id ) {
        Object.defineProperty( bag, "id", {
          get: function () {
            return this.fullName.replace( /(\.|:)/g, "_" ).replace( / /g, "" );
          }
        } );
      }

      // We try to see if the real object exists yet (whether the documentation
      // before or after the object it is documenting). If it doesn't, then we
      // wait a small amount of time for the rest of the script to execute and
      // then pick up where we left off.
      if ( !setContextualHelp( fullName ) ) {
        // The setTimeout is to allow the script to continue to load after this
        // particular function has called, so that more of the script can be
        // inspected.
        setTimeout( setContextualHelp, 1, fullName );
      }
    }
    return bag;
  }

  var scriptPattern = /\bpliny\s*\.\s*(\w+)/gm;
  /////
  // Finds the actual object in the scope hierarchy, and:
  //  A) looks for contextual scripts that might be defined in this object
  //  B) creates a live-accessible help function on the object, that we can call from the browser console/Node REPL
  // 
  // @param {String} name - a period-delimited list of object accessors, naming the real object we want to access. 
  // @returns {Object} - the actual object the name refers to, or undefined if such an object exists.
  ///
  function setContextualHelp ( name ) {
    // Find the real object
    var obj = openBag( window, name );
    if ( obj ) {
      // Look for contextual scripts
      if ( typeof obj === "function" ) {
        var script = obj.toString( ),
            match = null;
        while ( !!( match = scriptPattern.exec( script ) ) ) {
          var fieldType = match[1],
              start = match.index + match[0].length,
              parameters = parseParameters( name, script.substring( start ) );
          // Shove in the context.
          if ( parameters.length === 1 ) {
            parameters.unshift( name );
          }
          else {
            parameters[0] = name + "." + parameters[0];
          }

          // And follow the normal documentation path.
          pliny[fieldType].apply( null, parameters );
        }
      }

      // Create the live-accessible documentation function
      obj.help = pliny.bind( null, name );
    }
    return obj;
  }

  /////
  // When a documentation script is included inside of a function, we need to
  // read the script and parse out the JSON objects so we can later execute
  // the documentation function safely, i.e. not use eval().
  // 
  // @param {String} objName - the name of the object for which we are processing parameters.
  // @param {String} script - the source code of the containing function.
  // @return {Array} - a list of JSON-parsed objects that are the parameters specified at the documentation function call-site (i.e. sans context)
  ///
  function parseParameters ( objName, script ) {
    var parameters = [ ];

    // Walk over the script...
    for ( var i = 0, start = 0, scopeLevel = 0, inString = false; i < script.length; ++i ) {
      // ... a character at a time
      var c = script.charAt( i );

      // Keep track of whether or not we're in a string. We're looking for any
      // quotation marks that are either at the beginning of the string or have
      // not previously been escaped by a backslash...
      if ( c === '"' && ( i === 0 || script.charAt( i - 1 ) !== '\\' ) ) {
        inString = !inString;
      }

      // ... because only then...
      if ( !inString ) {
        // ... can we change scope level. We're only supporting JSON objects,
        // so no need to go any further than this.
        if ( c === '(' || c === '{' || c === '[' ) {
          ++scopeLevel;
        }
        else if ( c === ')' || c === '}' || c === ']' ) {
          --scopeLevel;
        }
      }

      // If we're exited the parameter list, or we're inside the parameter list 
      // and see a comma that is not inside of a string literal...
      if ( scopeLevel === 0 || scopeLevel === 1 && c === ',' && !inString ) {
        // ... save the parameter, skipping the first character because it's always
        // either the open paren for the parameter list or one of the commas
        // between parameters.
        parameters.push( parseParameter( objName, script.substring( start + 1, i ).trim( ) ) );

        // Advance forward the start of the next token.
        start = i;

        // If we left the parameter list, we've found all of the parameters and
        // can quit out of the loop before we get to the end of the script.
        if ( scopeLevel === 0 ) {
          break;
        }
      }
    }
    return parameters;
  }

  ////
  // useful in cases where a functional system really just needs to check the
  // value of a collection.
  ///
  function identity ( v ) {
    return v;
  }

  /////
  // When we've found an individual parameter to a documentation function in a 
  // contextual scope, we need to make sure it's valid JSON before we try to
  // convert it to a real JavaScript object.
  // 
  // @param {String} objName - the name of the object for which we are parsing a parameter.
  // @param {String} script - the subscript portion that refers to a single parameter.
  // @return {Object} - the value that the string represents, parsed with JSON.parse().
  ///
  function parseParameter ( objName, script ) {
    // Make sure all hash key labels are surrounded in quotation marks.
    var stringLiterals = [ ];
    var litReplace = function ( str ) {
      var name = "&STRING_LIT" + stringLiterals.length + ";";
      if ( str[0] === "'" ) {
        str = str.replace( /\\"/g, "&_DBLQUOTE_;" )
            .replace( /\\'/g, "&_SGLQUOTE_;" )
            .replace( /"/g, "\\\"" )
            .replace( /'/g, "\"" )
            .replace( /&_DBLQUOTE_;/g, "\\\"" )
            .replace( /&_SGLQUOTE_;/g, "\\'" );
      }
      stringLiterals.push( str );
      return name;
    };
    var litReturn = function ( a, b ) {
      return stringLiterals[b];
    };
    var param = script
        .replace( /'(\\'|[^'])+'/g, litReplace )
        .replace( /"(\\"|[^"])+"/g, litReplace )
        .replace( /\b(\w+)\b\s*:/g, "\"$1\":" )
        .replace( /&STRING_LIT(\d+);/g, litReturn )
        .replace( /&STRING_LIT(\d+);/g, litReturn )
        .replace( /\\\r?\n/g, "" );

    try {
      return JSON.parse( param );
    }
    catch ( e ) {
      // If we made a bad assumption, this will tell us what the assumption was,
      // while also forwarding on the specific error.
      console.error( objName + ": " + script + " => " + param );
      throw e;
    }
  }

  // A collection of different ways to output documentation data.
  var formatters = {
    /////
    // Find a particular object and print out the documentation for it.
    // 
    // @param {String} name - a period-delimited list of object accessors, naming the object we want to access. 
    ///
    format: function ( name ) {
      var obj = null;
      if ( typeof name === "string" || name instanceof String ) {
        obj = openBag( database, name );
      }
      else {
        obj = name;
      }
      if ( obj ) {
        var output = this.shortDescription( true, obj );

        // The array defines the order in which they will appear.
        output += "\n\n" + [
          "parent",
          "description",
          "parameters",
          "returns",
          "errors",
          "pages",
          "namespaces",
          "classes",
          "functions",
          "values",
          "events",
          "properties",
          "methods",
          "enumerations",
          "records",
          "examples",
          "issues",
          "comments" ].map( formatters.checkAndFormatField.bind( this, obj ) )
            // filter out any lines that returned undefined because they didn't exist
            .filter( identity )
            // concate them all together
            .join( "\n" );
        return output;
      }
    },
    checkAndFormatField: function ( obj, prop, i ) {
      var obj2 = obj[prop];
      if ( obj2 ) {
        return this.formatField( obj, prop, obj2, i );
      }
    }
  };
  // Make HTML that can be written out to a page
  formatters.html = {
    format: function ( name ) {
      var obj = resolveBag( database, name );
      return "<section id=\"" + obj.id + "\" class=\"" + obj.fieldType + "\"><article>" + formatters.format.call( formatters.html, obj ) + "</article></section>";
    },
    /////
    // Puts together a string that describes a top-level field out of a documentation
    // object.
    // 
    // @param {Object} obj - the documentation object out of which we're retrieving the field.
    // @param {String} p - the name of the field we're retrieving out of the documentation object.
    // @return {String} - a description of the field.
    ///
    formatField: function ( obj, propertyName, value ) {
      var output = "";
      if ( obj.fieldType === "enumeration" && propertyName === "values" ) {
        output += this.formatEnumeration( obj, propertyName, value );
      }
      else if ( obj.fieldType === "page" && propertyName === "description" ) {
        output += markdown( value );
      }
      else if ( value instanceof Array ) {
        output += this.formatArray( obj, propertyName, value );
      }
      else if ( propertyName === "parent" ) {
        output += "<p>Contained in <a href=\"#" + pliny.get( value ).id + "\">" + value + "</a></p>";
      }
      else if ( propertyName === "description" ) {
        output += markdown( value );
      }
      else if ( propertyName === "returns" ) {
        output += "<h3>Return value</h3>" + markdown( value );
      }
      else {
        output += "<dl><dt>" + propertyName + "</dt><dd>" + value + "</dd></dl>";
      }
      return output;
    },
    ////
    // Specific fomratting function for Enumerations
    // 
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @param {Array} arr - the array from which we're reading values.
    // @return {String} - the formatted description of the array.
    formatEnumeration: function ( obj, arrName, arr ) {
      var output = "<table><thead><tr><th>Name</th><th>Value</th><tr><thead><tbody>";
      for ( var i = 0; i < arr.length; ++i ) {
        var e = arr[i];
        output += "<tr><td>" + e.name + "</td><td>" + e.description + "</td></tr>";
      }
      output += "</tbody></table>";
      return output;
    },
    ////
    // Specific formatting function for Code Example.
    //
    // @param {Array} arr - an array of objects defining programming examples.
    // @return {String} - a summary/details view of the programming examples.
    examplesFormat: function ( obj, arr ) {
      var output = "";
      for ( var i = 0; i < arr.length; ++i ) {
        var ex = arr[i];
        output += "<div><h3><a href=\"#" + ex.id + "\">" + ex.name + "</a></h3>" + markdown( ex.description ) + "</div>";
      }
      return output;
    },
    ////
    // Specific formatting function for Issues.
    //
    // @param {Array} arr - an array of objects defining issues.
    // @return {String} - a summary/details view of the issues.
    issuesFormat: function ( obj, arr ) {
      var parts = {open: "", closed: ""};
      for ( var i = 0; i < arr.length; ++i ) {
        var issue = arr[i],
            str = "<div><h3><a href=\"#" + issue.id + "\">" + issue.issueID + ": " + issue.name +
            " [" + issue.type + "]</a></h3>" + markdown( issue.description ) + "</div>";
        parts[issue.type] += str;
      }
      return parts.open + "<h2>Closed Issues</h2>" + parts.closed;
    },
    ////
    // Specific formatting function for Comments section of Issues.
    //
    // @param {Array} arr - an array of objects defining comments.
    // @return {String} - a summary/details view of the comment.
    commentsFormat: function ( obj, arr ) {
      var output = "";
      for ( var i = 0; i < arr.length; ++i ) {
        var comment = arr[i];
        output += "<aside><h3>" + comment.name + "</h3>" + markdown( comment.description );
        if ( typeof comment.comments !== "undefined" && comment.comments instanceof Array ) {
          output += this.formatArray( comment, "comments", comment.comments );
        }
        output += "</aside>";
      }
      return output;
    },
    /////
    // Puts together lists of parameters for function signatures, as well as
    // lists of properties and methods for classes and the like.
    // 
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @param {Array} arr - the array from which we're reading values.
    // @return {String} - the formatted description of the array.
    ///
    formatArray: function ( obj, arrName, arr ) {
      var output = "<h2>";
      if ( obj.fieldType === "class" ) {
        if ( arrName === "parameters" ) {
          output += "constructor ";
        }
        else if ( arrName === "functions" ) {
          output += "static ";
        }
      }

      if ( arrName !== "description" ) {
        output += arrName;
      }

      output += "</h2>";

      var formatterName = arrName + "Format";
      if ( this[formatterName] ) {
        output += this[formatterName]( obj, arr );
      }
      else {
        output += "<ul class=\"" + arrName + "\">" + arr.map( this.formatArrayElement.bind( this, arrName ) ).join( "" ) + "</ul>";
      }
      return output;
    },
    /////
    // For individual elements of an array, formats the element so it fits well
    // on the screen. Elements that are supposed to be inline, but have the ability
    // to be drilled-down into, are truncated if they get to be more than 200
    // characters wide.
    // 
    // @param {String} arrName - the name of the array from which we retrieved elements.
    // @param {String} n - one of the array elements.
    // @return {String} - the formatted element, including a newline at the end.
    ///
    formatArrayElement: function ( arrName, n ) {
      var s = "<li>";
      if ( n.description ) {
        var desc = n.description.match(/^(([^\n](\n[^\n])?)+)\n\n/);
        if(desc){
          desc = desc[1] + "...";
        }
        else{
          desc = n.description;
        }
        s += "<dl><dt>" + this.shortDescription( false, n ) + "</dt><dd>" +
            markdown( desc ) + "</dd></dl>";
      }
      else {
        s += this.shortDescription( false, n );
      }
      s += "</li>";
      return s;
    },
    /////
    // Describe an object by type, name, and parameters (if it's a function-type object).
    // @param {Object} p - the documentation object to describe.
    // @return {String} - the description of the documentation object.
    ///
    shortDescription: function ( topLevel, p ) {
      var output = "",
          tag = topLevel ? "h1" : "span",
          isFunction = p.fieldType === "function" || p.fieldType === "method" || p.fieldType === "event",
          isContainer = isFunction || p.fieldType === "class" || p.fieldType === "namespace" || p.fieldType === "enumeration" || p.fieldType === "subClass" || p.fieldType === "record";

      output += "<" + tag + ">";
      if ( isContainer && !topLevel ) {
        output += "<a href=\"#" + p.id + "\">";
      }
      if(p.fieldType !== "page"){
        output += "<code>";
      }
      output += topLevel && p.fieldType !== "example" ? p.fullName : p.name;
      
      if ( p.type ) {
        output += " <span class=\"type\">" + p.type + "</span>";
      }


      // But functions and classes take parameters, so they get slightly more.
      if ( isFunction ) {
        output += "<ol class=\"signatureParameters\">";
        if ( p.parameters ) {
          output += "<li>" + p.parameters.map( function ( p ) {
            return p.name;
          } ).join( "</li><li>" ) + "</li>";
        }
        output += "</ol>";
      }

      if ( isContainer && !topLevel ) {
        output += "</a>";
      }

      if(p.fieldType !== "page"){
        output += "</code>";
      }
      return output + "</" + tag + ">";
    }
  };

  // Output to the Developer console in the browser directly.
  formatters.console = {
    format: function ( name ) {
      return formatters.format.call( formatters.console, name );
    },
    /////
    // Puts together a string that describes a top-level field out of a documentation
    // object.
    // 
    // @params {Object} obj - the documentation object out of which we're retrieving the field.
    // @params {String} p - the name of the field we're retrieving out of the documentation object.
    // @return {String} - a description of the field.
    ///
    formatField: function ( obj, propertyName, value ) {
      if ( value instanceof Array ) {
        return this.formatArray( obj, propertyName, value );
      }
      else if ( propertyName === "description" ) {
        return "\t" + value + "\n";
      }
      else {
        return "\t" + propertyName + ": " + value + "\n";
      }
    },
    /////
    // Puts together lists of parameters for function signatures, as well as
    // lists of properties and methods for classes and the like.
    // 
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @return {String} - the formatted description of the array.
    ///
    formatArray: function ( obj, arrName, arr ) {
      var output = "\t";
      if ( obj.fieldType === "class" ) {
        if ( arrName === "parameters" ) {
          output += "constructor ";
        }
        else if ( arrName === "functions" ) {
          output += "static ";
        }
      }

      if ( arrName !== "description" ) {
        output += arrName + ":\n";
      }

      if ( arr instanceof Array ) {
        output += arr.map( this.formatArrayElement.bind( this, arrName ) ).join( "" );
      }
      else {
        output += arr;
      }
      return output;
    },
    /////
    // For individual elements of an array, formats the element so it fits well
    // on the screen. Elements that are supposed to be inline, but have the ability
    // to be drilled-down into, are truncated if they get to be more than 200
    // characters wide.
    // 
    // @param {String} arrName - the name of the array from which we retrieved elements.
    // @param {String} n - one of the array elements.
    // @param {Number} i - the index of the element in the array.
    // @return {String} - the formatted element, including a newline at the end.
    ///
    formatArrayElement: function ( arrName, n, i ) {
      var s = "\t\t" + i + ": " + this.shortDescription( false, n );
      if ( n.description ) {
        s += " - " + n.description;

        if ( arrName !== "parameters" && arrName !== "properties" && arrName !== "methods" && s.length > 200 ) {
          s = s.substring( 0, 200 ) + "...";
        }
      }
      s += "\n";
      return s;
    },
    /////
    // Describe an object by type, name, and parameters (if it's a function-type object).
    // @param {Object} p - the documentation object to describe.
    // @return {String} - the description of the documentation object.
    ///
    shortDescription: function ( topLevel, p ) {
      // This is the basic description that all objects get.
      var output = "";
      if ( topLevel || p.type ) {
        output += "[" + ( p.type || p.fieldType ) + "] ";
      }

      output += topLevel ? p.fullName : p.name;

      // But functions and classes take parameters, so they get slightly more.
      if ( p.fieldType === "function" || p.fieldType === "method" ) {
        output += "(";
        if ( p.parameters ) {
          output += p.parameters.map( this.shortDescription.bind( this, false ) ).join( ", " );
        }
        output += ")";
      }

      return output;
    }
  };

  function loadFiles ( files, success, failure ) {
    if ( files && files.length > 0 ) {
      if ( typeof success === "undefined" ) {
        return new Promise( loadFiles.bind( null, files ) );
      }
      else {
        var __loadFiles = function ( ) {
          if ( files.length === 0) {
            success();
          }
          else {
            Primrose.HTTP.getText( files.shift(), function ( txt ) {
              var name = "";
              txt = txt.replace( /^#*\s+([^\n]+)\r?\n\s*/, function ( txt, group ) {
                name = group;
                return "";
              } );
              pliny.page( name, txt );
              __loadFiles( );
            }, failure );
          }
        };
        __loadFiles( 0 );
      }
    }
  }

  // Dump the values of an enumeration into the documentation database to be able
  // to report them in the documentation page.
  function setEnumerationValues( enumName, enumeration ){
    for ( var key in enumeration ) {
      var val = enumeration[key];
      if ( enumeration.hasOwnProperty( key ) && typeof ( val ) === "number" ) {
        pliny.value( enumName, {
          name: key,
          type: "Number",
          description: val.toString(),
          value: val
        } );
      }
    }
  }

  // The namespacing object we're going to return to the importing script.
  var pliny = formatters.console.format;
  // Give the user access to the database.
  pliny.database = database;
  // Give the user access to all of the formatters.
  pliny.formats = formatters;
  // Just get the raw data
  pliny.get = openBag.bind( null, pliny.database );
  // Load up Markdown or HTML files
  pliny.load = loadFiles;

  pliny.setEnumerationValues = setEnumerationValues;

  // Create documentation functions for each of the supported types of code objects.
  [ "namespace",
    "event",
    "function",
    "value",
    "class",
    "property",
    "method",
    "enumeration",
    "record",
    "subClass",
    "example",
    "error",
    "issue",
    "comment",
    "page" ].forEach( function ( k ) {
    pliny[k] = analyzeObject.bind( null, k );
  } );

  module.exports = pliny;

} )( typeof module !== 'undefined' && module || ( function ( name ) {
  var module = {};
  Object.defineProperty( module, "exports", {
    get: function () {
      return window[name];
    },
    set: function ( v ) {
      window[name] = v;
    }
  } );
  return module;
} )( "pliny" ), function ( name ) {
  return window[name];
} );
;/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
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

/* global pliny, Primrose */

window.Primrose = ( function () {
  "use strict";

  pliny.namespace( "Primrose", "Primrose helps you make VR applications for web browsers as easy as making other types of interactive web pages.\n\nThis top-level namespace contains classes for manipulating and viewing 3D environments." );
  var Primrose = {};

  pliny.namespace( "Primrose.Input", "The Input namespace contains classes that handle user input, for use in navigating the 3D environment." );
  Primrose.Input = {};

  pliny.namespace( "Primrose.Output", "The Output namespace contains classes that handle output to devices other than the screen (e.g. Audio, Music, etc.)." );
  Primrose.Output = {};

  pliny.namespace( "Primrose.Text", "The Text namespace contains classes everything regarding the Primrose source code editor." );
  Primrose.Text = {};

  pliny.namespace( "Primrose.Text.CodePages", "The CodePages namespace contains international keyboard parameters." );
  Primrose.Text.CodePages = {};

  pliny.namespace( "Primrose.Text.CommandPacks", "The CommandPacks namespace contains sets of keyboard shortcuts for different types of text-oriented controls." );
  Primrose.Text.CommandPacks = {};

  pliny.namespace( "Primrose.Text.Controls", "The Controls namespace contains different types of text-oriented controls." );
  Primrose.Text.Controls = {};

  pliny.namespace( "Primrose.Text.Grammars", "The Grammars namespace contains grammar parsers for different types of programming languages, to enable syntax highlighting." );
  Primrose.Text.Grammars = {};

  pliny.namespace( "Primrose.Text.OperatingSystems", "The OperatingSystems namespace contains sets of keyboard shortcuts for different operating systems." );
  Primrose.Text.OperatingSystems = {};

  pliny.namespace( "Primrose.Text.Renderers", "The Renderers namespace contains different renderers for using the general Text Editor logic in different output systems. Current, Canvas2D is the only system that works. A system for DOM elements exists, but it is broken and not likely to be fixed any time soon." );
  Primrose.Text.Renderers = {};

  pliny.namespace( "Primrose.Text.Themes", "The Themes namespace contains color themes for text-oriented controls, for use when coupled with a parsing grammar." );
  Primrose.Text.Themes = {};

  pliny.value( "Primrose", {
    name: "SYS_FONTS",
    type: "String",
    description: "A selection of fonts that will match whatever the user's operating system normally uses."
  } );
  Primrose.SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";

  pliny.value( "Primrose", {
    name: "SKINS",
    type: "Array of String",
    description: "A selection of color values that closely match skin colors of people."
  } );
  Primrose.SKINS = [ "#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2",
    "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49",
    "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836",
    "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000",
    "#5B0001", "#302E2E" ];

  pliny.value( "Primrose", {
    name: "SKIN_VALUES",
    type: "Array of Number",
    description: "A selection of color values that closely match skin colors of people."
  } );
  Primrose.SKIN_VALUES = Primrose.SKINS.map( function ( s ) {
    return parseInt( s.substring( 1 ), 16 );
  } );

// snagged and adapted from http://detectmobilebrowsers.com/
  pliny.value( "", {
    name: "isMobile",
    type: "Boolean",
    description: "Flag indicating the current system is a recognized \"mobile\"\n\
device, usually possessing a motion sensor."
  });  
  window.isMobile = ( function ( a ) {
      return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
          a ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
              a.substring( 0, 4 ) );
    } )( navigator.userAgent || navigator.vendor || window.opera );

  pliny.value( "", {
    name: "isiOS",
    type: "Boolean",
    description: "Flag indicating the current system is a device running the Apple\n\
iOS operating system: iPad, iPod Touch, iPhone. Useful for invoking optional code\n\
paths necessary to deal with deficiencies in Apple's implementation of web standards."} );
  window.isiOS = /iP(hone|od|ad)/.test( navigator.userAgent || "" );


  pliny.value( "", {
    name: "isOSX",
    type: "Boolean",
    description: "Flag indicating the current system is a computer running the Apple\n\
OSX operating system. Useful for changing keyboard shortcuts to support Apple's\n\
idiosynchratic, concensus-defying keyboard shortcuts."
  });
  window.isOSX = /Macintosh/.test( navigator.userAgent || "" );

  pliny.value( "", {
    name: "isWindows",
    type: "Boolean",
    description: "Flag indicating the current system is a computer running one of\n\
the Microsoft Windows operating systems. We have not yet found a use for this flag."
  });
  window.isWindows = /Windows/.test( navigator.userAgent || "" );

  pliny.value( "", {
    name: "isOpera",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Opera.\n\
Opera is a substandard browser that lags adoption of cutting edge web technologies,\n\
so you are not likely to need this flag if you are using Primrose, other than to\n\
cajole users into downloading a more advanced browser such as Mozilla Firefox or\n\
Google Chrome."
  });
  window.isOpera = !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0;

  pliny.value( "", {
    name: "isSafari",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Safari.\n\
Safari is an overly opinionated browser that thinks users should be protected from\n\
themselves in such a way as to prevent users from gaining access to the latest in\n\
cutting-edge web technologies. Essentially, it was replaced Microsoft Internet\n\
Explorer as the Internet Explorer of the web."
  });
  window.isSafari = Object.prototype.toString.call( window.HTMLElement ).indexOf( 'Constructor' ) > 0;

  pliny.value( "", {
    name: "isChrome",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Chrome\n\
or Chromium. Chromium was one of the first browsers to implement virtual reality\n\
features directly in the browser, thanks to the work of Brandon \"Toji\" Jones."
  });
  window.isChrome = !!window.chrome && !window.isOpera;

  pliny.value( "", {
    name: "isFirefox",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Firefox.\n\
Firefox was one of the first browsers to implement virtual reality features directly\n\
in the browser, thanks to the work of the MozVR team."
  });
  window.isFirefox = typeof window.InstallTrigger !== 'undefined';

  pliny.value( "", {
    name: "isWebKit",
    type: "Boolean",
    description: "Flag indicating the browser is one of Chrome, Safari, or Opera.\n\
WebKit browsers have certain issues in common that can be treated together, like\n\
a common basis for orientation events."
  });
  window.isWebKit = window.isiOS || window.isOpera || window.isChrome;

  pliny.value( "", {
    name: "isIE",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Internet\n\
Explorer. Once the bane of every web developer's existence, it has since passed\n\
the torch on to Safari in all of its many useless incarnations."
  });
  window.isIE = /*@cc_on!@*/false || !!document.documentMode;

  pliny.value( "", {
    name: "isVR",
    type: "Boolean",
    description: "Flag indicating the browser supports awesomesauce as well as\n\
the WebVR standard in some form."
  });
  window.isVR = !!(navigator.getVRDevices || navigator.getVRDisplays);

  pliny.issue( "", {
    name: "Make a getting started page.",
    type: "closed",
    description: "Make a page that explains downloading the right dependencies,\n\
making a simple page using a sample scene, making it VR capable, and adding\n\
objects to it."
  } );

  pliny.issue( "", {
    name: "Make a simple Blender tutorial.",
    type: "open",
    description: "Show where to download Blender and how to use it to make a smooth-shaded,\n\
flat color, low-poly scene and make it VR ready."
  } );

  pliny.issue( "", {
    name: "Make a more advanced Blender tutorial.",
    type: "open",
    description: "Show how to do texturing in Blender."
  } );

  pliny.issue( "", {
    name: "Make a simple lighting tutorial.",
    type: "open",
    description: "Basic point and spot lights."
  } );

  pliny.issue( "", {
    name: "Make a simple video tutorial.",
    type: "open",
    description: "Put a quad in the scene on which a movie can play. Make it look\n\
like a drive-in to be really cool."
  } );

  pliny.issue( "", {
    name: "Make a drum machine tutorial.",
    type: "open",
    description: "Show how to create elements and useful interactions with those elements."
  } );

  pliny.issue( "", {
    name: "Make a 3D IDE tutorial.",
    type: "open",
    description: "Show how to build the 3D editor demo."
  } );

  pliny.issue( "", {
    name: "Make a basic server tutorial.",
    type: "open",
    description: "Show how to setup a basic Node WebSockets server to be able to do\n\
multiplayer chat."
  } );

  pliny.issue( "", {
    name: "Make an adventure demo.",
    type: "open",
    description: "Make a small adventure game of locked treasure chests and mazes."
  } );

  pliny.issue( "", {
    name: "Make an HMD overview page.",
    type: "open",
    description: "Go into what is available, what are the key components, and how\n\
to build your own Google Cardboard."
  } );

  pliny.issue( "", {
    name: "Make a tutorial on modeling a scene with Primrose and saving/exporting it.",
    type: "open",
    description: "Live program a scene and save it to an HTML file that can be put up\n\
on a website and be ready to run in VR."
  } );

  pliny.issue( "", {
    name: "Make a CHANGELOG",
    type: "open",
    description: "Document the changes between versions better."
  } );

  pliny.issue( "", {
    name: "Make better icons for full-screen view.",
    type: "open",
    description: "The current icons don't match each other, and they are in a bad place on screen."
  } );

  pliny.issue( "", {
    name: "Link examples to each other.",
    type: "open",
    description: "Make it so you can jump from one example to another, both in 2D and VR contexts."
  } );

  pliny.issue( "", {
    name: "Make more examples on CodePen.",
    type: "open",
    description: "Demonstrate using Primrose with the different options available in CodePen."
  } );

  pliny.issue( "", {
    name: "Update the README.",
    type: "open",
    description: "It's woefully out of date."
  } );

  pliny.issue( "", {
    name: "Make Haptic Glove tutorial.",
    type: "open",
    description: "Offer the supplies for sale, and show how to build a haptic glove\n\
that can be used with Primrose."
  } );

  pliny.issue( "", {
    name: "Adopt ES6.",
    type: "open",
    description: "Classes and arrow functions are good. Rely on browser support for\n\
development. Setup a transpiler for production builds."
  } );

  pliny.issue( "", {
    name: "Figure out a better module system.",
    type: "open",
    description: "I still want Primrose to be an \"Include one JS file\" type of library\n\
for working in browsers. But I also want the component parts to work well with Node\n\
and other neuveau JS shenanigans."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with A-Frame.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with SceneVR.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with Vizor.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with X3D.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with JanusVR.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  pliny.issue( "", {
    name: "Investigate compatability with AltspaceVR.",
    type: "open",
    description: "If it's easy, it won't hurt."
  } );

  return Primrose;
} )();;/* global Primrose, pliny */

Primrose.Angle = ( function ( ) {
  var DEG2RAD = Math.PI / 180,
      RAD2DEG = 180 / Math.PI;
  pliny.class( "Primrose", {
    name: "Angle",
    description: "The Angle class smooths out the jump from 360 to 0 degrees. It\n\
keeps track of the previous state of angle values and keeps the change between\n\
angle values to a maximum magnitude of 180 degrees, plus or minus. This allows for\n\
smoother opperation as rotating past 360 degrees will not reset to 0, but continue\n\
to 361 degrees and beyond, while rotating behind 0 degrees will not reset to 360\n\
but continue to -1 and below.\n\
\n\
When instantiating, choose a value that is as close as you can guess will be your\n\
initial sensor readings.\n\
\n\
This is particularly important for the 180 degrees, +- 10 degrees or so. If you\n\
expect values to run back and forth over 180 degrees, then initialAngleInDegrees\n\
should be set to 180. Otherwise, if your initial value is anything slightly larger\n\
than 180, the correction will rotate the angle into negative degrees, e.g.:\n\
* initialAngleInDegrees = 0\n\
* first reading = 185\n\
* updated degrees value = -175\n\
\n\
It also automatically performs degree-to-radian and radian-to-degree conversions.\n\
For more information, see [Radian - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Radian).\n\
\n\
![Radians](https://upload.wikimedia.org/wikipedia/commons/4/4e/Circle_radians.gif)",
    parameters: [
      {name: "initialAngleInDegrees", type: "Number", description: "(Required) Specifies the initial context of the angle. Zero is not always the correct value."}
    ],
    examples: [ {
        name: "Basic usage",
        description: "To use the Angle class, create an instance of it with `new`, and modify the `degrees` property.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var a = new Primrose.Angle(356);\n\
    a.degrees += 5;\n\
    console.log(a.degrees);\n\
\n\
## Results:\n\
> 361"
      }, {
        name: "Convert degrees to radians",
        description: "Create an instance of Primrose.Angle, modify the `degrees` property, and read the `radians` property.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var a = new Primrose.Angle(10);\n\
    a.degrees += 355;\n\
    console.log(a.radians);\n\
\n\
## Results:\n\
> 0.08726646259971647"
      }, {
        name: "Convert radians to degress",
        description: "Create an instance of Primrose.Angle, modify the `radians` property, and read the `degrees` property.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var a = new Primrose.Angle(0);\n\
    a.radians += Math.PI / 2;\n\
    console.log(a.degrees);\n\
\n\
## Results:\n\
> 90"
      } ]
  } );

  function Angle ( v ) {
    if ( typeof ( v ) !== "number" ) {
      throw new Error( "Angle must be initialized with a number. Initial value was: " + v );
    }

    var value = v,
        delta = 0,
        d1,
        d2,
        d3;
    pliny.property( {
      name: "degrees",
      type: "Number",
      description: "Get/set the current value of the angle in degrees."
    } );
    Object.defineProperty( this, "degrees", {
      set: function ( newValue ) {
        do {
          // figure out if it is adding the raw value, or whole
          // rotations of the value, that results in a smaller
          // magnitude of change.
          d1 = newValue + delta - value;
          d2 = Math.abs( d1 + 360 );
          d3 = Math.abs( d1 - 360 );
          d1 = Math.abs( d1 );
          if ( d2 < d1 && d2 < d3 ) {
            delta += 360;
          }
          else if ( d3 < d1 ) {
            delta -= 360;
          }
        } while ( d1 > d2 || d1 > d3 );
        value = newValue + delta;
      },
      get: function ( ) {
        return value;
      }
    } );
  }

  pliny.property( "Primrose.Angle", {
    name: "radians",
    type: "Number",
    description: "Get/set the current value of the angle in radians."
  } );
  Object.defineProperty( Angle.prototype, "radians", {
    get: function ( ) {
      return this.degrees * DEG2RAD;
    },
    set: function ( val ) {
      this.degrees = val * RAD2DEG;
    }
  } );

  return Angle;
} )( );

pliny.issue( "Primrose.Angle", {
  name: "document Angle",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.Angle](#Primrose_Angle) class in the  directory"
} );
;/* global Primrose, THREE, pliny, emit */

Primrose.BaseControl = ( function () {
  "use strict";

  var ID = 1;

  pliny.class( "Primrose", {
    name: "BaseControl",
    description: "The BaseControl class is the parent class for all 3D controls.\n\
It manages a unique ID for every new control, the focus state of the control, and\n\
performs basic conversions from DOM elements to the internal Control format."
  } );

  function BaseControl () {
    pliny.property( {
      name: "controlID",
      type: "Number",
      description: "Automatically incrementing counter for controls, to make sure there is a distinct differentiator between them all."
    } );
    this.controlID = ID++;

    pliny.property( {
      name: "focused",
      type: "Boolean",
      description: "Flag indicating this control has received focus. You should theoretically only read it."
    } );
    this.focused = false;

    pliny.property( {
      name: "listeners",
      type: "Object",
      description: "A bag of arrays that hold the callback functions for each event. The child class of BaseControl may add such arrays to this object. By default, includes listeners for focus and blur events."
    } );
    this.listeners = {
      focus: [ ],
      blur: [ ]
    };
  }

  pliny.method( "Primrose.BaseControl", {
    name: "addEventListener",
    description: "Adding an event listener registers a function as being ready to receive events.",
    parameters: [
      {name: "evt", type: "String", description: "The name of the event for which we are listening."},
      {name: "thunk", type: "Function", description: "The callback to fire when the event occurs."}
    ],
    examples: [ {
        name: "Add an event listener.",
        description: "The `addEventListener()` method operates nearly identically\n\
to the method of the same name on DOM elements.\n\
\n\
    grammar(\"JavaScript\");\n\
    var txt = new Primrose.Text.Controls.TextBox();\n\
    txt.addEventListener(\"mousemove\", console.log.bind(console, \"mouse move\"));\n\
    txt.addEventListener(\"keydown\", console.log.bind(console, \"key down\"));"
      } ]
  } );
  BaseControl.prototype.addEventListener = function ( event, func ) {
    if ( this.listeners[event] ) {
      this.listeners[event].push( func );
    }
  };

  pliny.method( "Primrose.BaseControl", {
    name: "focus",
    description: "Sets the focus property of the control, does not change the focus property of any other control.",
    examples: [ {
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track\n\
focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
    grammar(\"JavaScript\");\n\
    var ctrls = [\n\
      new Primrose.Text.Controls.TextBox(),\n\
      new Primrose.Text.Controls.TextBox(),\n\
      new Primrose.Text.Button()\n\
    ];\n\
\n\
    function focusOn(id){\n\
      for(var i = 0; i < ctrls.length; ++i){\n\
        var c = ctrls[i];\n\
        if(c.controlID === id){\n\
          c.focus();\n\
        }\n\
        else{\n\
          c.blur();\n\
        }\n\
      }\n\
    }"
      } ]
  } );
  BaseControl.prototype.focus = function () {
    this.focused = true;
    emit.call( this, "focus", {target: this} );
  };

  pliny.method( "Primrose.BaseControl", {
    name: "blur",
    description: "Unsets the focus property of the control, does not change the focus property of any other control.",
    examples: [ {
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track\n\
focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
    grammar(\"JavaScript\");\n\
    var ctrls = [\n\
      new Primrose.Text.Controls.TextBox(),\n\
      new Primrose.Text.Controls.TextBox(),\n\
      new Primrose.Text.Button()\n\
    ];\n\
    \n\
    function focusOn(id){\n\
      for(var i = 0; i < ctrls.length; ++i){\n\
        var c = ctrls[i];\n\
        if(c.controlID === id){\n\
          c.focus();\n\
        }\n\
        else{\n\
          c.blur();\n\
        }\n\
      }\n\
    }"
      }
    ]
  } );
  BaseControl.prototype.blur = function () {
    this.focused = false;
    emit.call( this, "blur", {target: this} );
  };

  var NUMBER_PATTERN = "([+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+)))",
      DELIM = "\\s*,\\s*",
      UNITS = "(?:em|px)",
      TRANSLATE_PATTERN = new RegExp( "translate3d\\s*\\(\\s*" +
          NUMBER_PATTERN + UNITS + DELIM +
          NUMBER_PATTERN + UNITS + DELIM +
          NUMBER_PATTERN + UNITS + "\\s*\\)", "i" ),
      ROTATE_PATTERN = new RegExp( "rotate3d\\s*\\(\\s*" +
          NUMBER_PATTERN + DELIM +
          NUMBER_PATTERN + DELIM +
          NUMBER_PATTERN + DELIM +
          NUMBER_PATTERN + "rad\\s*\\)", "i" );


  pliny.method( "Primrose.BaseControl", {
    name: "copyElement",
    description: "Copies properties from a DOM element that the control is supposed to match.",
    parameters: [
      {name: "elem", type: "Element", description: "The element--e.g. a button or textarea--to copy."}
    ],
    examples: [ {
        name: "Rough concept",
        description: "The class is not used directly. Its methods would be used in a base\n\
class that implements its functionality.\n\
\n\
The `copyElement()` method gets used when a DOM element is getting \"converted\"\n\
to a 3D element on-the-fly.\n\
\n\
    grammar(\"JavaScript\");\n\
    var myDOMButton = document.querySelector(\"button[type='button']\"),\n\
      my3DButton = new Primrose.Button();\n\
    my3DButton.copyElement(myDOMButton);"
      }
    ]
  } );
  BaseControl.prototype.copyElement = function ( elem ) {
    this.element = elem;
    if ( elem.style.transform ) {
      var match = TRANSLATE_PATTERN.exec( elem.style.transform );
      if ( match ) {
        this.position.set(
            parseFloat( match[1] ),
            parseFloat( match[2] ),
            parseFloat( match[3] ) );
      }
      match = ROTATE_PATTERN.exec( elem.style.transform );
      if ( match ) {
        this.quaternion.setFromAxisAngle(
            new THREE.Vector3().set(
            parseFloat( match[1] ),
            parseFloat( match[2] ),
            parseFloat( match[3] ) ),
            parseFloat( match[4] ) );
      }
    }
  };

  pliny.issue( "Primrose.BaseControl", {
    name: "document BaseControl",
    type: "closed",
    description: "Finish writing the documentation for the [Primrose.BaseControl](#Primrose_BaseControl) class in the  directory"
  } );

  return BaseControl;
} )();;/* global Primrose, THREE, emit, pliny */

Primrose.Button = ( function () {
  pliny.class( "Primrose", {
    name: "Button",
    parameters: [
      {name: "model", type: "THREE.Object3D", description: "A 3D model to use as the graphics for this button."},
      {name: "name", type: "String", description: "A name for the button, to make it distinct from other buttons."},
      {name: "options", type: "Object", description: "A hash of options:\n\t\t\tmaxThrow - The limit for how far the button can be depressed.\n\t\t\tminDeflection - The minimum distance the button must be depressed before it is activated.\n\t\t\tcolorPressed - The color to change the button cap to when the button is activated.\n\t\t\tcolorUnpressed - The color to change the button cap to when the button is deactivated.\n\t\t\ttoggle - True if deactivating the button should require a second click. False if the button should deactivate when it is released."}
    ],
    description: "A 3D button control, with a separate cap from a stand that it sits on. You click and depress the cap on top of the stand to actuate."
  } );
  function Button ( model, name, options ) {
    Primrose.BaseControl.call( this );

    options = combineDefaults( options, Button );
    options.minDeflection = Math.cos( options.minDeflection );
    options.colorUnpressed = new THREE.Color( options.colorUnpressed );
    options.colorPressed = new THREE.Color( options.colorPressed );

    pliny.event( {
      name: "click",
      description: "Occurs when the button is activated."
    } );
    this.listeners.click = [ ];

    pliny.event( {
      name: "release",
      description: "Occurs when the button is deactivated."
    } );
    this.listeners.release = [ ];

    pliny.property( {
      name: "base",
      type: "THREE.Object3D",
      description: "The stand the button cap sits on."
    } );
    this.base = model.children[1];

    pliny.property( {
      name: "base",
      type: "THREE.Object3D",
      description: "The moveable part of the button, that triggers the click event."
    } );
    this.cap = model.children[0];
    this.cap.name = name;
    this.cap.material = this.cap.material.clone();
    this.cap.button = this;
    this.cap.base = this.base;

    pliny.property( {
      name: "container",
      type: "THREE.Object3D",
      description: "A grouping collection for the base and cap."
    } );
    this.container = new THREE.Object3D();
    this.container.add( this.base );
    this.container.add( this.cap );

    pliny.property( {
      name: "color",
      type: "Number",
      description: "The current color of the button cap."
    } );
    this.color = this.cap.material.color;
    this.name = name;
    this.element = null;



    this.startUV = function () {
      this.color.copy( options.colorPressed );
      if ( this.element ) {
        this.element.click();
      }
      else {
        emit.call( this, "click" );
      }
    };

    this.moveUV = function () {

    };

    this.endPointer = function () {
      this.color.copy( options.colorUnpressed );
      emit.call( this, "release" );
    };
  }

  inherit( Button, Primrose.BaseControl );

  pliny.record( "Primrose.Button.DEFAULTS", "Default option values that override undefined options passed to the Button class." );
  pliny.value( "Primrose.Button.DEFAULTS", {name: "maxThrow", type: "Number", description: "The limit for how far the button can be depressed."} );
  pliny.value( "Primrose.Button.DEFAULTS", {name: "minDeflection", type: "Number", description: "The minimum distance the button must be depressed before it is activated."} );
  pliny.value( "Primrose.Button.DEFAULTS", {name: "colorUnpressed", type: "Number", description: "The color to change the button cap to when the button is deactivated."} );
  pliny.value( "Primrose.Button.DEFAULTS", {name: "colorPressed", type: "Number", description: "The color to change the button cap to when the button is activated."} );
  pliny.value( "Primrose.Button.DEFAULTS", {name: "toggle", type: "Boolean", description: "True if deactivating the button should require a second click. False if the button should deactivate when it is released."} );
  Button.DEFAULTS = {
    maxThrow: 0.1,
    minDeflection: 10,
    colorUnpressed: 0x7f0000,
    colorPressed: 0x007f00,
    toggle: true
  };


  pliny.property( "Primrose.Button", {
    name: "position",
    type: "THREE.Vector3",
    description: "The location of the button."
  } );
  Object.defineProperty( Button.prototype, "position", {
    get: function () {
      return this.container.position;
    }
  } );

  return Button;
} )();

pliny.issue( "Primrose.Button", {
  name: "document Button",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.Button](#Primrose_Button) class in the  directory"
} );
;/* global Primrose, pliny */

Primrose.ButtonFactory = ( function () {

  var buttonCount = 0;

  pliny.class( "Primrose", {
    name: "ButtonFactory",
    description: "Loads a model file and holds the data, creating clones of the data whenever a new button is desired.",
    parameters: [
      {name: "templateFile", type: "(String|THREE.Object3D}", description: "Either a path to a Three.js formatted JSON file, or a THREE.Object3D, that specifies a 3D model for a button, to be used as a template."},
      {name: "options", type: "Object", description: "The options to apply to all buttons that get created by the factory."},
      {name: "complete", type: "Function", description: "A callback function to indicate when the loading process has completed, if `templateFile` was a String path."}
    ]
  } );
  function ButtonFactory ( templateFile, options, complete ) {

    pliny.property( {
      name: "options",
      type: "Object",
      description: "The options that the user provided, so that we might change them after the factory has been created, if we so choose."
    } );
    this.options = options;

    if ( typeof templateFile === "string" ) {
      Primrose.ModelLoader.loadObject( templateFile, function ( obj ) {
        this.template = obj;
        if ( complete ) {
          complete();
        }
      }.bind( this ) );
    }
    else {
      pliny.property( {
        name: "template",
        type: "THREE.Object3D",
        description: "The 3D model for the button, that will be cloned every time a new button is created."
      } );
      this.template = templateFile;
    }
  }

  pliny.method( "Primrose.ButtonFactory", {
    name: "create",
    description: "Clones all of the geometry, materials, etc. in a 3D model to create a new copy of it. This really should be done with instanced objects, but I just don't have the time to deal with it right now.",
    parameters: [
      {name: "toggle", type: "Boolean", description: "True if the new button should be a toggle button (requiring additional clicks to deactivate) or a regular button (deactivating when the button is released, aka \"momentary\"."}
    ],
    return: "The cloned button that which we so desired."
  } );
  ButtonFactory.prototype.create = function ( toggle ) {
    var name = "button" + ( ++buttonCount );
    var obj = this.template.clone();
    var btn = new Primrose.Button( obj, name, this.options, toggle );
    return btn;
  };

  return ButtonFactory;
} )();

pliny.issue( "Primrose.ButtonFactory", {
  name: "document ButtonFactory",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.ButtonFactory](#Primrose_ButtonFactory) class in the  directory"
} );
;/* global Primrose, pliny */

Primrose.DOM = ( function () {

  pliny.namespace( "Primrose.DOM", "A few functions for manipulating DOM." );
  var DOM = {};


  pliny.function( "Primrose.DOM", {
    name: "cascadeElement",
    description: "* If `id` is a string, tries to find the DOM element that has said ID\n\
  * If it exists, and it matches the expected tag type, returns the element, or throws an error if validation fails.\n\
  * If it doesn't exist, creates it and sets its ID to the provided id, then returns the new DOM element, not yet placed in the document anywhere.\n\
* If `id` is a DOM element, validates that it is of the expected type,\n\
  * returning the DOM element back if it's good,\n\
  * or throwing an error if it is not\n\
* If `id` is null, creates the DOM element to match the expected type.",
    parameters: [
      {name: "id", type: "(String|Element)", description: "A vague reference to the element. Either a String id where the element can be had, a String id to give a newly created element if it does not exist, or an Element to manipulate and validate"},
      {name: "tag", type: "String", description: "The HTML tag name of the element we are finding/creating/validating."},
      {name: "DOMClass", type: "Class", description: "The class Function that is the type of element that we are frobnicating."}
    ],
    returns: "DOM element",
    examples: [ { name: "Get an element by ID that already exists.", description: "Assuming the following HTML snippet:\n\
\n\
    grammar(\"HTML\");\n\
    <div>\n\
      <div id=\"First\">first element</div>\n\
      <section id=\"second-elem\">\n\
        Second element\n\
        <img id=\"img1\" src=\"img.png\">\n\
      </section>\n\
    </div>\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var elem = Primrose.DOM.cascadeElement(\"second-elem\", \"section\", HTMLElement);\n\
    console.assert(elem.textContent === \"Second element\");"},
    { name: "Validate the tag type.", description: "Assuming the following HTML snippet:\n\
\n\
    grammar(\"HTML\");\n\
    <div>\n\
      <div id=\"First\">first element</div>\n\
      <section id=\"second-elem\">\n\
        Second element\n\
        <img id=\"img1\" src=\"img.png\">\n\
      </section>\n\
    </div>\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    //The following line of code should cause a runtime error.\n\
    Primrose.DOM.cascadeElement(\"img1\", \"section\", HTMLElement);"},
    { name: "Create an element.", description: "Assuming the following HTML snippet:\n\
\n\
    grammar(\"HTML\");\n\
    <div>\n\
      <div id=\"First\">first element</div>\n\
      <section id=\"second-elem\">\n\
        Second element\n\
        <img id=\"img1\" src=\"img.png\">\n\
      </section>\n\
    </div>\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var elem = Primrose.DOM.cascadeElement(\"img2\", \"img\", HTMLImageElement);\n\
    console.assert(elem.id === \"img2\");\n\
    console.assert(elem.parentElement === null);\n\
    document.body.appendChild(elem);\n\
    console.assert(elem.parentElement === document.body);"}]
  } );
  DOM.cascadeElement = function ( id, tag, DOMClass ) {
    var elem = null;
    if ( id === null ) {
      elem = document.createElement( tag );
      elem.id = id = "auto_" + tag + Date.now();
    }
    else if ( DOMClass === undefined || id instanceof DOMClass ) {
      elem = id;
    }
    else if ( typeof ( id ) === "string" ) {
      elem = document.getElementById( id );
      if ( elem === null ) {
        elem = document.createElement( tag );
        elem.id = id;
      }
      else if ( elem.tagName !== tag.toUpperCase() ) {
        elem = null;
      }
    }

    if ( elem === null ) {
      pliny.error( {name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation."} );
      throw new Error( id + " does not refer to a valid " + tag + " element." );
    }
    else {
      elem.innerHTML = "";
    }
    return elem;
  };

  pliny.function( "Primrose.DOM", {
    name: "findEverything",
    description: "Searches an element for all sub elements that have a named ID,\n\
using that ID as the name of a field in a hashmap to store a reference to the element.\n\
Basically, a quick way to get at all the named elements in a page.\n\
\n\
> NOTE: You may name your IDs pretty much anything you want, but for ease of use,\n\
> you should name them in a camalCase fashion. See [CamelCase - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/CamelCase).",
    parameters: [
      {name: "elem", type: "Element", description: "(Optional) the root element from which to search. Defaults to `document`."},
      {name: "obj", type: "Object", description: "(Optional) the object in which to store the element references. If no object is provided, one will be created."}
    ],
    returns: "An object full of element references, with fields named by the ID of the elements that were found.",
    examples: [ {name: "Get all child elements.", description: "Assuming the following HTML snippet:\n\
\n\
    grammar(\"HTML\");\n\
    <div>\n\
      <div id=\"First\">first element</div>\n\
      <section id=\"second-elem\">\n\
        Second element\n\
        <img id=\"img1\" src=\"img.png\">\n\
      </section>\n\
    </div>\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var elems = Primrose.DOM.findEverything();\n\
    console.log(elems.First.innerHTML);\n\
    console.log(elems[\"second-elem\"].textContent);\n\
    console.log(elems.img1.src);\n\
\n\
## Results:\n\
> first element  \n\
> Second element  \n\
> img.png"} ]
  } );
  DOM.findEverything = function ( elem, obj ) {
    elem = elem || document;
    obj = obj || {};
    var arr = elem.querySelectorAll( "*" );
    for ( var i = 0; i < arr.length; ++i ) {
      var e = arr[i];
      if ( e.id && e.id.length > 0 ) {
        obj[e.id] = e;
        if ( e.parentElement ) {
          e.parentElement[e.id] = e;
        }
      }
    }
    return obj;
  };

  pliny.function( "Primrose.DOM", {
    name: "makeHidingContainer",
    description: "Takes an element and shoves it into a containing element that\n\
is 0x0 pixels in size, with the overflow hidden. Sometimes, we need an element\n\
like a TextArea in the DOM to be able to receive key events, but we don't want the\n\
user to see it, so the makeHidingContainer function makes it easy to make it disappear.",
    parameters: [
      {name: "id", type: "(String|Element)", description: "A vague reference to\n\
the element. Either a String id where the element can be had, a String id to give\n\
a newly created element if it does not exist, or an Element to manipulate and validate."},
      {name: "obj", type: "Element", description: "The child element to stow in the hiding container."}
    ],
    returns: "The hiding container element, not yet inserted into the DOM."
  } );
  DOM.makeHidingContainer = function ( id, obj ) {
    var elem = DOM.cascadeElement( id, "div", window.HTMLDivElement );
    elem.style.position = "absolute";
    elem.style.left = 0;
    elem.style.top = 0;
    elem.style.width = 0;
    elem.style.height = 0;
    elem.style.overflow = "hidden";
    elem.appendChild( obj );
    return elem;
  };

  return DOM;

} )();

pliny.issue( "Primrose.DOM", {
  name: "document DOM",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.DOM](#Primrose_DOM) class in the  directory"
} );
;/* global Primrose, pliny */

Primrose.HTTP = ( function () {

  pliny.namespace( "Primrose.HTTP", "A collection of basic XMLHttpRequest wrappers." );
  var HTTP = {};


  pliny.function( "Primrose.HTTP", {
    name: "XHR",
    description: "Wraps up the XMLHttpRequest object into a workflow that is easier for me to handle: a single function call. Can handle both GETs and POSTs, with or  without a payload.",
    parameters: [
      {name: "method", type: "String", description: "The HTTP Verb being used for the request."},
      {name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)."},
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [ {
        name: "Make a GET request.",
        description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.XHR(\"GET\", \"json\", \"localFile.json\",\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console),\n\
      console.log.bind(console, \"progress\"));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"}
    ]
  } );
  HTTP.XHR = function ( method, type, url, data, success, error, progress ) {
    var xhr = new XMLHttpRequest();
    xhr.onerror = error;
    xhr.onabort = error;
    xhr.onprogress = progress;
    xhr.onload = function () {
      // The other error events are client-errors. If there was a server error,
      // we'd find out about it during this event. We need to only respond to
      // successful requests, i.e. those with HTTP status code in the 200 or 300
      // range.
      if ( xhr.status < 400 ) {
        if ( success ) {
          success( xhr.response );
        }
      }
      else if ( error ) {
        error();
      }
    };

    // The order of these operations is very explicit. You have to call open
    // first. It seems counter intuitive, but think of it more like you're opening
    // an HTTP document to be able to write to it, and then you finish by sending
    // the document. The "open" method does not refer to a network connection.
    xhr.open( method, url );
    if ( type ) {
      xhr.responseType = type;
    }
    if ( data ) {
      // We could do other data types, but in my case, I'm probably only ever
      // going to want JSON. No sense in overcomplicating the interface for
      // features I'm not going to use.
      xhr.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
      xhr.send( JSON.stringify( data ) );
    }
    else {
      xhr.send();
    }
  };



  pliny.function( "Primrose.HTTP", {
    name: "get",
    description: "Process an HTTP GET request.",
    parameters: [
      {name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)."},
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [ {
        name: "Make a GET request.",
        description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.get(\"json\", \"localFile.json\",\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console),\n\
      console.log.bind(console, \"progress\"));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"}
    ]
  } );
  HTTP.get = function ( type, url, success, error, progress ) {
    HTTP.XHR( "GET", type || "text", url, null, success, error, progress );
  };


  pliny.function( "Primrose.HTTP", {
    name: "put",
    description: "Process an HTTP PUT request.",
    parameters: [
      {name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)."},
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ]
  } );
  HTTP.post = function ( type, url, data, success, error, progress ) {
    HTTP.XHR( "POST", type, url, data, success, error, progress );
  };



  pliny.function( "Primrose.HTTP", {
    name: "getObject",
    description: "Get a JSON object from a server.",
    parameters: [
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [ {
        name: "Make a GET request for a JSON object.",
        description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.getObject(\"localFile.json\",\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console),\n\
      console.log.bind(console, \"progress\"));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"}
    ]
  } );
  HTTP.getObject = function ( url, success, error, progress ) {
    HTTP.get( "json", url, success, error, progress );
  };


  pliny.function( "Primrose.HTTP", {
    name: "getText",
    description: "Get plain text from a server.",
    parameters: [
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [ {
        name: "Make a GET request for plain text.",
        description: "Use this to load arbitrary files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.getText(\"localFile.json\",\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console),\n\
      console.log.bind(console, \"progress\"));\n\
\n\
## Results:\n\
> \"Object {field1: 1, field2: \\\"Field2\\\"}\""}
    ]
  } );
  HTTP.getText = function ( url, success, error, progress ) {
    HTTP.get( "text", url, success, error, progress );
  };


  pliny.function( "Primrose.HTTP", {
    name: "sendObject",
    description: "Send a JSON object to a server.",
    parameters: [
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ]
  } );
  HTTP.sendObject = function ( url, data, success, error, progress ) {
    HTTP.put( "json", url, data, success, error, progress );
  };

  return HTTP;
} )();

pliny.issue( "Primrose.HTTP", {
  name: "document HTTP",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.HTTP](#Primrose_HTTP) class in the  directory"
} );
;/* global Primrose, pliny */

Primrose.Keys = ( function ( ) {
  "use strict";

  pliny.enumeration( "Primrose", {
    name: "Keys",
    description: "Keycode values for system keys that are the same across all international standards"
  } );
  var Keys = {
    ///////////////////////////////////////////////////////////////////////////
    // modifiers
    ///////////////////////////////////////////////////////////////////////////
    MODIFIER_KEYS: [ "ctrl", "shift", "alt", "meta", "meta_l", "meta_r" ],
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    META: 91,
    META_L: 91,
    META_R: 92,
    ///////////////////////////////////////////////////////////////////////////
    // whitespace
    ///////////////////////////////////////////////////////////////////////////
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SPACE: 32,
    DELETE: 46,
    ///////////////////////////////////////////////////////////////////////////
    // lock keys
    ///////////////////////////////////////////////////////////////////////////
    PAUSEBREAK: 19,
    CAPSLOCK: 20,
    NUMLOCK: 144,
    SCROLLLOCK: 145,
    INSERT: 45,
    ///////////////////////////////////////////////////////////////////////////
    // navigation keys
    ///////////////////////////////////////////////////////////////////////////
    ESCAPE: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFTARROW: 37,
    UPARROW: 38,
    RIGHTARROW: 39,
    DOWNARROW: 40,
    SELECTKEY: 93,
    ///////////////////////////////////////////////////////////////////////////
    // numbers
    ///////////////////////////////////////////////////////////////////////////
    NUMBER0: 48,
    NUMBER1: 49,
    NUMBER2: 50,
    NUMBER3: 51,
    NUMBER4: 52,
    NUMBER5: 53,
    NUMBER6: 54,
    NUMBER7: 55,
    NUMBER8: 56,
    NUMBER9: 57,
    ///////////////////////////////////////////////////////////////////////////
    // letters
    ///////////////////////////////////////////////////////////////////////////
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    ///////////////////////////////////////////////////////////////////////////
    // numpad
    ///////////////////////////////////////////////////////////////////////////
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMALPOINT: 110,
    DIVIDE: 111,
    ///////////////////////////////////////////////////////////////////////////
    // function keys
    ///////////////////////////////////////////////////////////////////////////
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123
  };

  // create a reverse mapping from keyCode to name.
  for ( var key in Keys ) {
    var val = Keys[key];
    if ( Keys.hasOwnProperty( key ) && typeof ( val ) === "number" ) {
      Keys[val] = key;
    }
  }
  
  pliny.setEnumerationValues("Primrose.Keys", Keys);

  return Keys;
} )();

pliny.issue( "Primrose.Keys", {
  name: "document Keys",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.Keys](#Primrose_Keys) class in the  directory"
} );
;/* global Primrose, THREE, pliny */

Primrose.ModelLoader = ( function () {
  // If Three.js hasn't been loaded, then this module doesn't make sense and we
  // can just return a shim to prevent errors from occuring. This is useful in
  // cases where we want to use Primrose in a 2D context, or perhaps use it with
  // a different 3D library, whatever that might be.
  if ( typeof ( THREE ) === "undefined" ) {
    return function () {
    };
  }

  // The JSON format object loader is not always included in the Three.js distribution,
  // so we have to first check for it.
  var JSON = THREE.ObjectLoader && new THREE.ObjectLoader();

  // Sometimes, the properties that export out of Blender and into Three.js don't
  // come out correctly, so we need to do a correction.
  function fixJSONScene ( json ) {
    json.traverse( function ( obj ) {
      if ( obj.geometry ) {
        obj.geometry.computeBoundingSphere();
        obj.geometry.computeBoundingBox();
      }
    } );
    return json;
  }

  var propertyTests = {
    isButton: function ( obj ) {
      return obj.material && obj.material.name.match( /^button\d+$/ );
    },
    isSolid: function ( obj ) {
      return !obj.name.match( /^(water|sky)/ );
    },
    isGround: function ( obj ) {
      return obj.material && obj.material.name && obj.material.name.match( /\bground\b/ );
    }
  };

  function setProperties ( object ) {
    object.traverse( function ( obj ) {
      if ( obj instanceof THREE.Mesh ) {
        for ( var prop in propertyTests ) {
          obj[prop] = obj[prop] || propertyTests[prop]( obj );
        }
      }
    } );
  }

  function buildScene ( success, error, progress, scene ) {
    try {
      scene.buttons = [ ];
      scene.traverse( function ( child ) {
        if ( child.isButton ) {
          scene.buttons.push(
              new Primrose.Button( child.parent, child.name ) );
        }
        if ( child.name ) {
          scene[child.name] = child;
        }
      } );
      if ( success ) {
        success( scene );
      }
    }
    catch ( exp ) {
      if ( error ) {
        error( exp );
      }
    }
  }

  pliny.class( "Primrose", {
    name: "ModelLoader",
    description: "Loads a model and keeps a reference of it around to be able to use as a factory of models.\n\
\n\
> NOTE: ModelLoader uses the same Cross-Origin Request policy as THREE.ImageUtils,\n\
> meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin\n\
> policy that Primrose uses for requests.",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [
      {name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var scene = new THREE.Scene(),\n\
     \n\
    // Load up the file, optionally \"check it out\"\n\
      modelFactory = new Primrose.ModelLoader(\"path/to/model.json\", function(model){\n\
        model.traverse(function(child){\n\
          // Do whatever you want to the individual child objects of the scene.\n\
        });\n\
    }, console.error.bind(console), console.log.bind(console, \"Progress:\"));\n\
     \n\
    // Add copies of the model to the scene every time the user hits the ENTER key.\n\
    window.addEventListener(\"keyup\", function(evt){\n\
      // If the template object exists, then the model loaded successfully.\n\
      if(modelFactory.template && evt.keyCode === 10){\n\
        scene.add(modelFactory.clone());\n\
      }\n\
    });"}
    ]
  } );
  function ModelLoader ( src, success, error, progress ) {
    pliny.property( {
      name: "template",
      type: "THREE.Object3D",
      description: "When a model is loaded, stores a reference to the model so it can be cloned in the future."
    } );
    var done = function ( scene ) {
      this.template = scene;
      if ( success ) {
        success( scene );
      }
    }.bind( this );
    ModelLoader.loadObject( src, done, error, progress );
  }

  pliny.method( "Primrose.ModelLoader", {
    name: "clone",
    description: "Creates a copy of the stored template model.",
    returns: "A THREE.Object3D that is a copy of the stored template.",
    examples: [
      {name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var scene = new THREE.Scene(),\n\
    \n\
    // Load up the file, optionally \"check it out\"\n\
      modelFactory = new Primrose.ModelLoader(\"path/to/model.json\", function(model){\n\
        model.traverse(function(child){\n\
          // Do whatever you want to the individual child objects of the scene.\n\
        });\n\
    }, console.error.bind(console), console.log.bind(console, \"Progress:\"));\n\
    \n\
    // Add copies of the model to the scene every time the user hits the ENTER key.\n\
    window.addEventListener(\"keyup\", function(evt){\n\
      // If the template object exists, then the model loaded successfully.\n\
      if(modelFactory.template && evt.keyCode === 10){\n\
        scene.add(modelFactory.clone());\n\
      }\n\
    });"}
    ]
  } );
  ModelLoader.prototype.clone = function () {
    var obj = this.template.clone();

    obj.traverse( function ( child ) {
      if ( child instanceof THREE.SkinnedMesh ) {
        obj.animation = new THREE.Animation( child, child.geometry.animation );
        if ( !this.template.originalAnimationData && obj.animation.data ) {
          this.template.originalAnimationData = obj.animation.data;
        }
        if ( !obj.animation.data ) {
          obj.animation.data = this.template.originalAnimationData;
        }
      }
    }.bind( this ) );

    setProperties( obj );
    return obj;
  };

  pliny.function( "Primrose.ModelLoader", {
    name: "loadScene",
    description: "Asynchronously loads a model intended to be used as a scene. It processes the scene for attributes, creates new properties on the scene to give us faster access to some of the elements within it. It also translates objects marked as GUI elements into instances of their associated elements within the Primrose framework.\n\
\n\
> NOTE: ModelLoader uses the same Cross-Origin Request policy as THREE.ImageUtils,\n\
> meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin\n\
> policy that Primrose uses for requests.",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [
      {name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var renderer = new THREE.WebGLRenderer(),\n\
        currentScene = new THREE.Scene(),\n\
        camera = new THREE.PerspectiveCamera();\n\
     \n\
    // Load up the file, optionally \"check it out\"\n\
    Primrose.ModelLoader.loadScene(\"path/to/scene.json\", function(newScene){\n\
      currentScene = newScene;\n\
      newScene.traverse(function(child){\n\
        if(child instanceof THREE.PerspectiveCamera){\n\
          camera = child;\n\
        }\n\
        // Do whatever else you want to the individual child objects of the scene.\n\
      });\n\
    }, console.error.bind(console), console.log.bind(console, \"Progress:\"));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      renderer.render(scene, camera);\n\
    }\n\
     \n\
    requestAnimationFrame(paint);"}
    ]
  } );
  ModelLoader.loadScene = function ( src, success, error, progress ) {
    var done = buildScene.bind( window, success, error, progress );
    ModelLoader.loadObject( src, done, error, progress );
  };

  pliny.function( "Primrose.ModelLoader", {
    name: "loadObject",
    description: "Asynchronously loads a JSON file as a JavaScript object. It processes the scene for attributes, creates new properties on the scene to give us faster access to some of the elements within it. It uses callbacks to tell you when loading progresses, when it's complete, or when an error occurred. Useful for one-time use models.\n\
\n\
> NOTE: ModelLoader uses the same Cross-Origin Request policy as THREE.ImageUtils,\n\
> meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin\n\
> policy that Primrose uses for requests.",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [
      {name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var renderer = new THREE.WebGLRenderer(),\n\
        currentScene = new THREE.Scene(),\n\
        camera = new THREE.PerspectiveCamera();\n\
     \n\
    // Load up the file\n\
    Primrose.ModelLoader.loadObject(\n\
      \"path/to/model.json\",\n\
      scene.add.bind(scene),\n\
      console.error.bind(console),\n\
      console.log.bind(console, \"Progress:\"));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      renderer.render(scene, camera);\n\
    }\n\
     \n\
    requestAnimationFrame(paint);"}
    ]
  } );
  ModelLoader.loadObject = function ( src, success, error, progress ) {
    var done = function ( scene ) {
      setProperties( scene );
      if ( success ) {
        success( scene );
      }
    };

    if ( !JSON ) {
      if ( error ) {
        error( "JSON seems to be broken right now" );
      }
    }
    else {
      try {
        JSON.setCrossOrigin( THREE.ImageUtils.crossOrigin );
        JSON.load( src, function ( json ) {
          done( fixJSONScene( json ) );
        }, progress, error );
      }
      catch ( exp ) {
        if ( error ) {
          error( exp );
        }
      }
    }
  };

  return ModelLoader;
} )();

pliny.issue( "Primrose.ModelLoader", {
  name: "document ModelLoader",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.ModelLoader](#Primrose_ModelLoader) class in the  directory"
} );

pliny.issue( "Primrose.ModelLoader", {
  name: "Move ModelLoader to a Three.js specific namespace",
  type: "open",
  description: "This class won't work outside of a Three.js context. The bits of code that absolutely must have Three.js should be moved to their own namespace."
} );
;/* global Primrose, pliny */

Primrose.NetworkedInput = ( function () {

  pliny.class( "Primrose", {
    name: "NetworkedInput",
    description: "<under construction>"
  } );
  function NetworkedInput ( name, commands, socket ) {
    this.name = name;
    this.commands = {};
    this.commandNames = [ ];
    this.socket = socket;
    this.enabled = true;
    this.paused = false;
    this.ready = true;
    this.transmitting = true;
    this.receiving = true;
    this.socketReady = false;
    this.inPhysicalUse = true;
    this.inputState = {};
    this.lastState = "";

    function readMetaKeys ( event ) {
      for ( var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i ) {
        var m = Primrose.Keys.MODIFIER_KEYS[i];
        this.inputState[m] = event[m + "Key"];
      }
    }

    window.addEventListener( "keydown", readMetaKeys.bind( this ), false );
    window.addEventListener( "keyup", readMetaKeys.bind( this ), false );

    if ( socket ) {
      socket.on( "open", function () {
        this.socketReady = true;
        this.inPhysicalUse = !this.receiving;
      }.bind( this ) );
      socket.on( name, function ( cmdState ) {
        if ( this.receiving ) {
          this.inPhysicalUse = false;
          this.decodeStateSnapshot( cmdState );
          this.fireCommands();
        }
      }.bind( this ) );
      socket.on( "close", function () {
        this.inPhysicalUse = true;
        this.socketReady = false;
      }.bind( this ) );
    }

    for ( var cmdName in commands ) {
      this.addCommand( cmdName, commands[cmdName] );
    }

    for ( var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i ) {
      this.inputState[Primrose.Keys.MODIFIER_KEYS[i]] = false;
    }
  }

  NetworkedInput.prototype.addCommand = function ( name, cmd ) {
    cmd.name = name;
    cmd = this.cloneCommand( cmd );
    cmd.repetitions = cmd.repetitions || 1;
    cmd.state = {
      value: null,
      pressed: false,
      wasPressed: false,
      fireAgain: false,
      lt: 0,
      ct: 0,
      repeatCount: 0
    };
    this.commands[name] = cmd;
    this.commandNames.push( name );
  };

  NetworkedInput.prototype.cloneCommand = function ( cmd ) {
    throw new Error( "cloneCommand function must be defined in subclass" );
  };

  NetworkedInput.prototype.update = function ( dt ) {
    if ( this.ready && this.enabled && this.inPhysicalUse && !this.paused ) {
      for ( var name in this.commands ) {
        var cmd = this.commands[name];
        cmd.state.wasPressed = cmd.state.pressed;
        cmd.state.pressed = false;
        if ( !cmd.disabled ) {
          var metaKeysSet = true;

          if ( cmd.metaKeys ) {
            for ( var n = 0; n < cmd.metaKeys.length && metaKeysSet; ++n ) {
              var m = cmd.metaKeys[n];
              metaKeysSet = metaKeysSet &&
                  ( this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] &&
                      !m.toggle ||
                      !this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] &&
                      m.toggle );
            }
          }

          this.evalCommand( cmd, metaKeysSet, dt );

          cmd.state.lt += dt;
          if ( cmd.state.lt >= cmd.dt ) {
            cmd.state.repeatCount++;
          }

          cmd.state.fireAgain = cmd.state.pressed &&
              cmd.state.lt >= cmd.dt &&
              cmd.state.repeatCount >= cmd.repetitions;

          if ( cmd.state.fireAgain ) {
            cmd.state.lt = 0;
            cmd.state.repeatCount = 0;
          }
        }
      }

      if ( this.socketReady && this.transmitting ) {
        var finalState = this.makeStateSnapshot();
        if ( finalState !== this.lastState ) {
          this.socket.emit( this.name, finalState );
          this.lastState = finalState;
        }
      }

      this.fireCommands();
    }
  };

  NetworkedInput.prototype.fireCommands = function () {
    if ( this.ready && !this.paused ) {
      for ( var name in this.commands ) {
        var cmd = this.commands[name];
        if ( cmd.state.fireAgain && cmd.commandDown ) {
          cmd.commandDown();
        }

        if ( !cmd.state.pressed && cmd.state.wasPressed && cmd.commandUp ) {
          cmd.commandUp();
        }
      }
    }
  };

  NetworkedInput.prototype.makeStateSnapshot = function () {
    var state = "", i = 0, l = Object.keys( this.commands ).length;
    for ( var name in this.commands ) {
      var cmd = this.commands[name];
      if ( cmd.state ) {
        state += ( i << 2 )
            | ( cmd.state.pressed ? 0x1 : 0 )
            | ( cmd.state.fireAgain ? 0x2 : 0 ) + ":" +
            cmd.state.value;
        if ( i < l - 1 ) {
          state += "|";
        }
      }
      ++i;
    }
    return state;
  };

  NetworkedInput.prototype.decodeStateSnapshot = function ( snapshot ) {
    var cmd, name;
    for ( name in this.commands ) {
      cmd = this.commands[name];
      cmd.state.wasPressed = cmd.state.pressed;
    }
    var records = snapshot.split( "|" );
    for ( var i = 0; i < records.length; ++i ) {
      var record = records[i],
          parts = record.split( ":" ),
          cmdIndex = parseInt( parts[0], 10 ),
          pressed = ( cmdIndex & 0x1 ) !== 0,
          fireAgain = ( flags & 0x2 ) !== 0,
          flags = parseInt( parts[2], 10 );
      cmdIndex >>= 2;
      name = this.commandNames( cmdIndex );
      cmd = this.commands[name];
      cmd.state = {
        value: parseFloat( parts[1] ),
        pressed: pressed,
        fireAgain: fireAgain
      };
    }
  };

  NetworkedInput.prototype.setProperty = function ( key, name, value ) {
    if ( this.commands[name] ) {
      this.commands[name][key] = value;
    }
  };

  NetworkedInput.prototype.addToArray = function ( key, name, value ) {
    if ( this.commands[name] && this.commands[name][key] ) {
      this.commands[name][key].push( value );
    }
  };

  NetworkedInput.prototype.removeFromArray = function ( key, name, value ) {
    if ( this.commands[name] && this.commands[name][key] ) {
      var arr = this.commands[name][key],
          n = arr.indexOf( value );
      if ( n > -1 ) {
        arr.splice( n, 1 );
      }
    }
  };

  NetworkedInput.prototype.invertInArray = function ( key, name, value ) {
    if ( this.commands[name] && this.commands[name][key] ) {
      var arr = this.commands[name][key],
          n = arr.indexOf( value );
      if ( n > -1 ) {
        arr[n] *= -1;
      }
    }
  };

  NetworkedInput.prototype.pause = function ( v ) {
    this.paused = v;
  };

  NetworkedInput.prototype.isPaused = function () {
    return this.paused;
  };

  NetworkedInput.prototype.enable = function ( k, v ) {
    if ( v === undefined || v === null ) {
      v = k;
      k = null;
    }

    if ( k ) {
      this.setProperty( "disabled", k, !v );
    }
    else {
      this.enabled = v;
    }
  };

  NetworkedInput.prototype.isEnabled = function ( name ) {
    return name && this.commands[name] && !this.commands[name].disabled;
  };

  NetworkedInput.prototype.transmit = function ( v ) {
    this.transmitting = v;
  };

  NetworkedInput.prototype.isTransmitting = function () {
    return this.transmitting;
  };

  NetworkedInput.prototype.receive = function ( v ) {
    this.receiving = v;
  };

  NetworkedInput.prototype.isReceiving = function () {
    return this.receiving;
  };
  return NetworkedInput;
} )();

pliny.issue( "Primrose.NetworkedInput", {
  name: "document NetworkedInput",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.NetworkedInput](#Primrose_NetworkedInput) class in the  directory"
} );
;/* global Primrose, THREE, Function, emit, self, pliny */

Primrose.Projector = ( function ( ) {
  
  pliny.class( "Primrose", {
    name: "Projector",
    description: "<under construction>"
  } );
  function Projector ( isWorker ) {
    if ( isWorker && typeof THREE === "undefined" ) {
      /* jshint ignore:start */
// File:src/three.js

      /**
       * This is just the THREE.Matrix4 and THREE.Vector3 classes from Three.js, to
       * be loaded into a WebWorker so the worker can do math. - STM
       *
       * @author mrdoob / http://mrdoob.com/
       */

      self.THREE = {REVISION: '72dev'};
// polyfills

      if ( Math.sign === undefined ) {

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

        Math.sign = function ( x ) {

          return ( x < 0 ) ? -1 : ( x > 0 ) ? 1 : +x;
        };
      }

      if ( Function.prototype.name === undefined && Object.defineProperty !==
          undefined ) {

// Missing in IE9-11.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

        Object.defineProperty( Function.prototype, 'name', {
          get: function ( ) {

            return this.toString( )
                .match( /^\s*function\s*(\S*)\s*\(/ )[ 1 ];
          }

        } );
      }

// File:src/math/Quaternion.js

      /**
       * @author mikael emtinger / http://gomo.se/
       * @author alteredq / http://alteredqualia.com/
       * @author WestLangley / http://github.com/WestLangley
       * @author bhouston / http://exocortex.com
       *
       * @param {Number} x
       * @param {Number} y
       * @param {Number} z
       * @param {Number} w
       */
      THREE.Quaternion = function ( x, y, z, w ) {

        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = ( w !== undefined ) ? w : 1;
      };
      THREE.Quaternion.prototype = {
        constructor: THREE.Quaternion,
        get x ( ) {

          return this._x;
        },
        set x ( value ) {

          this._x = value;
          this.onChangeCallback( );
        },
        get y ( ) {

          return this._y;
        },
        set y ( value ) {

          this._y = value;
          this.onChangeCallback( );
        },
        get z ( ) {

          return this._z;
        },
        set z ( value ) {

          this._z = value;
          this.onChangeCallback( );
        },
        get w ( ) {

          return this._w;
        },
        set w ( value ) {

          this._w = value;
          this.onChangeCallback( );
        },
        set: function ( x, y, z, w ) {

          this._x = x;
          this._y = y;
          this._z = z;
          this._w = w;
          this.onChangeCallback( );
          return this;
        },
        clone: function ( ) {

          return new this.constructor( this._x, this._y, this._z, this._w );
        },
        copy: function ( quaternion ) {

          this._x = quaternion.x;
          this._y = quaternion.y;
          this._z = quaternion.z;
          this._w = quaternion.w;
          this.onChangeCallback( );
          return this;
        },
        setFromEuler: function ( euler, update ) {

          if ( euler instanceof THREE.Euler === false ) {

            throw new Error(
                'THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );
          }

          // http://www.mathworks.com/matlabcentral/fileexchange/
          // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
          //	content/SpinCalc.m

          var c1 = Math.cos( euler._x / 2 );
          var c2 = Math.cos( euler._y / 2 );
          var c3 = Math.cos( euler._z / 2 );
          var s1 = Math.sin( euler._x / 2 );
          var s2 = Math.sin( euler._y / 2 );
          var s3 = Math.sin( euler._z / 2 );
          if ( euler.order === 'XYZ' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          } else if ( euler.order === 'YXZ' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          } else if ( euler.order === 'ZXY' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          } else if ( euler.order === 'ZYX' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          } else if ( euler.order === 'YZX' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          } else if ( euler.order === 'XZY' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          }

          if ( update !== false )
            this.onChangeCallback( );
          return this;
        },
        setFromAxisAngle: function ( axis, angle ) {

          // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

          // assumes axis is normalized

          var halfAngle = angle / 2,
              s = Math.sin(
                  halfAngle );
          this._x = axis.x * s;
          this._y = axis.y * s;
          this._z = axis.z * s;
          this._w = Math.cos( halfAngle );
          this.onChangeCallback( );
          return this;
        },
        setFromRotationMatrix: function ( m ) {

          // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

          // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

          var te = m.elements,
              m11 = te[ 0 ],
              m12 =
              te[ 4 ],
              m13 =
              te[ 8 ],
              m21 = te[ 1 ],
              m22 =
              te[ 5 ],
              m23 =
              te[ 9 ],
              m31 = te[ 2 ],
              m32 =
              te[ 6 ],
              m33 =
              te[ 10 ],
              trace = m11 + m22 + m33,
              s;
          if ( trace > 0 ) {

            s = 0.5 / Math.sqrt( trace + 1.0 );
            this._w = 0.25 / s;
            this._x = ( m32 - m23 ) * s;
            this._y = ( m13 - m31 ) * s;
            this._z = ( m21 - m12 ) * s;
          } else if ( m11 > m22 && m11 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );
            this._w = ( m32 - m23 ) / s;
            this._x = 0.25 * s;
            this._y = ( m12 + m21 ) / s;
            this._z = ( m13 + m31 ) / s;
          } else if ( m22 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );
            this._w = ( m13 - m31 ) / s;
            this._x = ( m12 + m21 ) / s;
            this._y = 0.25 * s;
            this._z = ( m23 + m32 ) / s;
          } else {

            s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );
            this._w = ( m21 - m12 ) / s;
            this._x = ( m13 + m31 ) / s;
            this._y = ( m23 + m32 ) / s;
            this._z = 0.25 * s;
          }

          this.onChangeCallback( );
          return this;
        },
        setFromUnitVectors: function ( ) {

          // http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

          // assumes direction vectors vFrom and vTo are normalized

          var v1,
              r;
          var EPS = 0.000001;
          return function ( vFrom, vTo ) {

            if ( v1 === undefined )
              v1 = new THREE.Vector3( );
            r = vFrom.dot( vTo ) + 1;
            if ( r < EPS ) {

              r = 0;
              if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

                v1.set( -vFrom.y, vFrom.x, 0 );
              } else {

                v1.set( 0, -vFrom.z, vFrom.y );
              }

            } else {

              v1.crossVectors( vFrom, vTo );
            }

            this._x = v1.x;
            this._y = v1.y;
            this._z = v1.z;
            this._w = r;
            this.normalize( );
            return this;
          };
        }( ),
        inverse: function ( ) {

          this.conjugate( )
              .normalize( );
          return this;
        },
        conjugate: function ( ) {

          this._x *= -1;
          this._y *= -1;
          this._z *= -1;
          this.onChangeCallback( );
          return this;
        },
        dot: function ( v ) {

          return this._x * v._x + this._y * v._y + this._z * v._z + this._w *
              v._w;
        },
        lengthSq: function ( ) {

          return this._x * this._x + this._y * this._y + this._z * this._z +
              this._w * this._w;
        },
        length: function ( ) {

          return Math.sqrt( this._x * this._x + this._y * this._y + this._z *
              this._z + this._w * this._w );
        },
        normalize: function ( ) {

          var l = this.length( );
          if ( l === 0 ) {

            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;
          } else {

            l = 1 / l;
            this._x = this._x * l;
            this._y = this._y * l;
            this._z = this._z * l;
            this._w = this._w * l;
          }

          this.onChangeCallback( );
          return this;
        },
        multiply: function ( q, p ) {

          if ( p !== undefined ) {

            console.warn(
                'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
            return this.multiplyQuaternions( q, p );
          }

          return this.multiplyQuaternions( this, q );
        },
        multiplyQuaternions: function ( a, b ) {

          // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

          var qax = a._x,
              qay =
              a._y,
              qaz =
              a._z,
              qaw =
              a._w;
          var qbx = b._x,
              qby =
              b._y,
              qbz =
              b._z,
              qbw =
              b._w;
          this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
          this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
          this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
          this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
          this.onChangeCallback( );
          return this;
        },
        multiplyVector3: function ( vector ) {

          console.warn(
              'THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.' );
          return vector.applyQuaternion( this );
        },
        slerp: function ( qb, t ) {

          if ( t === 0 )
            return this;
          if ( t === 1 )
            return this.copy( qb );
          var x = this._x,
              y =
              this._y,
              z =
              this._z,
              w =
              this._w;
          // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

          var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
          if ( cosHalfTheta < 0 ) {

            this._w = -qb._w;
            this._x = -qb._x;
            this._y = -qb._y;
            this._z = -qb._z;
            cosHalfTheta = -cosHalfTheta;
          } else {

            this.copy( qb );
          }

          if ( cosHalfTheta >= 1.0 ) {

            this._w = w;
            this._x = x;
            this._y = y;
            this._z = z;
            return this;
          }

          var halfTheta = Math.acos( cosHalfTheta );
          var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );
          if ( Math.abs( sinHalfTheta ) < 0.001 ) {

            this._w = 0.5 * ( w + this._w );
            this._x = 0.5 * ( x + this._x );
            this._y = 0.5 * ( y + this._y );
            this._z = 0.5 * ( z + this._z );
            return this;
          }

          var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
              ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;
          this._w = ( w * ratioA + this._w * ratioB );
          this._x = ( x * ratioA + this._x * ratioB );
          this._y = ( y * ratioA + this._y * ratioB );
          this._z = ( z * ratioA + this._z * ratioB );
          this.onChangeCallback( );
          return this;
        },
        equals: function ( quaternion ) {

          return ( quaternion._x === this._x ) && ( quaternion._y ===
              this._y ) && ( quaternion._z === this._z ) && ( quaternion._w ===
              this._w );
        },
        fromArray: function ( array, offset ) {

          if ( offset === undefined )
            offset = 0;
          this._x = array[ offset ];
          this._y = array[ offset + 1 ];
          this._z = array[ offset + 2 ];
          this._w = array[ offset + 3 ];
          this.onChangeCallback( );
          return this;
        },
        toArray: function ( array, offset ) {

          if ( array === undefined )
            array = [ ];
          if ( offset === undefined )
            offset = 0;
          array[ offset ] = this._x;
          array[ offset + 1 ] = this._y;
          array[ offset + 2 ] = this._z;
          array[ offset + 3 ] = this._w;
          return array;
        },
        onChange: function ( callback ) {

          this.onChangeCallback = callback;
          return this;
        },
        onChangeCallback: function ( ) {
        }

      };
      THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

        return qm.copy( qa )
            .slerp(
                qb,
                t );
      };
// File:src/math/Vector3.js

      /**
       * @author mrdoob / http://mrdoob.com/
       * @author *kile / http://kile.stravaganza.org/
       * @author philogb / http://blog.thejit.org/
       * @author mikael emtinger / http://gomo.se/
       * @author egraether / http://egraether.com/
       * @author WestLangley / http://github.com/WestLangley
       *
       * @param {Number} x
       * @param {Number} y
       * @param {Number} z
       */
      THREE.Vector3 = function ( x, y, z ) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
      };
      THREE.Vector3.prototype = {
        constructor: THREE.Vector3,
        set: function ( x, y, z ) {

          this.x = x;
          this.y = y;
          this.z = z;
          return this;
        },
        setX: function ( x ) {

          this.x = x;
          return this;
        },
        setY: function ( y ) {

          this.y = y;
          return this;
        },
        setZ: function ( z ) {

          this.z = z;
          return this;
        },
        setComponent: function ( index, value ) {

          switch ( index ) {

            case 0:
              this.x = value;
              break;
            case 1:
              this.y = value;
              break;
            case 2:
              this.z = value;
              break;
            default:
              throw new Error( 'index is out of range: ' + index );
          }

        },
        getComponent: function ( index ) {

          switch ( index ) {

            case 0:
              return this.x;
            case 1:
              return this.y;
            case 2:
              return this.z;
            default:
              throw new Error( 'index is out of range: ' + index );
          }

        },
        clone: function ( ) {

          return new this.constructor( this.x, this.y, this.z );
        },
        copy: function ( v ) {

          this.x = v.x;
          this.y = v.y;
          this.z = v.z;
          return this;
        },
        add: function ( v, w ) {

          if ( w !== undefined ) {

            console.warn(
                'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
            return this.addVectors( v, w );
          }

          this.x += v.x;
          this.y += v.y;
          this.z += v.z;
          return this;
        },
        addScalar: function ( s ) {

          this.x += s;
          this.y += s;
          this.z += s;
          return this;
        },
        addVectors: function ( a, b ) {

          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          return this;
        },
        addScaledVector: function ( v, s ) {

          this.x += v.x * s;
          this.y += v.y * s;
          this.z += v.z * s;
          return this;
        },
        sub: function ( v, w ) {

          if ( w !== undefined ) {

            console.warn(
                'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
            return this.subVectors( v, w );
          }

          this.x -= v.x;
          this.y -= v.y;
          this.z -= v.z;
          return this;
        },
        subScalar: function ( s ) {

          this.x -= s;
          this.y -= s;
          this.z -= s;
          return this;
        },
        subVectors: function ( a, b ) {

          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          return this;
        },
        multiply: function ( v, w ) {

          if ( w !== undefined ) {

            console.warn(
                'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
            return this.multiplyVectors( v, w );
          }

          this.x *= v.x;
          this.y *= v.y;
          this.z *= v.z;
          return this;
        },
        multiplyScalar: function ( scalar ) {

          this.x *= scalar;
          this.y *= scalar;
          this.z *= scalar;
          return this;
        },
        multiplyVectors: function ( a, b ) {

          this.x = a.x * b.x;
          this.y = a.y * b.y;
          this.z = a.z * b.z;
          return this;
        },
        applyEuler: function ( ) {

          var quaternion;
          return function applyEuler ( euler ) {

            if ( euler instanceof THREE.Euler === false ) {

              console.error(
                  'THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.' );
            }

            if ( quaternion === undefined )
              quaternion = new THREE.Quaternion( );
            this.applyQuaternion( quaternion.setFromEuler( euler ) );
            return this;
          };
        }( ),
        applyAxisAngle: function ( ) {

          var quaternion;
          return function applyAxisAngle ( axis, angle ) {

            if ( quaternion === undefined )
              quaternion = new THREE.Quaternion( );
            this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );
            return this;
          };
        }( ),
        applyMatrix3: function ( m ) {

          var x = this.x;
          var y = this.y;
          var z = this.z;
          var e = m.elements;
          this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
          this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
          this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;
          return this;
        },
        applyMatrix4: function ( m ) {

          // input: THREE.Matrix4 affine matrix

          var x = this.x,
              y =
              this.y,
              z =
              this.z;
          var e = m.elements;
          this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ];
          this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ];
          this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];
          return this;
        },
        applyProjection: function ( m ) {

          // input: THREE.Matrix4 projection matrix

          var x = this.x,
              y =
              this.y,
              z =
              this.z;
          var e = m.elements;
          var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z +
              e[ 15 ] ); // perspective divide

          this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * d;
          this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * d;
          this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;
          return this;
        },
        applyQuaternion: function ( q ) {

          var x = this.x;
          var y = this.y;
          var z = this.z;
          var qx = q.x;
          var qy = q.y;
          var qz = q.z;
          var qw = q.w;
          // calculate quat * vector

          var ix = qw * x + qy * z - qz * y;
          var iy = qw * y + qz * x - qx * z;
          var iz = qw * z + qx * y - qy * x;
          var iw = -qx * x - qy * y - qz * z;
          // calculate result * inverse quat

          this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
          this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
          this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
          return this;
        },
        project: function ( ) {

          var matrix;
          return function project ( camera ) {

            if ( matrix === undefined )
              matrix = new THREE.Matrix4( );
            matrix.multiplyMatrices( camera.projectionMatrix,
                matrix.getInverse( camera.matrixWorld ) );
            return this.applyProjection( matrix );
          };
        }( ),
        unproject: function ( ) {

          var matrix;
          return function unproject ( camera ) {

            if ( matrix === undefined )
              matrix = new THREE.Matrix4( );
            matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse(
                camera.projectionMatrix ) );
            return this.applyProjection( matrix );
          };
        }( ),
        transformDirection: function ( m ) {

          // input: THREE.Matrix4 affine matrix
          // vector interpreted as a direction

          var x = this.x,
              y =
              this.y,
              z =
              this.z;
          var e = m.elements;
          this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
          this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
          this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;
          this.normalize( );
          return this;
        },
        divide: function ( v ) {

          this.x /= v.x;
          this.y /= v.y;
          this.z /= v.z;
          return this;
        },
        divideScalar: function ( scalar ) {

          if ( scalar !== 0 ) {

            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
          } else {

            this.x = 0;
            this.y = 0;
            this.z = 0;
          }

          return this;
        },
        min: function ( v ) {

          if ( this.x > v.x ) {

            this.x = v.x;
          }

          if ( this.y > v.y ) {

            this.y = v.y;
          }

          if ( this.z > v.z ) {

            this.z = v.z;
          }

          return this;
        },
        max: function ( v ) {

          if ( this.x < v.x ) {

            this.x = v.x;
          }

          if ( this.y < v.y ) {

            this.y = v.y;
          }

          if ( this.z < v.z ) {

            this.z = v.z;
          }

          return this;
        },
        clamp: function ( min, max ) {

          // This function assumes min < max, if this assumption isn't true it will not operate correctly

          if ( this.x < min.x ) {

            this.x = min.x;
          } else if ( this.x > max.x ) {

            this.x = max.x;
          }

          if ( this.y < min.y ) {

            this.y = min.y;
          } else if ( this.y > max.y ) {

            this.y = max.y;
          }

          if ( this.z < min.z ) {

            this.z = min.z;
          } else if ( this.z > max.z ) {

            this.z = max.z;
          }

          return this;
        },
        clampScalar: function ( ) {

          var min,
              max;
          return function clampScalar ( minVal, maxVal ) {

            if ( min === undefined ) {

              min = new THREE.Vector3( );
              max = new THREE.Vector3( );
            }

            min.set( minVal, minVal, minVal );
            max.set( maxVal, maxVal, maxVal );
            return this.clamp( min, max );
          };
        }( ),
        floor: function ( ) {

          this.x = Math.floor( this.x );
          this.y = Math.floor( this.y );
          this.z = Math.floor( this.z );
          return this;
        },
        ceil: function ( ) {

          this.x = Math.ceil( this.x );
          this.y = Math.ceil( this.y );
          this.z = Math.ceil( this.z );
          return this;
        },
        round: function ( ) {

          this.x = Math.round( this.x );
          this.y = Math.round( this.y );
          this.z = Math.round( this.z );
          return this;
        },
        roundToZero: function ( ) {

          this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
          this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
          this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
          return this;
        },
        negate: function ( ) {

          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          return this;
        },
        dot: function ( v ) {

          return this.x * v.x + this.y * v.y + this.z * v.z;
        },
        lengthSq: function ( ) {

          return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        length: function ( ) {

          return Math.sqrt( this.x * this.x + this.y * this.y + this.z *
              this.z );
        },
        lengthManhattan: function ( ) {

          return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );
        },
        normalize: function ( ) {

          return this.divideScalar( this.length( ) );
        },
        setLength: function ( l ) {

          var oldLength = this.length( );
          if ( oldLength !== 0 && l !== oldLength ) {

            this.multiplyScalar( l / oldLength );
          }

          return this;
        },
        lerp: function ( v, alpha ) {

          this.x += ( v.x - this.x ) * alpha;
          this.y += ( v.y - this.y ) * alpha;
          this.z += ( v.z - this.z ) * alpha;
          return this;
        },
        lerpVectors: function ( v1, v2, alpha ) {

          this.subVectors( v2, v1 )
              .multiplyScalar(
                  alpha )
              .add(
                  v1 );
          return this;
        },
        cross: function ( v, w ) {

          if ( w !== undefined ) {

            console.warn(
                'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
            return this.crossVectors( v, w );
          }

          var x = this.x,
              y =
              this.y,
              z =
              this.z;
          this.x = y * v.z - z * v.y;
          this.y = z * v.x - x * v.z;
          this.z = x * v.y - y * v.x;
          return this;
        },
        crossVectors: function ( a, b ) {

          var ax = a.x,
              ay =
              a.y,
              az =
              a.z;
          var bx = b.x,
              by =
              b.y,
              bz =
              b.z;
          this.x = ay * bz - az * by;
          this.y = az * bx - ax * bz;
          this.z = ax * by - ay * bx;
          return this;
        },
        projectOnVector: function ( ) {

          var v1,
              dot;
          return function projectOnVector ( vector ) {

            if ( v1 === undefined )
              v1 = new THREE.Vector3( );
            v1.copy( vector )
                .normalize( );
            dot = this.dot( v1 );
            return this.copy( v1 )
                .multiplyScalar(
                    dot );
          };
        }( ),
        projectOnPlane: function ( ) {

          var v1;
          return function projectOnPlane ( planeNormal ) {

            if ( v1 === undefined )
              v1 = new THREE.Vector3( );
            v1.copy( this )
                .projectOnVector(
                    planeNormal );
            return this.sub( v1 );
          };
        }( ),
        reflect: function ( ) {

          // reflect incident vector off plane orthogonal to normal
          // normal is assumed to have unit length

          var v1;
          return function reflect ( normal ) {

            if ( v1 === undefined )
              v1 = new THREE.Vector3( );
            return this.sub( v1.copy( normal )
                .multiplyScalar(
                    2 *
                    this.dot(
                        normal ) ) );
          };
        }( ),
        angleTo: function ( v ) {

          var theta = this.dot( v ) / ( this.length( ) * v.length( ) );
          // clamp, to handle numerical problems

          return Math.acos( THREE.Math.clamp( theta, -1, 1 ) );
        },
        distanceTo: function ( v ) {

          return Math.sqrt( this.distanceToSquared( v ) );
        },
        distanceToSquared: function ( v ) {

          var dx = this.x - v.x;
          var dy = this.y - v.y;
          var dz = this.z - v.z;
          return dx * dx + dy * dy + dz * dz;
        },
        setEulerFromRotationMatrix: function ( m, order ) {

          console.error(
              'THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.' );
        },
        setEulerFromQuaternion: function ( q, order ) {

          console.error(
              'THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.' );
        },
        getPositionFromMatrix: function ( m ) {

          console.warn(
              'THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().' );
          return this.setFromMatrixPosition( m );
        },
        getScaleFromMatrix: function ( m ) {

          console.warn(
              'THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().' );
          return this.setFromMatrixScale( m );
        },
        getColumnFromMatrix: function ( index, matrix ) {

          console.warn(
              'THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().' );
          return this.setFromMatrixColumn( index, matrix );
        },
        setFromMatrixPosition: function ( m ) {

          this.x = m.elements[ 12 ];
          this.y = m.elements[ 13 ];
          this.z = m.elements[ 14 ];
          return this;
        },
        setFromMatrixScale: function ( m ) {

          var sx = this.set( m.elements[ 0 ], m.elements[ 1 ],
              m.elements[ 2 ] )
              .length( );
          var sy = this.set( m.elements[ 4 ], m.elements[ 5 ],
              m.elements[ 6 ] )
              .length( );
          var sz = this.set( m.elements[ 8 ], m.elements[ 9 ],
              m.elements[ 10 ] )
              .length( );
          this.x = sx;
          this.y = sy;
          this.z = sz;
          return this;
        },
        setFromMatrixColumn: function ( index, matrix ) {

          var offset = index * 4;
          var me = matrix.elements;
          this.x = me[ offset ];
          this.y = me[ offset + 1 ];
          this.z = me[ offset + 2 ];
          return this;
        },
        equals: function ( v ) {

          return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z ===
              this.z ) );
        },
        fromArray: function ( array, offset ) {

          if ( offset === undefined )
            offset = 0;
          this.x = array[ offset ];
          this.y = array[ offset + 1 ];
          this.z = array[ offset + 2 ];
          return this;
        },
        toArray: function ( array, offset ) {

          if ( array === undefined )
            array = [ ];
          if ( offset === undefined )
            offset = 0;
          array[ offset ] = this.x;
          array[ offset + 1 ] = this.y;
          array[ offset + 2 ] = this.z;
          return array;
        },
        fromAttribute: function ( attribute, index, offset ) {

          if ( offset === undefined )
            offset = 0;
          index = index * attribute.itemSize + offset;
          this.x = attribute.array[ index ];
          this.y = attribute.array[ index + 1 ];
          this.z = attribute.array[ index + 2 ];
          return this;
        }

      };
// File:src/math/Matrix4.js

      /**
       * @author mrdoob / http://mrdoob.com/
       * @author supereggbert / http://www.paulbrunt.co.uk/
       * @author philogb / http://blog.thejit.org/
       * @author jordi_ros / http://plattsoft.com
       * @author D1plo1d / http://github.com/D1plo1d
       * @author alteredq / http://alteredqualia.com/
       * @author mikael emtinger / http://gomo.se/
       * @author timknip / http://www.floorplanner.com/
       * @author bhouston / http://exocortex.com
       * @author WestLangley / http://github.com/WestLangley
       */

      THREE.Matrix4 = function ( ) {
        this.elements = new Float32Array( [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1

        ] );
      };
      THREE.Matrix4.prototype = {
        constructor: THREE.Matrix4,
        set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33,
            n34, n41, n42, n43, n44 ) {

          var te = this.elements;
          te[ 0 ] = n11;
          te[ 4 ] = n12;
          te[ 8 ] = n13;
          te[ 12 ] = n14;
          te[ 1 ] = n21;
          te[ 5 ] = n22;
          te[ 9 ] = n23;
          te[ 13 ] = n24;
          te[ 2 ] = n31;
          te[ 6 ] = n32;
          te[ 10 ] = n33;
          te[ 14 ] = n34;
          te[ 3 ] = n41;
          te[ 7 ] = n42;
          te[ 11 ] = n43;
          te[ 15 ] = n44;
          return this;
        },
        identity: function ( ) {

          this.set(
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1

              );
          return this;
        },
        clone: function ( ) {

          return new THREE.Matrix4( ).fromArray( this.elements );
        },
        copy: function ( m ) {

          this.elements.set( m.elements );
          return this;
        },
        extractPosition: function ( m ) {

          console.warn(
              'THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().' );
          return this.copyPosition( m );
        },
        copyPosition: function ( m ) {

          var te = this.elements;
          var me = m.elements;
          te[ 12 ] = me[ 12 ];
          te[ 13 ] = me[ 13 ];
          te[ 14 ] = me[ 14 ];
          return this;
        },
        extractBasis: function ( xAxis, yAxis, zAxis ) {

          var te = this.elements;
          xAxis.set( te[ 0 ], te[ 1 ], te[ 2 ] );
          yAxis.set( te[ 4 ], te[ 5 ], te[ 6 ] );
          zAxis.set( te[ 8 ], te[ 9 ], te[ 10 ] );
          return this;
        },
        makeBasis: function ( xAxis, yAxis, zAxis ) {

          this.set(
              xAxis.x, yAxis.x, zAxis.x, 0,
              xAxis.y, yAxis.y, zAxis.y, 0,
              xAxis.z, yAxis.z, zAxis.z, 0,
              0, 0, 0, 1
              );
          return this;
        },
        extractRotation: function ( ) {

          var v1;
          return function ( m ) {

            if ( v1 === undefined )
              v1 = new THREE.Vector3( );
            var te = this.elements;
            var me = m.elements;
            var scaleX = 1 / v1.set( me[ 0 ], me[ 1 ], me[ 2 ] )
                .length( );
            var scaleY = 1 / v1.set( me[ 4 ], me[ 5 ], me[ 6 ] )
                .length( );
            var scaleZ = 1 / v1.set( me[ 8 ], me[ 9 ], me[ 10 ] )
                .length( );
            te[ 0 ] = me[ 0 ] * scaleX;
            te[ 1 ] = me[ 1 ] * scaleX;
            te[ 2 ] = me[ 2 ] * scaleX;
            te[ 4 ] = me[ 4 ] * scaleY;
            te[ 5 ] = me[ 5 ] * scaleY;
            te[ 6 ] = me[ 6 ] * scaleY;
            te[ 8 ] = me[ 8 ] * scaleZ;
            te[ 9 ] = me[ 9 ] * scaleZ;
            te[ 10 ] = me[ 10 ] * scaleZ;
            return this;
          };
        }( ),
        makeRotationFromEuler: function ( euler ) {

          if ( euler instanceof THREE.Euler === false ) {

            console.error(
                'THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );
          }

          var te = this.elements;
          var x = euler.x,
              y =
              euler.y,
              z =
              euler.z;
          var a = Math.cos( x ),
              b =
              Math.sin(
                  x );
          var c = Math.cos( y ),
              d =
              Math.sin(
                  y );
          var e = Math.cos( z ),
              f =
              Math.sin(
                  z );
          if ( euler.order === 'XYZ' ) {

            var ae = a * e,
                af =
                a *
                f,
                be =
                b *
                e,
                bf =
                b *
                f;
            te[ 0 ] = c * e;
            te[ 4 ] = -c * f;
            te[ 8 ] = d;
            te[ 1 ] = af + be * d;
            te[ 5 ] = ae - bf * d;
            te[ 9 ] = -b * c;
            te[ 2 ] = bf - ae * d;
            te[ 6 ] = be + af * d;
            te[ 10 ] = a * c;
          } else if ( euler.order === 'YXZ' ) {

            var ce = c * e,
                cf =
                c *
                f,
                de =
                d *
                e,
                df =
                d *
                f;
            te[ 0 ] = ce + df * b;
            te[ 4 ] = de * b - cf;
            te[ 8 ] = a * d;
            te[ 1 ] = a * f;
            te[ 5 ] = a * e;
            te[ 9 ] = -b;
            te[ 2 ] = cf * b - de;
            te[ 6 ] = df + ce * b;
            te[ 10 ] = a * c;
          } else if ( euler.order === 'ZXY' ) {

            var ce = c * e,
                cf =
                c *
                f,
                de =
                d *
                e,
                df =
                d *
                f;
            te[ 0 ] = ce - df * b;
            te[ 4 ] = -a * f;
            te[ 8 ] = de + cf * b;
            te[ 1 ] = cf + de * b;
            te[ 5 ] = a * e;
            te[ 9 ] = df - ce * b;
            te[ 2 ] = -a * d;
            te[ 6 ] = b;
            te[ 10 ] = a * c;
          } else if ( euler.order === 'ZYX' ) {

            var ae = a * e,
                af =
                a *
                f,
                be =
                b *
                e,
                bf =
                b *
                f;
            te[ 0 ] = c * e;
            te[ 4 ] = be * d - af;
            te[ 8 ] = ae * d + bf;
            te[ 1 ] = c * f;
            te[ 5 ] = bf * d + ae;
            te[ 9 ] = af * d - be;
            te[ 2 ] = -d;
            te[ 6 ] = b * c;
            te[ 10 ] = a * c;
          } else if ( euler.order === 'YZX' ) {

            var ac = a * c,
                ad =
                a *
                d,
                bc =
                b *
                c,
                bd =
                b *
                d;
            te[ 0 ] = c * e;
            te[ 4 ] = bd - ac * f;
            te[ 8 ] = bc * f + ad;
            te[ 1 ] = f;
            te[ 5 ] = a * e;
            te[ 9 ] = -b * e;
            te[ 2 ] = -d * e;
            te[ 6 ] = ad * f + bc;
            te[ 10 ] = ac - bd * f;
          } else if ( euler.order === 'XZY' ) {

            var ac = a * c,
                ad =
                a *
                d,
                bc =
                b *
                c,
                bd =
                b *
                d;
            te[ 0 ] = c * e;
            te[ 4 ] = -f;
            te[ 8 ] = d * e;
            te[ 1 ] = ac * f + bd;
            te[ 5 ] = a * e;
            te[ 9 ] = ad * f - bc;
            te[ 2 ] = bc * f - ad;
            te[ 6 ] = b * e;
            te[ 10 ] = bd * f + ac;
          }

          // last column
          te[ 3 ] = 0;
          te[ 7 ] = 0;
          te[ 11 ] = 0;
          // bottom row
          te[ 12 ] = 0;
          te[ 13 ] = 0;
          te[ 14 ] = 0;
          te[ 15 ] = 1;
          return this;
        },
        setRotationFromQuaternion: function ( q ) {

          console.warn(
              'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );
          return this.makeRotationFromQuaternion( q );
        },
        makeRotationFromQuaternion: function ( q ) {

          var te = this.elements;
          var x = q.x,
              y =
              q.y,
              z =
              q.z,
              w =
              q.w;
          var x2 = x + x,
              y2 =
              y +
              y,
              z2 =
              z +
              z;
          var xx = x * x2,
              xy =
              x *
              y2,
              xz =
              x *
              z2;
          var yy = y * y2,
              yz =
              y *
              z2,
              zz =
              z *
              z2;
          var wx = w * x2,
              wy =
              w *
              y2,
              wz =
              w *
              z2;
          te[ 0 ] = 1 - ( yy + zz );
          te[ 4 ] = xy - wz;
          te[ 8 ] = xz + wy;
          te[ 1 ] = xy + wz;
          te[ 5 ] = 1 - ( xx + zz );
          te[ 9 ] = yz - wx;
          te[ 2 ] = xz - wy;
          te[ 6 ] = yz + wx;
          te[ 10 ] = 1 - ( xx + yy );
          // last column
          te[ 3 ] = 0;
          te[ 7 ] = 0;
          te[ 11 ] = 0;
          // bottom row
          te[ 12 ] = 0;
          te[ 13 ] = 0;
          te[ 14 ] = 0;
          te[ 15 ] = 1;
          return this;
        },
        lookAt: function ( ) {

          var x,
              y,
              z;
          return function ( eye, target, up ) {

            if ( x === undefined )
              x = new THREE.Vector3( );
            if ( y === undefined )
              y = new THREE.Vector3( );
            if ( z === undefined )
              z = new THREE.Vector3( );
            var te = this.elements;
            z.subVectors( eye, target )
                .normalize( );
            if ( z.length( ) === 0 ) {

              z.z = 1;
            }

            x.crossVectors( up, z )
                .normalize( );
            if ( x.length( ) === 0 ) {

              z.x += 0.0001;
              x.crossVectors( up, z )
                  .normalize( );
            }

            y.crossVectors( z, x );
            te[ 0 ] = x.x;
            te[ 4 ] = y.x;
            te[ 8 ] = z.x;
            te[ 1 ] = x.y;
            te[ 5 ] = y.y;
            te[ 9 ] = z.y;
            te[ 2 ] = x.z;
            te[ 6 ] = y.z;
            te[ 10 ] = z.z;
            return this;
          };
        }( ),
        multiply: function ( m, n ) {

          if ( n !== undefined ) {

            console.warn(
                'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
            return this.multiplyMatrices( m, n );
          }

          return this.multiplyMatrices( this, m );
        },
        multiplyMatrices: function ( a, b ) {

          var ae = a.elements;
          var be = b.elements;
          var te = this.elements;
          var a11 = ae[ 0 ],
              a12 =
              ae[ 4 ],
              a13 =
              ae[ 8 ],
              a14 =
              ae[ 12 ];
          var a21 = ae[ 1 ],
              a22 =
              ae[ 5 ],
              a23 =
              ae[ 9 ],
              a24 =
              ae[ 13 ];
          var a31 = ae[ 2 ],
              a32 =
              ae[ 6 ],
              a33 =
              ae[ 10 ],
              a34 =
              ae[ 14 ];
          var a41 = ae[ 3 ],
              a42 =
              ae[ 7 ],
              a43 =
              ae[ 11 ],
              a44 =
              ae[ 15 ];
          var b11 = be[ 0 ],
              b12 =
              be[ 4 ],
              b13 =
              be[ 8 ],
              b14 =
              be[ 12 ];
          var b21 = be[ 1 ],
              b22 =
              be[ 5 ],
              b23 =
              be[ 9 ],
              b24 =
              be[ 13 ];
          var b31 = be[ 2 ],
              b32 =
              be[ 6 ],
              b33 =
              be[ 10 ],
              b34 =
              be[ 14 ];
          var b41 = be[ 3 ],
              b42 =
              be[ 7 ],
              b43 =
              be[ 11 ],
              b44 =
              be[ 15 ];
          te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
          te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
          te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
          te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
          te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
          te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
          te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
          te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
          te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
          te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
          te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
          te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
          te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
          te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
          te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
          te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
          return this;
        },
        multiplyToArray: function ( a, b, r ) {

          var te = this.elements;
          this.multiplyMatrices( a, b );
          r[ 0 ] = te[ 0 ];
          r[ 1 ] = te[ 1 ];
          r[ 2 ] = te[ 2 ];
          r[ 3 ] = te[ 3 ];
          r[ 4 ] = te[ 4 ];
          r[ 5 ] = te[ 5 ];
          r[ 6 ] = te[ 6 ];
          r[ 7 ] = te[ 7 ];
          r[ 8 ] = te[ 8 ];
          r[ 9 ] = te[ 9 ];
          r[ 10 ] = te[ 10 ];
          r[ 11 ] = te[ 11 ];
          r[ 12 ] = te[ 12 ];
          r[ 13 ] = te[ 13 ];
          r[ 14 ] = te[ 14 ];
          r[ 15 ] = te[ 15 ];
          return this;
        },
        multiplyScalar: function ( s ) {

          var te = this.elements;
          te[ 0 ] *= s;
          te[ 4 ] *= s;
          te[ 8 ] *= s;
          te[ 12 ] *= s;
          te[ 1 ] *= s;
          te[ 5 ] *= s;
          te[ 9 ] *= s;
          te[ 13 ] *= s;
          te[ 2 ] *= s;
          te[ 6 ] *= s;
          te[ 10 ] *= s;
          te[ 14 ] *= s;
          te[ 3 ] *= s;
          te[ 7 ] *= s;
          te[ 11 ] *= s;
          te[ 15 ] *= s;
          return this;
        },
        multiplyVector3: function ( vector ) {

          console.warn(
              'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
          return vector.applyProjection( this );
        },
        multiplyVector4: function ( vector ) {

          console.warn(
              'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
          return vector.applyMatrix4( this );
        },
        multiplyVector3Array: function ( a ) {

          console.warn(
              'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
          return this.applyToVector3Array( a );
        },
        applyToVector3Array: function ( ) {

          var v1;
          return function ( array, offset, length ) {

            if ( v1 === undefined )
              v1 = new THREE.Vector3( );
            if ( offset === undefined )
              offset = 0;
            if ( length === undefined )
              length = array.length;
            for ( var i = 0,
                j =
                offset;
                i <
                length;
                i +=
                3, j +=
                3 ) {

              v1.fromArray( array, j );
              v1.applyMatrix4( this );
              v1.toArray( array, j );
            }

            return array;
          };
        }( ),
        applyToBuffer: function ( ) {

          var v1;
          return function applyToBuffer ( buffer, offset, length ) {

            if ( v1 === undefined )
              v1 = new THREE.Vector3( );
            if ( offset === undefined )
              offset = 0;
            if ( length === undefined )
              length = buffer.length / buffer.itemSize;
            for ( var i = 0,
                j =
                offset;
                i <
                length;
                i++, j++ ) {

              v1.x = buffer.getX( j );
              v1.y = buffer.getY( j );
              v1.z = buffer.getZ( j );
              v1.applyMatrix4( this );
              buffer.setXYZ( v1.x, v1.y, v1.z );
            }

            return buffer;
          };
        }( ),
        rotateAxis: function ( v ) {

          console.warn(
              'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );
          v.transformDirection( this );
        },
        crossVector: function ( vector ) {

          console.warn(
              'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
          return vector.applyMatrix4( this );
        },
        determinant: function ( ) {

          var te = this.elements;
          var n11 = te[ 0 ],
              n12 =
              te[ 4 ],
              n13 =
              te[ 8 ],
              n14 =
              te[ 12 ];
          var n21 = te[ 1 ],
              n22 =
              te[ 5 ],
              n23 =
              te[ 9 ],
              n24 =
              te[ 13 ];
          var n31 = te[ 2 ],
              n32 =
              te[ 6 ],
              n33 =
              te[ 10 ],
              n34 =
              te[ 14 ];
          var n41 = te[ 3 ],
              n42 =
              te[ 7 ],
              n43 =
              te[ 11 ],
              n44 =
              te[ 15 ];
          //TODO: make this more efficient
          //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

          return (
              n41 * (
                  +n14 * n23 * n32
                  - n13 * n24 * n32
                  - n14 * n22 * n33
                  + n12 * n24 * n33
                  + n13 * n22 * n34
                  - n12 * n23 * n34
                  ) +
              n42 * (
                  +n11 * n23 * n34
                  - n11 * n24 * n33
                  + n14 * n21 * n33
                  - n13 * n21 * n34
                  + n13 * n24 * n31
                  - n14 * n23 * n31
                  ) +
              n43 * (
                  +n11 * n24 * n32
                  - n11 * n22 * n34
                  - n14 * n21 * n32
                  + n12 * n21 * n34
                  + n14 * n22 * n31
                  - n12 * n24 * n31
                  ) +
              n44 * (
                  -n13 * n22 * n31
                  - n11 * n23 * n32
                  + n11 * n22 * n33
                  + n13 * n21 * n32
                  - n12 * n21 * n33
                  + n12 * n23 * n31
                  )

              );
        },
        transpose: function ( ) {

          var te = this.elements;
          var tmp;
          tmp = te[ 1 ];
          te[ 1 ] = te[ 4 ];
          te[ 4 ] = tmp;
          tmp = te[ 2 ];
          te[ 2 ] = te[ 8 ];
          te[ 8 ] = tmp;
          tmp = te[ 6 ];
          te[ 6 ] = te[ 9 ];
          te[ 9 ] = tmp;
          tmp = te[ 3 ];
          te[ 3 ] = te[ 12 ];
          te[ 12 ] = tmp;
          tmp = te[ 7 ];
          te[ 7 ] = te[ 13 ];
          te[ 13 ] = tmp;
          tmp = te[ 11 ];
          te[ 11 ] = te[ 14 ];
          te[ 14 ] = tmp;
          return this;
        },
        flattenToArrayOffset: function ( array, offset ) {

          var te = this.elements;
          array[ offset ] = te[ 0 ];
          array[ offset + 1 ] = te[ 1 ];
          array[ offset + 2 ] = te[ 2 ];
          array[ offset + 3 ] = te[ 3 ];
          array[ offset + 4 ] = te[ 4 ];
          array[ offset + 5 ] = te[ 5 ];
          array[ offset + 6 ] = te[ 6 ];
          array[ offset + 7 ] = te[ 7 ];
          array[ offset + 8 ] = te[ 8 ];
          array[ offset + 9 ] = te[ 9 ];
          array[ offset + 10 ] = te[ 10 ];
          array[ offset + 11 ] = te[ 11 ];
          array[ offset + 12 ] = te[ 12 ];
          array[ offset + 13 ] = te[ 13 ];
          array[ offset + 14 ] = te[ 14 ];
          array[ offset + 15 ] = te[ 15 ];
          return array;
        },
        getPosition: function ( ) {

          var v1;
          return function ( ) {

            if ( v1 === undefined )
              v1 = new THREE.Vector3( );
            console.warn(
                'THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.' );
            var te = this.elements;
            return v1.set( te[ 12 ], te[ 13 ], te[ 14 ] );
          };
        }( ),
        setPosition: function ( v ) {

          var te = this.elements;
          te[ 12 ] = v.x;
          te[ 13 ] = v.y;
          te[ 14 ] = v.z;
          return this;
        },
        getInverse: function ( m, throwOnInvertible ) {

          // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
          var te = this.elements;
          var me = m.elements;
          var n11 = me[ 0 ],
              n12 =
              me[ 4 ],
              n13 =
              me[ 8 ],
              n14 =
              me[ 12 ];
          var n21 = me[ 1 ],
              n22 =
              me[ 5 ],
              n23 =
              me[ 9 ],
              n24 =
              me[ 13 ];
          var n31 = me[ 2 ],
              n32 =
              me[ 6 ],
              n33 =
              me[ 10 ],
              n34 =
              me[ 14 ];
          var n41 = me[ 3 ],
              n42 =
              me[ 7 ],
              n43 =
              me[ 11 ],
              n44 =
              me[ 15 ];
          te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 *
              n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
          te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 *
              n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
          te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 *
              n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
          te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 +
              n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
          te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 *
              n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
          te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 *
              n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
          te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 *
              n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
          te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 -
              n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
          te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 *
              n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
          te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 *
              n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
          te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 -
              n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
          te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 +
              n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
          te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 *
              n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
          te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 *
              n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
          te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 +
              n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
          te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 -
              n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
          var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 *
              te[ 12 ];
          if ( det === 0 ) {

            var msg =
                "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";
            if ( throwOnInvertible || false ) {

              throw new Error( msg );
            } else {

              console.warn( msg );
            }

            this.identity( );
            return this;
          }

          this.multiplyScalar( 1 / det );
          return this;
        },
        translate: function ( v ) {

          console.error( 'THREE.Matrix4: .translate() has been removed.' );
        },
        rotateX: function ( angle ) {

          console.error( 'THREE.Matrix4: .rotateX() has been removed.' );
        },
        rotateY: function ( angle ) {

          console.error( 'THREE.Matrix4: .rotateY() has been removed.' );
        },
        rotateZ: function ( angle ) {

          console.error( 'THREE.Matrix4: .rotateZ() has been removed.' );
        },
        rotateByAxis: function ( axis, angle ) {

          console.error( 'THREE.Matrix4: .rotateByAxis() has been removed.' );
        },
        scale: function ( v ) {

          var te = this.elements;
          var x = v.x,
              y =
              v.y,
              z =
              v.z;
          te[ 0 ] *= x;
          te[ 4 ] *= y;
          te[ 8 ] *= z;
          te[ 1 ] *= x;
          te[ 5 ] *= y;
          te[ 9 ] *= z;
          te[ 2 ] *= x;
          te[ 6 ] *= y;
          te[ 10 ] *= z;
          te[ 3 ] *= x;
          te[ 7 ] *= y;
          te[ 11 ] *= z;
          return this;
        },
        getMaxScaleOnAxis: function ( ) {

          var te = this.elements;
          var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] *
              te[ 2 ];
          var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] *
              te[ 6 ];
          var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] *
              te[ 10 ];
          return Math.sqrt( Math.max( scaleXSq, Math.max( scaleYSq,
              scaleZSq ) ) );
        },
        makeTranslation: function ( x, y, z ) {

          this.set(
              1, 0, 0, x,
              0, 1, 0, y,
              0, 0, 1, z,
              0, 0, 0, 1

              );
          return this;
        },
        makeRotationX: function ( theta ) {

          var c = Math.cos( theta ),
              s =
              Math.sin(
                  theta );
          this.set(
              1, 0, 0, 0,
              0, c, -s, 0,
              0, s, c, 0,
              0, 0, 0, 1

              );
          return this;
        },
        makeRotationY: function ( theta ) {

          var c = Math.cos( theta ),
              s =
              Math.sin(
                  theta );
          this.set(
              c, 0, s, 0,
              0, 1, 0, 0,
              -s, 0, c, 0,
              0, 0, 0, 1

              );
          return this;
        },
        makeRotationZ: function ( theta ) {

          var c = Math.cos( theta ),
              s =
              Math.sin(
                  theta );
          this.set(
              c, -s, 0, 0,
              s, c, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1

              );
          return this;
        },
        makeRotationAxis: function ( axis, angle ) {

          // Based on http://www.gamedev.net/reference/articles/article1199.asp

          var c = Math.cos( angle );
          var s = Math.sin( angle );
          var t = 1 - c;
          var x = axis.x,
              y =
              axis.y,
              z =
              axis.z;
          var tx = t * x,
              ty =
              t *
              y;
          this.set(
              tx * x + c, tx * y - s * z, tx * z + s * y, 0,
              tx * y + s * z, ty * y + c, ty * z - s * x, 0,
              tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
              0, 0, 0, 1

              );
          return this;
        },
        makeScale: function ( x, y, z ) {

          this.set(
              x, 0, 0, 0,
              0, y, 0, 0,
              0, 0, z, 0,
              0, 0, 0, 1

              );
          return this;
        },
        compose: function ( position, quaternion, scale ) {

          this.makeRotationFromQuaternion( quaternion );
          this.scale( scale );
          this.setPosition( position );
          return this;
        },
        decompose: function ( ) {

          var vector,
              matrix;
          return function ( position, quaternion, scale ) {

            if ( vector === undefined )
              vector = new THREE.Vector3( );
            if ( matrix === undefined )
              matrix = new THREE.Matrix4( );
            var te = this.elements;
            var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] )
                .length( );
            var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] )
                .length( );
            var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] )
                .length( );
            // if determine is negative, we need to invert one scale
            var det = this.determinant( );
            if ( det < 0 ) {

              sx = -sx;
            }

            position.x = te[ 12 ];
            position.y = te[ 13 ];
            position.z = te[ 14 ];
            // scale the rotation part

            matrix.elements.set(
                this.elements ); // at this point matrix is incomplete so we can't use .copy()

            var invSX = 1 / sx;
            var invSY = 1 / sy;
            var invSZ = 1 / sz;
            matrix.elements[ 0 ] *= invSX;
            matrix.elements[ 1 ] *= invSX;
            matrix.elements[ 2 ] *= invSX;
            matrix.elements[ 4 ] *= invSY;
            matrix.elements[ 5 ] *= invSY;
            matrix.elements[ 6 ] *= invSY;
            matrix.elements[ 8 ] *= invSZ;
            matrix.elements[ 9 ] *= invSZ;
            matrix.elements[ 10 ] *= invSZ;
            quaternion.setFromRotationMatrix( matrix );
            scale.x = sx;
            scale.y = sy;
            scale.z = sz;
            return this;
          };
        }( ),
        makeFrustum: function ( left, right, bottom, top, near, far ) {

          var te = this.elements;
          var x = 2 * near / ( right - left );
          var y = 2 * near / ( top - bottom );
          var a = ( right + left ) / ( right - left );
          var b = ( top + bottom ) / ( top - bottom );
          var c = -( far + near ) / ( far - near );
          var d = -2 * far * near / ( far - near );
          te[ 0 ] = x;
          te[ 4 ] = 0;
          te[ 8 ] = a;
          te[ 12 ] = 0;
          te[ 1 ] = 0;
          te[ 5 ] = y;
          te[ 9 ] = b;
          te[ 13 ] = 0;
          te[ 2 ] = 0;
          te[ 6 ] = 0;
          te[ 10 ] = c;
          te[ 14 ] = d;
          te[ 3 ] = 0;
          te[ 7 ] = 0;
          te[ 11 ] = -1;
          te[ 15 ] = 0;
          return this;
        },
        makePerspective: function ( fov, aspect, near, far ) {

          var ymax = near * Math.tan( THREE.Math.degToRad( fov * 0.5 ) );
          var ymin = -ymax;
          var xmin = ymin * aspect;
          var xmax = ymax * aspect;
          return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );
        },
        makeOrthographic: function ( left, right, top, bottom, near, far ) {

          var te = this.elements;
          var w = right - left;
          var h = top - bottom;
          var p = far - near;
          var x = ( right + left ) / w;
          var y = ( top + bottom ) / h;
          var z = ( far + near ) / p;
          te[ 0 ] = 2 / w;
          te[ 4 ] = 0;
          te[ 8 ] = 0;
          te[ 12 ] = -x;
          te[ 1 ] = 0;
          te[ 5 ] = 2 / h;
          te[ 9 ] = 0;
          te[ 13 ] = -y;
          te[ 2 ] = 0;
          te[ 6 ] = 0;
          te[ 10 ] = -2 / p;
          te[ 14 ] = -z;
          te[ 3 ] = 0;
          te[ 7 ] = 0;
          te[ 11 ] = 0;
          te[ 15 ] = 1;
          return this;
        },
        equals: function ( matrix ) {

          var te = this.elements;
          var me = matrix.elements;
          for ( var i = 0; i < 16; i++ ) {

            if ( te[ i ] !== me[ i ] )
              return false;
          }

          return true;
        },
        fromArray: function ( array ) {

          this.elements.set( array );
          return this;
        },
        toArray: function ( ) {

          var te = this.elements;
          return [
            te[ 0 ], te[ 1 ], te[ 2 ], te[ 3 ],
            te[ 4 ], te[ 5 ], te[ 6 ], te[ 7 ],
            te[ 8 ], te[ 9 ], te[ 10 ], te[ 11 ],
            te[ 12 ], te[ 13 ], te[ 14 ], te[ 15 ]
          ];
        }

      };
      /**
       * @author alteredq / http://alteredqualia.com/
       * @author mrdoob / http://mrdoob.com/
       */

      THREE.Math = {
        generateUUID: function ( ) {

          // http://www.broofa.com/Tools/Math.uuid.htm

          var chars =
              '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
                  '' );
          var uuid = new Array( 36 );
          var rnd = 0,
              r;
          return function ( ) {

            for ( var i = 0; i < 36; i++ ) {

              if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

                uuid[ i ] = '-';
              } else if ( i === 14 ) {

                uuid[ i ] = '4';
              } else {

                if ( rnd <= 0x02 )
                  rnd = 0x2000000 + ( Math.random( ) * 0x1000000 ) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];
              }

            }

            return uuid.join( '' );
          };
        }( ),
        // Clamp value to range <a, b>

        clamp: function ( x, a, b ) {

          return ( x < a ) ? a : ( ( x > b ) ? b : x );
        },
        // Clamp value to range <a, inf)

        clampBottom: function ( x, a ) {

          return x < a ? a : x;
        },
        // compute euclidian modulo of m % n
        // https://en.wikipedia.org/wiki/Modulo_operation

        euclideanModulo: function ( n, m ) {

          return ( ( n % m ) + m ) % m;
        },
        // Linear mapping from range <a1, a2> to range <b1, b2>

        mapLinear: function ( x, a1, a2, b1, b2 ) {

          return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
        },
        // http://en.wikipedia.org/wiki/Smoothstep

        smoothstep: function ( x, min, max ) {

          if ( x <= min )
            return 0;
          if ( x >= max )
            return 1;
          x = ( x - min ) / ( max - min );
          return x * x * ( 3 - 2 * x );
        },
        smootherstep: function ( x, min, max ) {

          if ( x <= min )
            return 0;
          if ( x >= max )
            return 1;
          x = ( x - min ) / ( max - min );
          return x * x * x * ( x * ( x * 6 - 15 ) + 10 );
        },
        // Random float from <0, 1> with 16 bits of randomness
        // (standard Math.random() creates repetitive patterns when applied over larger space)

        random16: function ( ) {

          return ( 65280 * Math.random( ) + 255 * Math.random( ) ) / 65535;
        },
        // Random integer from <low, high> interval

        randInt: function ( low, high ) {

          return low + Math.floor( Math.random( ) * ( high - low + 1 ) );
        },
        // Random float from <low, high> interval

        randFloat: function ( low, high ) {

          return low + Math.random( ) * ( high - low );
        },
        // Random float from <-range/2, range/2> interval

        randFloatSpread: function ( range ) {

          return range * ( 0.5 - Math.random( ) );
        },
        degToRad: function ( ) {

          var degreeToRadiansFactor = Math.PI / 180;
          return function ( degrees ) {

            return degrees * degreeToRadiansFactor;
          };
        }( ),
        radToDeg: function ( ) {

          var radianToDegreesFactor = 180 / Math.PI;
          return function ( radians ) {

            return radians * radianToDegreesFactor;
          };
        }( ),
        isPowerOfTwo: function ( value ) {

          return ( value & ( value - 1 ) ) === 0 && value !== 0;
        },
        nextPowerOfTwo: function ( value ) {

          value--;
          value |= value >> 1;
          value |= value >> 2;
          value |= value >> 4;
          value |= value >> 8;
          value |= value >> 16;
          value++;
          return value;
        }

      };
      /* jshint ignore:end */
    }
    this.objectIDs = [ ];
    this.objects = {};
    this.transformCache = {};
    this.vertCache = {};
    this.a = new THREE.Vector3( );
    this.b = new THREE.Vector3( );
    this.c = new THREE.Vector3( );
    this.d = new THREE.Vector3( );
    this.f = new THREE.Vector3( );
    this.p = new THREE.Vector3( );
    this.m = new THREE.Matrix4( );
    this.listeners = {
      hit: [ ]
    };
  }

  Projector.prototype.addEventListener = function ( evt, handler ) {
    if ( !this.listeners[evt] ) {
      this.listeners[evt] = [ ];
    }
    this.listeners[evt].push( handler );
  };
  Projector.prototype._emit = emit;
  Projector.prototype._transform = function ( obj, v ) {
    return v.clone( )
        .applyMatrix4(
            obj.matrix );
  };
  // We have to transform the vertices of the geometry into world-space
  // coordinations, because the object they are on could be rotated or
  // positioned somewhere else.
  Projector.prototype._getVerts = function ( obj ) {
    var key = Array.prototype.join.call( obj.matrix.elements, "," );
    if ( key !== this.transformCache[obj.uuid] ) {
      var trans = [ ];
      this.vertCache[obj.uuid] = trans;
      var verts = obj.geometry.vertices;
      for ( var i = 0; i < verts.length; ++i ) {
        trans[i] = this._transform( obj, verts[i] );
      }
      this.transformCache[obj.uuid] = key;
    }
    return this.vertCache[obj.uuid];
  };

  Projector.prototype.setObject = function ( obj ) {
    if ( !this.objects[obj.uuid] ) {
      this.objectIDs.push( obj.uuid );
      this.objects[obj.uuid] = obj;
    }
    else {
      this.setProperty( obj.uuid, "geometry.faces", obj.geometry.faces );
      this.setProperty( obj.uuid, "geometry.uvs", obj.geometry.uvs );
    }
    this.setProperty( obj.uuid, "geometry.vertices", obj.geometry.vertices );
    this.updateObjects( [ obj ] );
  };

  Projector.prototype.updateObjects = function ( objs ) {
    for ( var i = 0; i < objs.length; ++i ) {
      var obj = objs[i],
          head = obj,
          a = new THREE.Matrix4( ),
          b = new THREE.Matrix4( ).identity( ),
          c = null;
      while ( head !== null ) {
        a.fromArray( head.matrix );
        a.multiply( b );
        c = a;
        a = b;
        b = c;
        head = head.parent;
      }
      this.setProperty( obj.uuid, "matrix", b );
      this.setProperty( obj.uuid, "visible", obj.visible );
      delete obj.parent;
    }
  };
  Projector.prototype.setProperty = function ( objID, propName, value ) {
    var obj = this.objects[objID],
        parts = propName.split( "." );
    while ( parts.length > 1 ) {
      propName = parts.shift( );
      if ( !obj[propName] ) {
        obj[propName] = {};
      }
      obj = obj[propName];
    }
    if ( parts.length === 1 ) {
      propName = parts[0];
      if ( propName === "vertices" ) {
        value = value.map( function ( v ) {
          return new THREE.Vector3( ).fromArray( v );
        } );
      }
      obj[parts[0]] = value;
    }
  };
  Projector.prototype.projectPointer = function ( args ) {
    var p = args[0],
        from = args[1],
        value = null;
    this.p.fromArray( p );
    this.f.fromArray( from );
    for ( var i = 0; i < this.objectIDs.length; ++i ) {
      var objID = this.objectIDs[i],
          obj = this.objects[objID];
      if ( obj.visible ) {
        var verts = this._getVerts( obj ),
            faces = obj.geometry.faces,
            uvs = obj.geometry.uvs;
        for ( var j = 0; j < faces.length; ++j ) {
          var face = faces[j],
              v0 = verts[face[0]],
              v1 = verts[face[1]],
              v2 = verts[face[2]];
          this.a.subVectors( v1, v0 );
          this.b.subVectors( v2, v0 );
          this.c.subVectors( this.p, this.f );
          this.m.set(
              this.a.x, this.b.x, -this.c.x, 0,
              this.a.y, this.b.y, -this.c.y, 0,
              this.a.z, this.b.z, -this.c.z, 0,
              0, 0, 0, 1 );
          if ( this.m.determinant( ) !== 0 ) {
            this.m.getInverse( this.m );
            this.d.subVectors( this.f, v0 ).applyMatrix4(this.m );
            if ( this.d.x >= 0 && this.d.x <= 1 && this.d.y >= 0 && this.d.y <= 1 && this.d.z > 0 ) {
              this.c.multiplyScalar( this.d.z ).add( this.f );
              var dist = Math.sign( this.d.z ) * this.p.distanceTo( this.c );
              if ( !value || dist < value.distance ) {
                value = {
                  objectID: objID,
                  distance: dist,
                  faceIndex: j,
                  facePoint: this.c.toArray( ),
                  faceNormal: this.d.toArray( )
                };

                if ( uvs ) {
                  v0 = uvs[face[0]];
                  v1 = uvs[face[1]];
                  v2 = uvs[face[2]];
                  value.point = [
                    this.d.x * ( v1[0] - v0[0] ) + this.d.y * ( v2[0] - v0[0] ) + v0[0],
                    this.d.x * ( v1[1] - v0[1] ) + this.d.y * ( v2[1] - v0[1] ) + v0[1] ];
                }
              }
            }
          }
        }
      }
    }
    this._emit( "hit", value );
  };
  return Projector;
} )( );

pliny.issue( "Primrose.Projector", {
  name: "document Projector",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Projector](#Primrose_Projector) class in the  directory"
} );
;/* global Primrose, pliny */

Primrose.Random = ( function () {
  pliny.namespace( "Primrose.Random", "Functions for handling random numbers of different criteria, or selecting random elements of arrays." );
  var Random = {};

  pliny.function( "Primrose.Random", {
    name: "number",
    description: "Returns a random floating-point number on a given range [min, max), i.e. min is inclusive, max is exclusive.",
    parameters: [
      {name: "min", type: "Number", description: "The included minimum side of the range of numbers."},
      {name: "max", type: "Number", description: "The excluded maximum side of the range of numbers."}
    ],
    returns: "A random number as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
    examples: [
      {name: "Generate a random number on the range [-1, 1).", description: "To generate a random number on a closed range, call the `Primrose.Random.number` function as shown:\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    for(var i = 0; i < 10; ++i){\n\
      console.log(Primrose.Random.number(-1, 1));\n\
    }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -0.4869012129493058  \n\
> 0.5300767715089023  \n\
> 0.11962601682171226  \n\
> -0.22012147679924965  \n\
> 0.48508461797609925  \n\
> -0.8488651723600924  \n\
> 0.15711558377370238  \n\
> -0.3644236018881202  \n\
> 0.4486056035384536  \n\
> -0.9659552359953523"}
    ]
  } );
  Random.number = function ( min, max ) {
    return Math.random() * ( max - min ) + min;
  };

  pliny.function( "Primrose.Random", {
    name: "int",
    description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive. Includes a means to skew the results in one direction or another.",
    parameters: [
      {name: "min", type: "Number", description: "The included minimum side of the range of numbers."},
      {name: "max", type: "Number", description: "The excluded maximum side of the range of numbers."},
      {name: "power", type: "Number", description: "(Optional) The power to which to raise the random number before scaling and translating into the desired range. Values greater than 1 skew output values to the minimum of the range. Values less than 1 skew output values to the maximum of the range. Defaults to 1."}
    ],
    returns: "A random integer as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
    examples: [
      {name: "Generate a random integer numbers on the range [-10, 10).", description: "To generate a random integer on a closed range, call the `Primrose.Random.integer` function as shown:\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    for(var i = 0; i < 10; ++i){\n\
      console.log(Primrose.Random.int(-10, 10));\n\
    }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -3  \n\
> 1  \n\
> -2  \n\
> 8  \n\
> 7  \n\
> 4  \n\
> 5  \n\
> -9  \n\
> 4  \n\
> 0"},
      {name: "Generate skewed random integer numbers on the range [-100, 100).", description: "To generate a random integer skewed to one end of the range on a closed range, call the `Primrose.Random.integer` function with the `power` parameter as shown:\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    for(var i = 0; i < 10; ++i){\n\
      console.log(Primrose.Random.int(-100, 100, 5));\n\
    }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -100  \n\
> -100  \n\
> -78  \n\
> -81  \n\
> -99  \n\
> 18  \n\
> -100  \n\
> -100  \n\
> -100  \n\
> 52"}
    ]
  } );
  Random.int = function ( min, max, power ) {
    power = power || 1;
    if ( max === undefined ) {
      max = min;
      min = 0;
    }
    var delta = max - min,
        n = Math.pow( Math.random(), power );
    return Math.floor( min + n * delta );
  };

  pliny.function( "Primrose.Random", {
    name: "item",
    description: "Returns a random element from an array.",
    parameters: [
      {name: "arr", type: "Array", description: "The array form which to pick items."}
    ],
    returns: "One of the elements of the array, at random.",
    examples: [
      {name: "Select a random element from an array.", description: "To pick an item from an array at random, call the `Primrose.Random.item` function with the `power` parameter as shown:\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var numbers = [\n\
      \"one\",\n\
      \"two\",\n\
      \"three\",\n\
      \"four\",\n\
      \"five\"\n\
    ];\n\
    for(var i = 0; i < 10; ++i){\n\
      console.log(Primrose.Random.item(numbers));\n\
    }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> three  \n\
> four  \n\
> four  \n\
> two  \n\
> three  \n\
> two  \n\
> five  \n\
> four  \n\
> three  \n\
> two"}
    ]
  } );
  Random.item = function ( arr ) {
    return arr[Primrose.Random.int( arr.length )];
  };

  pliny.function( "Primrose.Random", {
    name: "steps",
    description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive, sticking to a number of steps in between. Useful for randomly generating music note values on pentatonic scales.",
    parameters: [
      {name: "min", type: "Number", description: "The included minimum side of the range of numbers."},
      {name: "max", type: "Number", description: "The excluded maximum side of the range of numbers."},
      {name: "steps", type: "Number", description: "The number of steps between individual integers, e.g. if min is even and step is even, then no odd numbers will be generated."}
    ],
    returns: "A random integer as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
    examples: [
      {name: "Generate random, even numbers.", description: "To generate numbers on a closed range with a constant step size between them, call the `Primrose.Random.step` function as shown:\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    for(var i = 0; i < 10; ++i){\n\
      console.log(Primrose.Random.steps(0, 100, 2));\n\
    }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> 86  \n\
> 32  \n\
> 86  \n\
> 56  \n\
> 4  \n\
> 96  \n\
> 68  \n\
> 92  \n\
> 4  \n\
> 36"}
    ]
  } );
  Random.steps = function ( min, max, steps ) {
    return min + Primrose.Random.int( 0, ( 1 + max - min ) / steps ) * steps;
  };

  return Random;
} )();

pliny.issue( "Primrose.Random", {
  name: "document Random",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.Random](#Primrose_Random) class in the  directory"
} );
;/* global Primrose, HTMLSelectElement, pliny */

Primrose.StateList = ( function () {
  pliny.class( "Primrose", {
    name: "StateList",
    description: "The StateList is a set of objects that can be mapped to DOM elements in such a way to alter their state. The UI presents a drop down list and the select action changes the various controls as the state set dictates. It's a way of streamlining the altering of UI state by select list.\n\
\n\
The states paramareter should be an array of State objects that take the form of:\n\
    { \n\
      name: \"A string for display\", \n\
      values: {\n\
        ctrlName1: {attributeName1: value1, attributeName2: value2 },\n\
        ctrlName2: {attributeName3: value3, attributeName4: value4 }\n\
      }\n\
    }"
  } );
  function StateList ( id, ctrls, states, callback, parent ) {
    var select = Primrose.DOM.cascadeElement( id, "select", HTMLSelectElement );
    for ( var i = 0; i < states.length; ++i ) {
      var opt = document.createElement( "option" );
      opt.appendChild( document.createTextNode( states[i].name ) );
      select.appendChild( opt );
    }
    select.addEventListener( "change", function () {
      var values = states[select.selectedIndex].values;
      if ( values !== undefined ) {
        for ( var id in values ) {
          if ( values.hasOwnProperty( id ) ) {
            var attrs = values[id];
            for ( var attr in attrs ) {
              if ( attrs.hasOwnProperty( attr ) ) {
                ctrls[id][attr] = attrs[attr];
              }
            }
          }
        }
        if ( callback ) {
          callback();
        }
      }
    }.bind( this ), false );

    pliny.property( {
      name: "DOMElement",
      type: "HTMLSelectElement",
      description: "The DOM element that should be put on the page to control the settings."
    } );
    this.DOMElement = select;
    if ( parent ) {
      parent.appendChild( this.DOMElement );
    }
  }

  return StateList;
} )();

pliny.issue( "Primrose.StateList", {
  name: "document StateList",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.StateList](#Primrose_StateList) class in the  directory"
} );
;/* global Primrose, THREE, io, CryptoJS, Notification, HMDVRDevice, devicePixelRatio
 * Function, emit, isMobile, isVR, isiOS, shell, quad, HTMLCanvasElement, pliny */

Primrose.VRApplication = ( function ( ) {
  "use strict";

  if ( typeof THREE === "undefined" ) {
    return function ( ) {
    };
  }
  /*
   Create a new VR Application!
   
   `name` - name the application, for use with saving settings separately from
   other applications on the same domain
   `options` - optional values to override defaults
   | `avatarHeight` - the offset from the ground at which to place the camera
   | `walkSpeed` - how quickly the avatar moves across the ground
   | `button`
   | `model` - the model to use to make buttons, in THREE JSON format
   | `options` - configuration parameters for buttons
   | `maxThrow` - the distance the button may move
   | `minDeflection` - the angle boundary in which to do hit tests on the button
   | `colorUnpressed` - the color of the button when it is not depressed
   | `colorPressed` - the color of the button when it is depressed
   | `gravity` - the acceleration applied to falling objects (default: 9.8)
   | `useLeap` - use the Leap Motion device
   | `backgroundColor` - the color that WebGL clears the background with before drawing (default: 0x000000)
   | `drawDistance` - the far plane of the camera (default: 500)
   | `chatTextSize` - the size of a single line of text, in world units (default: 0.25)
   | `dtNetworkUpdate` - the amount of time to allow to elapse between sending state to teh server (default: 0.125)
   */
  var RIGHT = new THREE.Vector3( 1, 0, 0 ),
      UP = new THREE.Vector3( 0, 1, 0 ),
      FORWARD = new THREE.Vector3( 0, 0, -1 ),
      POINTER_RADIUS = 0.01,
      POINTER_RESCALE = 20,
      FORWARDED_EVENTS = [
        "keydown", "keyup", "keypress",
        "mousedown", "mouseup", "mousemove", "wheel",
        "touchstart", "touchend", "touchmove" ],
      RESOLUTION_SCALE = 1;

  pliny.class( "Primrose", {
    name: "VRApplication",
    description: "Make a Virtual Reality app in your web browser!"
  } );
  function VRApplication ( name, options ) {
    this.options = combineDefaults( options, VRApplication.DEFAULTS );

    var setSize = function ( ) {
      var canvasWidth,
          canvasHeight,
          aspectWidth;

      if ( this.inVR ) {
        var p = this.input.transforms,
            l = p[0],
            r = p[1];
        canvasWidth = Math.floor( ( l.viewport.width + r.viewport.width ) * RESOLUTION_SCALE );
        canvasHeight = Math.floor( Math.max( l.viewport.height, r.viewport.height ) * RESOLUTION_SCALE );
        aspectWidth = canvasWidth / 2;
        this.camera.aspect = aspectWidth / canvasHeight;
      }
      else {
        var bounds = this.renderer.domElement.getBoundingClientRect( ),
            boundsRatio = screen.width / screen.height,
            elementWidth = bounds.width,
            elementHeight = isiOS ? ( elementWidth * boundsRatio ) : ( elementWidth / boundsRatio ),
            pixelRatio = devicePixelRatio || 1;
        canvasWidth = Math.floor( elementWidth * pixelRatio * RESOLUTION_SCALE );
        canvasHeight = Math.floor( elementHeight * pixelRatio * RESOLUTION_SCALE );
        aspectWidth = canvasWidth;
        if ( isMobile ) {
          document.body.style.height = Math.max( document.body.clientHeight, elementHeight ) + "px";
          document.documentElement.style.height = Math.max( document.documentElement.clientHeight, elementHeight ) + "px";
        }
        this.renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
        this.renderer.setScissor( 0, 0, canvasWidth, canvasHeight );
        this.camera.fov = this.options.defaultFOV;
        this.camera.aspect = aspectWidth / canvasHeight;
        this.camera.updateProjectionMatrix( );
      }
      this.renderer.domElement.width = canvasWidth;
      this.renderer.domElement.height = canvasHeight;
    }.bind( this );

    var fire = emit.bind( this );

    this.addEventListener = function ( event, thunk, bubbles ) {
      if ( this.listeners[event] ) {
        this.listeners[event].push( thunk );
      }
      else if ( FORWARDED_EVENTS.indexOf( event ) >= 0 ) {
        window.addEventListener( event, thunk, bubbles );
      }
    };

    var lockedToEditor = function () {
      return this.currentControl && this.currentControl.readOnly === false;
    }.bind( this );

    this.zero = function ( ) {
      if ( !lockedToEditor() ) {
        this.player.position.set( 0, this.avatarHeight, 0 );
        this.player.velocity.set( 0, 0, 0 );
        this.input.zero();
      }
    };

    this.jump = function ( ) {
      if ( this.player.isOnGround && !lockedToEditor() ) {
        this.player.velocity.y += this.options.jumpSpeed;
        this.player.isOnGround = false;
      }
    };

    var makeEditor = function ( scene, id, w, h, options ) {
      var SCALE = isMobile ? 0.25 : 0.5;
      options.size = options.size || new Primrose.Text.Size( 1024 * w, 1024 * h );
      options.fontSize = options.fontSize || 32;
      if ( options.opacity === undefined ) {
        options.opacity = 1;
      }
      var text = new Primrose.Text.Controls.TextBox( id, options ),
          cellWidth = Math.round( SCALE * 1024 * w / options.fontSize ),
          cellHeight = Math.round( SCALE * 1024 * h / options.fontSize ),
          makeGeom = options.useShell ?
          shell.bind( null, 1, cellWidth, cellHeight ) :
          quad.bind( null, w, h, 1, 1 ),
          mesh = textured( makeGeom(), text, false, options.opacity );

      scene.add( mesh );

      text.mesh = mesh;
      mesh.textarea = text;

      this.registerPickableObject( mesh );
      return text;
    }.bind( this );

    var makeTextArea = function (  ) {
      return makeEditor(
          this.scene, "textEditor" + this.pickableObjects.length,
          1, 1, {
            tokenizer: Primrose.Text.Grammars.JavaScript,
            useShell: true,
            keyEventSource: window,
            wheelEventSource: this.renderer.domElement
          } );
    }.bind( this );

    var makePre = function ( ) {
      return makeEditor(
          this.scene, "textEditor" + this.pickableObjects.length,
          1, 1, {
            tokenizer: Primrose.Text.Grammars.PlainText,
            useShell: false,
            keyEventSource: window,
            wheelEventSource: this.renderer.domElement,
            hideLineNumbers: true,
            readOnly: true
          } );
    }.bind( this );

    var makeButton = function ( ) {
      var btn = this.buttonFactory.create( false );
      this.scene.add( btn.container );
      this.registerPickableObject( btn.cap );
      return btn;
    }.bind( this );

    var elementConstructors = {
      textarea: makeTextArea,
      pre: makePre,
      button: makeButton
    };

    this.appendChild = function ( elem ) {
      var type = elem.tagName.toLocaleLowerCase(),
          obj = null;

      if ( elementConstructors[type] ) {
        obj = elementConstructors[type]( );
        obj.copyElement( elem );
      }

      return obj;
    };

    this.convertToEditor = function ( obj ) {
      var editor = new Primrose.Text.Controls.TextBox( "textEditor", {
        size: new Primrose.Text.Size( 1024, 1024 ),
        fontSize: 32,
        tokenizer: Primrose.Text.Grammars.Basic,
        theme: Primrose.Text.Themes.Dark,
        keyEventSource: window,
        wheelEventSource: this.renderer.domElement,
        hideLineNumbers: true
      } );
      textured( obj, editor );
      editor.mesh = obj;
      obj.textarea = editor;
      this.registerPickableObject( obj );
      return editor;
    };

    this.registerPickableObject = function ( obj ) {
      if ( obj.type === "Object3D" ) {
        obj.children[0].name = obj.children[0].name || obj.name;
        obj = obj.children[0];
      }
      if ( obj ) {
        var bag = createPickableObject( obj ),
            verts, faces, uvs, i;

        // it would be nice to do this the other way around, to have everything
        // stored in ArrayBuffers, instead of regular arrays, to pass to the
        // Worker thread. Maybe later.
        if ( obj.geometry instanceof THREE.BufferGeometry ) {
          var attr = obj.geometry.attributes,
              pos = attr.position,
              uv = attr.uv,
              idx = attr.index;

          verts = [ ];
          faces = [ ];
          if ( uv ) {
            uvs = [ ];
          }
          for ( i = 0; i < pos.count; ++i ) {
            verts.push( [ pos.getX( i ), pos.getY( i ), pos.getZ( i ) ] );
            if ( uv ) {
              uvs.push( [ uv.getX( i ), uv.getY( i ) ] );
            }
          }
          if ( idx ) {
            for ( i = 0; i < idx.count - 2; ++i ) {
              faces.push( [ idx.getX( i ), idx.getX( i + 1 ), idx.getX( i + 2 ) ] );
            }
          }
          else {
            for ( i = 0; i < pos.count; i += 3 ) {
              faces.push( [ i, i + 1, i + 2 ] );
            }
          }
        }
        else {
          verts = obj.geometry.vertices.map( function ( v ) {
            return v.toArray( );
          } );
          faces = [ ];
          uvs = [ ];
          // IDK why, but non-buffered geometry has an additional array layer
          for ( i = 0; i < obj.geometry.faces.length; ++i ) {
            var f = obj.geometry.faces[i],
                faceUVs = obj.geometry.faceVertexUvs[0][i];
            faces.push( [ f.a, f.b, f.c ] );
            uvs[f.a] = [ faceUVs[0].x, faceUVs[0].y ];
            uvs[f.b] = [ faceUVs[1].x, faceUVs[1].y ];
            uvs[f.c] = [ faceUVs[2].x, faceUVs[2].y ];
          }
        }

        bag.geometry = {
          vertices: verts,
          faces: faces,
          uvs: uvs
        };

        this.pickableObjects.push( obj );
        this.projector.setObject( bag );
      }
    };

    this.findObject = function ( id ) {
      for ( var i = 0; i < this.pickableObjects.length; ++i ) {
        if ( this.pickableObjects[i].uuid === id ) {
          return this.pickableObjects[i];
        }
      }
    };

    var animate = function ( t ) {
      RAF( animate );
      t *= 0.001;
      var dt = t - lt,
          heading = 0,
          pitch = 0,
          strafe = 0,
          drive = 0,
          i, j;
      lt = t;

      this.input.update( dt );
      heading = this.input.getValue( "heading" );
      strafe = this.input.getValue( "strafe" );
      drive = this.input.getValue( "drive" );
      pitch = this.input.getValue( "pitch" );
      this.input.getQuaternion( "headRX", "headRY", "headRZ", "headRW", qHead );
      qPitch.setFromAxisAngle( RIGHT, pitch );
      this.nose.visible = this.inVR;
      if ( !this.player.isOnGround ) {
        this.player.velocity.y -= this.options.gravity * dt;
      }
      else if ( !lockedToEditor() ) {
        this.player.velocity.set( strafe, 0, drive )
            .normalize()
            .multiplyScalar( this.walkSpeed );

        qHeading.setFromAxisAngle( UP, currentHeading );
        this.player.velocity.applyQuaternion( qHead );
        this.player.velocity.y = 0;
        this.player.velocity.applyQuaternion( qHeading );
      }

      this.player.position.add( vTemp.copy( this.player.velocity ).multiplyScalar( dt ) );
      if ( !this.player.isOnGround && this.player.position.y < this.avatarHeight ) {
        this.player.isOnGround = true;
        this.player.position.y = this.avatarHeight;
        this.player.velocity.y = 0;
      }

      if ( this.sky ) {
        this.sky.position.copy( this.player.position );
      }

      if ( this.ground ) {
        this.ground.position.set(
            Math.floor( this.player.position.x ),
            0,
            Math.floor( this.player.position.z ) );
        this.ground.material.needsUpdate = true;
      }

      if ( this.inVR ) {
        var dHeading = heading - currentHeading;
        if ( !lockedToEditor() && Math.abs( dHeading ) > Math.PI / 5 ) {
          var dh = Math.sign( dHeading ) * Math.PI / 100;
          currentHeading += dh;
          heading -= dh;
          dHeading = heading - currentHeading;
        }
        this.player.quaternion.setFromAxisAngle( UP, currentHeading );
        qHeading.setFromAxisAngle( UP, dHeading ).multiply( qPitch );
      }
      else {
        currentHeading = heading;
        this.player.quaternion.setFromAxisAngle( UP, currentHeading );
        this.player.quaternion.multiply( qPitch );
      }

      this.pointer.position.copy( FORWARD );
      if ( this.inVR && !isMobile ) {
        this.pointer.position.applyQuaternion( qHeading );
      }
      if ( !lockedToEditor() || isMobile ) {
        this.pointer.position.add( this.camera.position );
        this.pointer.position.applyQuaternion( this.camera.quaternion );
      }
      this.pointer.position.applyQuaternion( this.player.quaternion );
      this.pointer.position.add( this.player.position );
      if ( this.projector.ready ) {
        this.projector.ready = false;
        this.projector.updateObjects( this.pickableObjects.map( createPickableObject ) );
        this.projector.projectPointer( [
          this.pointer.position.toArray( ),
          transformForPicking( this.player ) ] );
      }

      var lastButtons = this.input.getValue( "dButtons" );
      if ( currentHit ) {
        var fp = currentHit.facePoint, fn = currentHit.faceNormal,
            object = this.findObject( currentHit.objectID );
        this.pointer.position.set(
            fp[0] + fn[0] * POINTER_RADIUS,
            fp[1] + fn[1] * POINTER_RADIUS,
            fp[2] + fn[2] * POINTER_RADIUS );

        if ( object === this.ground ) {
          this.pointer.scale.set( POINTER_RESCALE, POINTER_RESCALE, POINTER_RESCALE );
        }
        else {
          this.pointer.scale.set( 1, 1, 1 );
        }
        this.pointer.material.color.setRGB( 1, 1, 1 );
        this.pointer.material.emissive.setRGB( 0.25, 0.25, 0.25 );
        if ( object ) {
          var buttons = this.input.getValue( "buttons" ),
              clickChanged = lastButtons !== 0,
              control = object.textarea || object.button;

          if ( !lockedToEditor() ) {
            buttons |= this.input.keyboard.getValue( "select" );
            clickChanged = clickChanged || this.input.keyboard.getValue( "dSelect" ) !== 0;
          }
          if ( lastHit && currentHit && lastHit.objectID === currentHit.objectID && !clickChanged && buttons > 0 ) {
            fire( "pointermove", currentHit );
          }
          else {
            if ( lastHit && clickChanged && buttons === 0 ) {
              fire( "pointerend", lastHit );
            }
            if ( currentHit && clickChanged && buttons > 0 ) {
              fire( "pointerstart", currentHit );
            }
          }

          if ( clickChanged && buttons > 0 ) {
            if ( this.currentControl && this.currentControl !== control ) {
              this.currentControl.blur( );
              this.currentControl = null;
            }

            if ( !this.currentControl && control ) {
              this.currentControl = control;
              this.currentControl.focus( );
            }
            else if ( object === this.ground ) {
              this.player.position.copy( this.pointer.position );
              this.player.position.y = this.avatarHeight;
              this.player.isOnGround = false;
            }
          }

          if ( this.currentControl ) {
            if ( clickChanged ) {
              if ( buttons > 0 ) {
                this.currentControl.startUV( currentHit.point );
              }
              else {
                this.currentControl.endPointer( );
              }
            }
            else if ( !clickChanged && buttons > 0 ) {
              this.currentControl.moveUV( currentHit.point );
            }
          }
        }
      }
      else {
        if ( this.currentControl && lastButtons > 0 ) {
          this.currentControl.blur( );
          this.currentControl = null;
        }
        this.pointer.material.color.setRGB( 1, 0, 0 );
        this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
        this.pointer.scale.set( 1, 1, 1 );
      }

      fire( "update", dt );
      for ( j = 0; j < this.pickableObjects.length; ++j ) {
        var obj = this.pickableObjects[j],
            txt = obj.textarea;
        if ( txt ) {
          txt.render( );
        }
      }

      if ( this.inVR ) {
        for ( i = 0; i < this.input.transforms.length; ++i ) {
          var st = this.input.transforms[i],
              v = st.viewport,
              side = ( 2 * i ) - 1;
          this.input.getVector3( "headX", "headY", "headZ", this.camera.position );
          this.camera.projectionMatrix.copy( st.projection );
          this.camera.position.applyMatrix4( st.translation );
          this.camera.quaternion.copy( qHead );

          this.nose.position.set( side * -0.12, -0.12, -0.15 );
          this.nose.rotation.z = side * 0.7;
          this.renderer.setViewport(
              v.left * RESOLUTION_SCALE,
              v.top * RESOLUTION_SCALE,
              v.width * RESOLUTION_SCALE,
              v.height * RESOLUTION_SCALE );
          this.renderer.setScissor(
              v.left * RESOLUTION_SCALE,
              v.top * RESOLUTION_SCALE,
              v.width * RESOLUTION_SCALE,
              v.height * RESOLUTION_SCALE );
          this.renderer.render( this.scene, this.camera );
          this.input.vr.submitFrame();
        }
      }
      else {
        this.camera.position.set( 0, 0, 0 );
        this.camera.quaternion.copy( qHead );
        this.renderer.render( this.scene, this.camera );
      }
    }.bind( this );
    //
    // restoring the options the user selected
    //
    this.ctrls = Primrose.DOM.findEverything();
    this.formStateKey = name + " - formState";
    this.formState = getSetting( this.formStateKey );
    this.fullscreenElement = document.documentElement;
    this.users = {};
    this.chatLines = [ ];
    this.userName = VRApplication.DEFAULT_USER_NAME;
    this.focused = true;
    this.wasFocused = false;

    writeForm( this.ctrls, this.formState );
    window.addEventListener( "beforeunload", function ( ) {
      this.stop();
      if ( this.inVR ) {
        this.input.vr.currentDisplay.exitPresent();
      }
      var state = readForm( this.ctrls );
      setSetting( this.formStateKey, state );
    }.bind( this ), false );

    this.setupModuleEvents = function ( container, module, name ) {
      var eID = name + "Enable",
          tID = name + "Transmit",
          rID = name + "Receive",
          e = document.createElement( "input" ),
          t = document.createElement( "input" ),
          r = document.createElement( "input" ),
          row = document.createElement( "tr" );
      this.ctrls[eID] = e;
      this.ctrls[tID] = t;
      this.ctrls[rID] = r;
      e.id = eID;
      t.id = tID;
      r.id = rID;
      e.type = t.type = r.type = "checkbox";
      e.checked = this.formState[eID];
      t.checked = this.formState[tID];
      r.checked = this.formState[rID];
      e.addEventListener( "change", function ( t, module ) {
        module.enable( this.checked );
        t.disabled = !this.checked;
        if ( t.checked && t.disabled ) {
          t.checked = false;
        }
      }.bind( e, t, module ) );
      t.addEventListener( "change", function ( module ) {
        module.transmit( this.checked );
      }.bind( t, module ) );
      r.addEventListener( "change", function ( module ) {
        module.receive( this.checked );
      }.bind( r, module ) );
      container.appendChild( row );
      addCell( row, name );
      addCell( row, e );
      addCell( row, t );
      addCell( row, r );
      if ( module.zeroAxes ) {
        var zID = name + "Zero",
            z = document.createElement( "input" );
        this.ctrls[zID] = z;
        z.id = zID;
        z.type = "checkbox";
        z.checked = this.formState[zID];
        z.addEventListener( "click", module.zeroAxes.bind( module ), false );
        addCell( row, z );
      }
      else {
        r.colspan = 2;
      }

      module.enable( e.checked );
      module.transmit( t.checked );
      module.receive( r.checked );
      t.disabled = !e.checked;
      if ( t.checked && t.disabled ) {
        t.checked = false;
      }
    };
    //
    // Initialize local variables
    //
    var lt = 0,
        lastHit = null,
        currentHit = null,
        currentHeading = 0,
        qPitch = new THREE.Quaternion( ),
        qHeading = new THREE.Quaternion( ),
        qHead = new THREE.Quaternion( ),
        vTemp = new THREE.Vector3(),
        skin = Primrose.Random.item( Primrose.SKIN_VALUES ),
        sceneLoaded = !this.options.sceneModel,
        buttonLoaded = !this.options.button,
        readyFired = false;

    //
    // Initialize public properties
    //
    this.currentControl = null;
    this.avatarHeight = this.options.avatarHeight;
    this.walkSpeed = this.options.walkSpeed;
    this.listeners = {
      ready: [ ],
      update: [ ],
      gazestart: [ ],
      gazecomplete: [ ],
      gazecancel: [ ],
      pointerstart: [ ],
      pointermove: [ ],
      pointerend: [ ]
    };

    this.audio = new Primrose.Output.Audio3D( );

    this.music = new Primrose.Output.Music( this.audio.context );

    this.pickableObjects = [ ];

    this.projector = new Primrose.Workerize( Primrose.Projector );
    this.projector.ready = true;

    this.player = new THREE.Object3D( );
    this.player.velocity = new THREE.Vector3( );
    this.player.position.set( 0, this.avatarHeight, 0 );
    this.player.isOnGround = true;

    this.pointer = textured( sphere( POINTER_RADIUS, 10, 10 ), 0xff0000 );
    this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
    this.pointer.material.opacity = 0.75;

    this.nose = textured( sphere( 0.05, 10, 10 ), skin );
    this.nose.name = "Nose";
    this.nose.scale.set( 0.5, 1, 1 );

    this.renderer = new THREE.WebGLRenderer( {
      canvas: Primrose.DOM.cascadeElement( this.options.canvasElement, "canvas", HTMLCanvasElement ),
      antialias: !isMobile,
      alpha: !isMobile,
      logarithmicDepthBuffer: !isMobile,
      DEBUG_WEBGL: this.options.DEBUG_WEBGL
    } );
    this.renderer.autoSortObjects = !isMobile;
    this.renderer.enableScissorTest( true );
    this.renderer.setClearColor( this.options.backgroundColor );
    if ( !this.renderer.domElement.parentElement ) {
      document.body.appendChild( this.renderer.domElement );
    }

    this.input = new Primrose.Input.FPSInput(
        this.renderer.domElement,
        this.options.nearPlane,
        this.options.drawDistance );

    this.scene = new THREE.Scene( );
    if ( this.options.useFog ) {
      this.scene.fog = new THREE.FogExp2( this.options.backgroundColor, 2 / this.options.drawDistance );
    }

    this.camera = new THREE.PerspectiveCamera( 75, 1, this.options.nearPlane, this.options.drawDistance );

    if ( this.options.skyTexture ) {
      this.sky = textured(
          shell(
              this.options.drawDistance,
              18,
              9,
              Math.PI * 2,
              Math.PI ),
          this.options.skyTexture,
          true );
      this.sky.name = "Sky";
      this.scene.add( this.sky );
    }

    if ( this.options.groundTexture ) {
      var dim = 2 * this.options.drawDistance,
          gm = new THREE.PlaneGeometry( dim, dim, dim, dim );
      this.ground = textured( gm, this.options.groundTexture, false, 1, dim, dim );
      this.ground.rotation.x = Math.PI / 2;
      this.ground.name = "Ground";
      this.scene.add( this.ground );
      this.registerPickableObject( this.ground );
    }

    this.camera.add( this.nose );
    this.camera.add( light( 0xffffff, 1, 2, 0.5 ) );
    this.player.add( this.camera );
    this.scene.add( this.player );
    this.scene.add( this.pointer );

    if ( this.passthrough ) {
      this.camera.add( this.passthrough.mesh );
    }

    if ( this.options.sceneModel ) {
      Primrose.ModelLoader.loadScene( this.options.sceneModel, function ( sceneGraph ) {
        sceneLoaded = true;
        this.scene.add.apply( this.scene, sceneGraph.children );
        this.scene.traverse( function ( obj ) {
          if ( obj.name ) {
            this.scene[obj.name] = obj;
          }
        }.bind( this ) );
        if ( sceneGraph.Camera ) {
          this.camera.position.copy( sceneGraph.Camera.position );
          this.camera.quaternion.copy( sceneGraph.Camera.quaternion );
        }
      }.bind( this ) );
    }

    if ( this.options.button ) {
      this.buttonFactory = new Primrose.ButtonFactory(
          this.options.button.model,
          this.options.button.options,
          function () {
            buttonLoaded = true;
          } );
    }
    else {
      this.buttonFactory = new Primrose.ButtonFactory(
          brick( 0xff0000, 1, 1, 1 ), {
        maxThrow: 0.1,
        minDeflection: 10,
        colorUnpressed: 0x7f0000,
        colorPressed: 0x007f00,
        toggle: true
      } );
    }


    var waitForResources = function ( t ) {
      lt = t * 0.001;
      if ( sceneLoaded && buttonLoaded ) {
        if ( !readyFired ) {
          readyFired = true;
          setSize( );
          try {
            fire( "ready" );
          }
          catch ( exp ) {
            console.error( exp );
            console.warn( "There was an error during setup, but we're going to continue anyway." );
          }
        }
        RAF( animate );
      }
      else {
        RAF( waitForResources );
      }
    }.bind( this );

    var RAF = function ( callback ) {
      if ( this.inVR ) {
        this.timer = this.input.vr.currentDisplay.requestAnimationFrame( callback );
      }
      else {
        this.timer = requestAnimationFrame( callback );
      }
    }.bind( this );

    this.start = function ( ) {
      if ( !this.timer ) {
        RAF( waitForResources );
      }
    }.bind( this );

    this.stop = function ( ) {
      if ( this.inVR ) {
        this.input.vr.currentDisplay.cancelAnimationFrame( this.timer );
      }
      else {
        cancelAnimationFrame( this.timer );
      }
      this.timer = null;
    }.bind( this );

    var handleHit = function ( h ) {
      var dt;
      this.projector.ready = true;
      lastHit = currentHit;
      currentHit = h;
      if ( lastHit && currentHit && lastHit.objectID === currentHit.objectID ) {
        currentHit.startTime = lastHit.startTime;
        currentHit.gazeFired = lastHit.gazeFired;
        dt = lt - currentHit.startTime;
        if ( dt >= this.options.gazeLength && !currentHit.gazeFired ) {
          currentHit.gazeFired = true;
          fire( "gazecomplete", currentHit );
        }
      }
      else {
        if ( lastHit ) {
          dt = lt - lastHit.startTime;
          if ( dt < this.options.gazeLength ) {
            fire( "gazecancel", lastHit );
          }
        }
        if ( currentHit ) {
          currentHit.startTime = lt;
          currentHit.gazeFired = false;
          fire( "gazestart", currentHit );
        }
      }
    }.bind( this );

    var basicKeyHandler = function ( evt ) {
      if ( !evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey ) {
        if ( this.inVR && evt.keyCode === Primrose.Keys.ESCAPE ) {
          this.stop();
          this.input.vr.currentDisplay.exitPresent()
              .then( restart )
              .catch( restart );
        }
        if ( !lockedToEditor() && evt.keyCode === Primrose.Keys.F ) {
          this.goFullScreen( true );
        }
        else if ( evt.keyCode === 219 && RESOLUTION_SCALE > 0.2 ) {
          RESOLUTION_SCALE -= 0.1;
          setSize();
        }
        else if ( evt.keyCode === 221 && RESOLUTION_SCALE < 3 ) {
          RESOLUTION_SCALE += 0.1;
          setSize();
        }
      }
    }.bind( this );

    var restart = function () {
      setSize();
      this.start();
    }.bind( this );

    //
    // Manage full-screen state
    //
    this.goFullScreen = function ( useVR ) {
      this.input.mouse.requestPointerLock( );
      if ( !isFullScreenMode( ) ) {
        if ( useVR && this.input.vr && this.input.vr.currentDisplay ) {
          console.log( "requesting presentation mode" );
          this.stop();
          this.input.vr.currentDisplay.requestPresent( {
            source: this.renderer.domElement
          } )
              .then( restart )
              .catch( restart );
        }
        else if ( !isiOS ) {
          requestFullScreen( this.renderer.domElement );
        }
        else {
          setSize();
        }
        history.pushState( null, document.title, "#fullscreen" );
      }
    };

    var controlsBlock = null;

    this.setFullScreenButton = function ( id, event, useVR ) {
      var elem = document.getElementById( id );
      if ( elem ) {
        var show = !useVR || isVR || isMobile;
        elem.style.cursor = show ? "pointer" : "not-allowed";
        elem.title = show ? ( useVR ? "Go Split-Screen" : "Go Fullscreen" ) : "VR is not available in your current browser.";
        elem.addEventListener( event, this.goFullScreen.bind( this, useVR ), false );
        if ( !controlsBlock ) {
          controlsBlock = elem.parentElement;
        }
      }
    };

    window.addEventListener( "popstate", function ( evt ) {
      if ( isFullScreenMode( ) ) {
        if ( this.inVR ) {
          this.stop();
          this.input.vr.exitPresent()
              .then( restart )
              .catch( restart );
        }
        else {
          exitFullScreen( );
        }
        evt.preventDefault( );
      }
    }, true );

    window.addEventListener( "resize", setSize, false );
    if ( !this.options.disableAutoFullScreen ) {
      window.addEventListener( "mousedown", this.goFullScreen.bind( this, true ), false );
      window.addEventListener( "touchstart", this.goFullScreen.bind( this, true ), false );
    }
    window.addEventListener( "keydown", basicKeyHandler, false );
    this.input.addEventListener( "jump", this.jump.bind( this ), false );
    this.input.addEventListener( "zero", this.zero.bind( this ), false );
    this.projector.addEventListener( "hit", handleHit, false );
    window.addEventListener( "blur", this.stop, false );
    window.addEventListener( "focus", this.start, false );
    this.renderer.domElement.addEventListener( 'webglcontextlost', this.stop, false );
    this.renderer.domElement.addEventListener( 'webglcontextrestored', this.start, false );

    Object.defineProperty( this, "inVR", {
      get: function () {
        return this.input.vr && this.input.vr.currentDisplay && this.input.vr.currentDisplay.isPresenting;
      }
    } );

    if ( window.alert.toString().indexOf( "native code" ) > -1 ) {
      // overwrite the native alert functions so they can't be called while in
      // fullscreen VR mode.

      var rerouteDialog = function ( oldFunction, newFunction ) {
        if ( !newFunction ) {
          newFunction = function () {
          };
        }
        return function () {
          if ( isFullScreenMode() ) {
            newFunction();
          }
          else {
            oldFunction.apply( window, arguments );
          }
        }.bind( this );
      }.bind( this );

      window.alert = rerouteDialog( window.alert );
      window.confirm = rerouteDialog( window.confirm );
      window.prompt = rerouteDialog( window.prompt );
    }

    this.start();
  }

  VRApplication.DEFAULT_USER_NAME = "CURRENT_USER_OFFLINE";

  VRApplication.DEFAULTS = {
    useLeap: false,
    useFog: false,
    avatarHeight: 1.75,
    walkSpeed: 2,
    // the acceleration applied to falling objects
    gravity: 9.8,
    jumpSpeed: 3.13,
    // by default, we want fullscreen to happen whenever the user touches the screen
    disableAutoFullScreen: false,
    // the color that WebGL clears the background with before drawing
    backgroundColor: 0xafbfff,
    // the near plane of the camera
    nearPlane: 0.1,
    // the far plane of the camera
    drawDistance: 100,
    // the field of view to use in non-VR settings
    defaultFOV: 75,
    // the size of a single line of text, in world units
    chatTextSize: 0.25,
    // the amount of time to allow to elapse between sending state to the server
    dtNetworkUpdate: 0.125,
    canvasElement: "frontBuffer",
    gazeLength: 1
//    ,DEBUG_WEBGL: {
//      errorHandler: undefined,
//      logger: undefined
//    }
  };

  function createPickableObject ( obj ) {
    var bag = {
      uuid: obj.uuid,
      visible: obj.visible,
      name: obj.name
    };
    var originalBag = bag,
        head = obj;
    while ( head !== null ) {
      head.updateMatrix( );
      bag.matrix = head.matrix.elements.subarray( 0, head.matrix.elements.length );
      bag.parent = head.parent ? {} : null;
      bag = bag.parent;
      head = head.parent;
    }
    return originalBag;
  }

  function transformForPicking ( obj ) {
    var p = obj.position.clone( );
    obj = obj.parent;
    while ( obj !== null ) {
      p.applyMatrix4( obj.matrix );
      obj = obj.parent;
    }
    return p.toArray( );
  }

  function addCell ( row, elem ) {
    if ( typeof elem === "string" ) {
      elem = document.createTextNode( elem );
    }
    var cell = document.createElement( "td" );
    cell.appendChild( elem );
    row.appendChild( cell );
  }

  function isFullScreenMode () {
    return ( document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement );
  }

  function requestFullScreen ( elem, vrDisplay ) {
    var fullScreenParam;

    if ( typeof HMDVRDevice !== "undefined" && vrDisplay && vrDisplay instanceof HMDVRDevice ) {
      fullScreenParam = {vrDisplay: vrDisplay, vrDistortion: true};
    }

    if ( elem.webkitRequestFullscreen ) {
      elem.webkitRequestFullscreen( fullScreenParam || window.Element.ALLOW_KEYBOARD_INPUT );
    }
    else if ( elem.mozRequestFullScreen && fullScreenParam ) {
      elem.mozRequestFullScreen( fullScreenParam );
    }
    else if ( elem.mozRequestFullScreen && !fullScreenParam ) {
      elem.mozRequestFullScreen( );
    }
    else if ( elem.requestFullscreen ) {
      elem.requestFullscreen();
    }
    else if ( elem.msRequestFullscreen ) {
      elem.msRequestFullscreen();
    }
  }

  function exitFullScreen () {
    if ( isFullScreenMode() ) {
      if ( document.exitFullscreen ) {
        document.exitFullscreen();
      }
      else if ( document.webkitExitFullscreen ) {
        document.webkitExitFullscreen();
      }
      else if ( document.webkitCancelFullScreen ) {
        document.webkitCancelFullScreen();
      }
      else if ( document.mozCancelFullScreen ) {
        document.mozCancelFullScreen();
      }
      else if ( document.msExitFullscreen ) {
        document.msExitFullscreen();
      }
    }
  }

  return VRApplication;
} )( );

pliny.issue( "Primrose.VRApplication", {
  name: "document VRApplication",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.VRApplication](#Primrose_VRApplication) class in the  directory"
} );

pliny.issue( "Primrose.VRApplication", {
  name: "scene FOV issues",
  type: "open",
  description: "Image appears \"zoomed in\" when in VR mode. See \n\
[VR mode seems \"zoomed in\" with DK2 · Issue #72 · capnmidnight/Primrose](https://github.com/capnmidnight/Primrose/issues/72) \n\
for more information."
} );

pliny.issue( "Primrose.VRApplication", {
  name: "default light",
  type: "open",
  description: "When the user does not define a scene model file and opts to use the\n\
default scene, make sure a point light is added to the scene so the ground is visible."
} );
;/* global Primrose, io, Window, pliny */

Primrose.WebRTCSocket = ( function () {

  /* polyfills */
  Window.prototype.RTCPeerConnection =
      Window.prototype.RTCPeerConnection ||
      Window.prototype.webkitRTCPeerConnection ||
      Window.prototype.mozRTCPeerConnection ||
      function () {
      };

  Window.prototype.RTCIceCandidate =
      Window.prototype.RTCIceCandidate ||
      Window.prototype.mozRTCIceCandidate ||
      function () {
      };

  Window.prototype.RTCSessionDescription =
      Window.prototype.RTCSessionDescription ||
      Window.prototype.mozRTCSessionDescription ||
      function () {
      };

  pliny.class( "Primrose", {
    name: "WebRTCSocket",
    description: "<under construction>"
  } );
  function WebRTCSocket ( proxyServer, isStarHub ) {
    var socket,
        peers = [ ],
        channels = [ ],
        listeners = {},
        myIndex = null;

    function descriptionCreated ( myIndex, theirIndex, description ) {
      description.fromIndex = myIndex;
      description.toIndex = theirIndex;
      peers[theirIndex].setLocalDescription( description, function () {
        socket.emit( description.type, description );
      } );
    }

    function descriptionReceived ( theirIndex, description, thunk ) {
      if ( description.fromIndex === theirIndex ) {
        var remote = new RTCSessionDescription( description );
        peers[theirIndex].setRemoteDescription( remote, thunk );
      }
    }

    if ( typeof ( proxyServer ) === "string" ) {
      socket = io.connect( proxyServer, {
        "reconnect": true,
        "reconnection delay": 1000,
        "max reconnection attempts": 60
      } );
    }
    else if ( proxyServer && proxyServer.on && proxyServer.emit ) {
      socket = proxyServer;
    }
    else {
      console.error( "proxy error", socket );
      throw new Error( "need a socket" );
    }

    function setChannelEvents ( index ) {

      channels[index].addEventListener( "open", function () {
        if ( listeners.open ) {
          for ( var i = 0; i < listeners.open.length; ++i ) {
            var l = listeners.open[i];
            if ( l ) {
              l.call( this );
            }
          }
        }
      }, false );

      channels[index].addEventListener( "message", function ( evt ) {
        var args = JSON.parse( evt.data ),
            key = args.shift();
        if ( listeners[key] ) {
          for ( var i = 0; i < listeners[key].length; ++i ) {
            var l = listeners[key][i];
            if ( l ) {
              l.apply( this, args );
            }
          }
        }
      }, false );

      function connectionLost () {
        channels[index] = null;
        peers[index] = null;
        var closed = ( channels.filter( function ( c ) {
          return c;
        } ).length === 0 );
        if ( closed && listeners.close ) {
          for ( var i = 0; i < listeners.close.length; ++i ) {
            var l = listeners.close[i];
            if ( l ) {
              l.call( this );
            }
          }
        }
      }

      channels[index].addEventListener( "error", connectionLost, false );
      channels[index].addEventListener( "close", connectionLost, false );
    }

    this.on = function ( evt, thunk ) {
      if ( !listeners[evt] ) {
        listeners[evt] = [ ];
      }
      listeners[evt].push( thunk );
    };

    this.emit = function ( args ) {
      var data = JSON.stringify( args );
      for ( var i = 0; i < channels.length; ++i ) {
        var channel = channels[i];
        if ( channel && channel.readyState === "open" ) {
          channel.send( data );
        }
      }
    };

    this.close = function () {
      channels.forEach( function ( channel ) {
        if ( channel && channel.readyState === "open" ) {
          channel.close();
        }
      } );
      peers.forEach( function ( peer ) {
        if ( peer ) {
          peer.close();
        }
      } );
    };

    window.addEventListener( "unload", this.close.bind( this ) );

    this.connect = function ( connectionKey ) {
      socket.emit( "handshake", "peer" );

      socket.on( "handshakeComplete", function ( name ) {
        if ( name === "peer" ) {
          socket.emit( "joinRequest", connectionKey );
        }
      } );
    };

    socket.on( "user", function ( index, theirIndex ) {
      try {
        if ( myIndex === null ) {
          myIndex = index;
        }
        if ( !peers[theirIndex] ) {
          var peer = new RTCPeerConnection( {
            iceServers: [
              "stun.l.google.com:19302",
              "stun1.l.google.com:19302",
              "stun2.l.google.com:19302",
              "stun3.l.google.com:19302",
              "stun4.l.google.com:19302"
            ].map( function ( o ) {
              return {url: "stun:" + o};
            } )
          } );

          peers[theirIndex] = peer;

          peer.addEventListener( "icecandidate", function ( evt ) {
            if ( evt.candidate ) {
              evt.candidate.fromIndex = myIndex;
              evt.candidate.toIndex = theirIndex;
              socket.emit( "ice", evt.candidate );
            }
          }, false );

          socket.on( "ice", function ( ice ) {
            if ( ice.fromIndex === theirIndex ) {
              peers[theirIndex].addIceCandidate( new RTCIceCandidate( ice ) );
            }
          } );

          if ( isStarHub === true || ( isStarHub === undefined && myIndex <
              theirIndex ) ) {
            peer.addEventListener( "negotiationneeded", function ( evt ) {
              peer.createOffer(
                  descriptionCreated.bind( this, myIndex, theirIndex ),
                  console.error.bind( console, "createOffer error" ) );
            } );

            var channel = peer.createDataChannel( "data-channel-" + myIndex +
                "-to-" + theirIndex, {
                  id: myIndex,
                  ordered: false,
                  maxRetransmits: 0
                } );
            channels[theirIndex] = channel;
            setChannelEvents( theirIndex );

            socket.on( "answer", function ( answer ) {
              if ( answer.fromIndex === theirIndex ) {
                descriptionReceived( theirIndex, answer );
              }
            } );
          }
          else if ( isStarHub === false || ( isStarHub === undefined &&
              myIndex > theirIndex ) ) {
            peer.addEventListener( "datachannel", function ( evt ) {
              if ( evt.channel.id === theirIndex ) {
                channels[evt.channel.id] = evt.channel;
                setChannelEvents( theirIndex );
              }
            }, false );

            socket.on( "offer", function ( offer ) {
              if ( offer.fromIndex === theirIndex ) {
                descriptionReceived( theirIndex, offer, function () {
                  peers[theirIndex].createAnswer(
                      descriptionCreated,
                      console.error.bind( console, "createAnswer error" ) );
                } );
              }
            } );
          }
        }
      }
      catch ( exp ) {
        console.error( exp );
      }
    } );
  }
  return WebRTCSocket;
} )();

pliny.issue( "Primrose.WebRTCSocket", {
  name: "document WebRTCSocket",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.WebRTCSocket](#Primrose_WebRTCSocket) class in the  directory"
} );
;/* global Primrose, URL, pliny */

Primrose.Workerize = ( function () {
  pliny.class( "Primrose", {
    name: "Workerize",
    description: "Builds a WebWorker thread out of a JavaScript class's source code, and attempts to create a message interface that matches the message-passing interface that the class already uses.\n\
\n\
Automatically workerized classes should have methods that take a single array for any parameters and return no values. All return results should come through an Event that the class emits.",
    parameters: [
      {name: "func", type: "Function", description: "The class function to workerize"}
    ],
    examples: [
      {name: "Create a basic workerized class.",
        description: "Classes in JavaScript are created by adding new functions to the `prototype` of another function, then instantiating objects from that class with `new`. When creating such a class for automatic workerization, a few restrictions are required:\n\
* All methods in the class must be on the prototype. Any methods created and assigned in the constructor will not be available to the message passing interface.\n\
* All interaction with objects of the class must be through these publically accessible methods. This includes initialization.\n\
* All methods should take at most a single arguemnt. If you need multiple arguments, pack them into an array.\n\
* The methods cannot return any values. If a value must be returned to the calling context, it must be done through an event callback.\n\
* The class must assign handlers to events through an addEventListener method that mirrors the standard interface used in DOM. Workerize will not respect the 3rd `bubbles` parameter that is so often ommitted when programming against DOM.\n\
\n\
Assuming the following class:\n\
\n\
    grammar(\"JavaScript\");\n\
    function MyClass(){\n\
      this.listeners = {\n\
        complete: []\n\
      };\n\
      this.objects = [];\n\
    }\n\
\n\
    MyClass.prototype.addEventListener = function(evt, handler){\n\
      if(this.listeners[evt]){\n\
        this.listeners[evt].push(handler);\n\
      }\n\
    };\n\
\n\
    MyClass.prototype.addObject = function(obj){\n\
      this.objects.push(obj);\n\
    };\n\
\n\
    MyClass.prototype.update = function(dt){\n\
      // we can make essentially arbitrarily small timeslice updates\n\
      var SLICE = 0.1;\n\
      for(var ddt = 0; ddt < dt; ddt += SLICE){\n\
        for(var i = 0; i < this.objects.length; ++i){\n\
          var o = this.objects[i];\n\
          o.x += o.vx * SLICE;\n\
          o.y += o.vy * SLICE;\n\
          o.z += o.vz * SLICE;\n\
        }\n\
      }\n\
      // prepare our return state for the UI thread.\n\
      var returnValue = [];\n\
      for(var i = 0; i < this.objects.length; ++i){\n\
        returnValue.push([o.x, o.y, o.z]);\n\
      }\n\
      // and emit the event to all of the listeners.\n\
      for(var i = 0; i < this.listeners.complete.length; ++i){\n\
        this.listeners.complete[i](returnValue);\n\
      }\n\
    };\n\
\n\
Then we can create and use an automatically workerized version of it as follows.\n\
\n\
    grammar(\"JavaScript\");\n\
    var phys = new Primrose.Workerize(MyClass);\n\
    // we keep a local copy of the state so we can perform other operations on it.\n\
    var objects = [];\n\
    for(var i = 0; i < 10; ++i){\n\
      var obj = {\n\
        // random values between -1 and 1\n\
        x: 2 * Math.random() - 1,\n\
        y: 2 * Math.random() - 1,\n\
        z: 2 * Math.random() - 1,\n\
        vx: 2 * Math.random() - 1,\n\
        vy: 2 * Math.random() - 1,\n\
        vz: 2 * Math.random() - 1\n\
      };\n\
      objects.push(obj);\n\
      phys.addObject(obj);\n\
    }\n\
    \n\
    // this flag lets us keep track of whether or not we know that the worker is in the middle of an expensive operation.\n\
    phys.ready = true;\n\
    phys.addEventListener(\"complete\", function(newPositions){\n\
      // We update the state in the UI thread with the expensively-computed values.\n\
      for(var i = 0; i < newPositions.length; ++i){\n\
        objects[i].x = newPositions[i][0];\n\
        objects[i].y = newPositions[i][1];\n\
        objects[i].z = newPositions[i][2];\n\
      }\n\
      phys.ready = true;\n\
    });\n\
    \n\
    var lt = null;\n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      if(lt === undefined || lt === null){\n\
        lt = t;\n\
      } else {\n\
        var dt = t - lt;\n\
        if(phys.ready){\n\
          phys.ready = false;\n\
          phys.update(dt);\n\
          lt = t;\n\
        }\n\
        for(var i = 0; i < objects.length; ++i){\n\
          var o = objects[i];\n\
          // We can even perform a much cheaper position update to smooth over the blips in the expensive update on the worker thread.\n\
          drawObjectAt(o.x + o.vx * dt, o.y + o.vy * dt, o.z + o.vz * dt);\n\
        }\n\
      }\n\
    }\n\
    requestAnimationFrame(paint);"}
    ]
  } );
  function Workerize ( func ) {
    // First, rebuild the script that defines the class. Since we're dealing
    // with pre-ES6 browsers, we have to use ES5 syntax in the script, or invoke
    // a conversion at a point post-script reconstruction, pre-workerization.

    // start with the constructor function
    var script = func.toString(),
        // strip out the name in a way that Internet Explorer also undrestands 
        // (IE doesn't have the Function.name property supported by Chrome and
        // Firefox)
        matches = script.match( /function\s+(\w+)\s*\(/ ),
        name = matches[1],
        k;

    // then rebuild the member methods
    for ( k in func.prototype ) {
      // We preserve some formatting so it's easy to read the code in the debug
      // view. Yes, you'll be able to see the generated code in your browser's
      // debugger.
      script += "\n\n" + name + ".prototype." + k + " = " + func.prototype[k].toString() + ";";
    }

    // Automatically instantiate an object out of the class inside the worker,
    // in such a way that the user-defined function won't be able to get to it.
    script += "\n\n(function(){\n  var instance = new " + name + "(true);";

    // Create a mapper from the events that the class defines to the worker-side
    // postMessage method, to send message to the UI thread that one of the
    // events occured.
    script += "\n  if(instance.addEventListener){\n" +
        "    self.args = [null, null];\n" +
        "    for(var k in instance.listeners) {\n" +
        "      instance.addEventListener(k, function(eventName, args){\n" +
        "        self.args[0] = eventName;\n" +
        "        self.args[1] = args;\n" +
        "        postMessage(self.args);\n" +
        "      }.bind(this, k));\n" +
        "    }\n" +
        "  }";

    // Create a mapper from the worker-side onmessage event, to receive messages
    // from the UI thread that methods were called on the object.
    script += "\n\n  onmessage = function(evt){\n" +
        "    var f = evt.data[0],\n" +
        "        t = instance[f];\n" +
        "    if(t){\n" +
        "      t.call(instance, evt.data[1]);\n" +
        "    }\n" +
        "  };\n\n" +
        "})();";

    // The binary-large-object can be used to convert the script from text to a
    // data URI, because workers can only be created from same-origin URIs.
    pliny.property( {
      name: "worker",
      type: "WebWorker",
      description: "The worker thread containing our class."
    } );
    this.worker = Workerize.createWorker( script, false );

    pliny.property( {
      name: "args",
      type: "Array",
      description: "Static allocation of an array to save on memory usage when piping commands to a worker."
    } );
    this.args = [ null, null ];

    // create a mapper from the UI-thread side onmessage event, to receive
    // messages from the worker thread that events occured and pass them on to
    // the UI thread.
    pliny.property( {
      name: "listeners",
      type: "Object",
      description: "A bag of arrays of callbacks for each of the class' events."
    } );
    this.listeners = {};


    this.worker.onmessage = function ( e ) {
      var f = e.data[0],
          t = this.listeners[f];
      for ( var i = 0; t && i < t.length; ++t ) {
        t[i].call( this, e.data[1] );
      }
    }.bind( this );

    // create mappers from the UI-thread side method calls to the UI-thread side
    // postMessage method, to inform the worker thread that methods were called,
    // with parameters.
    pliny.property( {
      name: "&lt;mappings for each method in the original class&gt;",
      type: "Function",
      description: "Each mapped function causes a message to be posted to the worker thread with its arguments packed into an array."
    } );
    for ( k in func.prototype ) {
      // we skip the addEventListener method because we override it in a
      // different way, to be able to pass messages across the thread boundary.
      if ( k !== "addEventListener" && k[0] !== '_' ) {
        // make the name of the function the first argument, no matter what.
        this[k] = this.methodShim.bind( this, k );
      }
    }
  }

  pliny.method( "Primrose.Workerize", {
    name: "methodShim",
    description: "Posts messages to the worker thread by packing arguments into an array. The worker will receive the array and interpret the first value as the name of the method to invoke and the second value as another array of parameters.",
    parameters: [
      {name: "methodName", type: "String", description: "The method inside the worker context that we want to invoke."},
      {name: "args", type: "Array", description: "The arguments that we want to pass to the method that we are calling in the worker context."}
    ]
  } );
  Workerize.prototype.methodShim = function ( eventName, args ) {
    this.args[0] = eventName;
    this.args[1] = args;
    this.worker.postMessage( this.args );
  };

  pliny.method( "Primrose.Workerize", {
    name: "addEventListener",
    description: "Adding an event listener just registers a function as being ready to receive events, it doesn't do anything with the worker thread yet.",
    parameters: [
      {name: "evt", type: "String", description: "The name of the event for which we are listening."},
      {name: "thunk", type: "Function", description: "The callback to fire when the event occurs."}
    ]
  } );
  Workerize.prototype.addEventListener = function ( evt, thunk ) {
    if ( !this.listeners[evt] ) {
      this.listeners[evt] = [ ];
    }
    this.listeners[evt].push( thunk );
  };


  pliny.function( "Primrose.Workerize", {
    name: "createWorker",
    description: "A static function that loads Plain Ol' JavaScript Functions into a WebWorker.",
    parameters: [
      {name: "script", type: "(String|Function)", description: "A String defining a script, or a Function that can be toString()'d to get it's script."},
      {name: "stripFunc", type: "Boolean", description: "Set to true if you want the function to strip the surround function block scope from the script."}
    ],
    returns: "The WebWorker object."
  } );
  Workerize.createWorker = function ( script, stripFunc ) {
    if ( typeof script === "function" ) {
      script = script.toString();
    }

    if ( stripFunc ) {
      script = script.trim();
      var start = script.indexOf( '{' );
      script = script.substring( start + 1, script.length - 1 );
    }

    var blob = new Blob( [ script ], {
      type: "text/javascript"
    } ),
        dataURI = URL.createObjectURL( blob );

    return new Worker( dataURI );
  };

  return Workerize;
} )();

pliny.issue( "Primrose.Workerize", {
  name: "document Workerize",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.Workerize](#Primrose_Workerize) class in the  directory"
} );
;/* global pliny */


pliny.issue( "", {
  name: "document helpers/fmt.js",
  type: "closed",
  description: "Finish writing the documentation for the [fmt](#fmt) file in the helpers/ directory"
} );


pliny.issue( "", {
  name: "document sigfig function",
  type: "closed",
  description: "Finish writing the documentation for the [sigfig](#sigfig) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "sigfig",
  description: "Formats a decimal number to a certain length of decimal points.",
  parameters: [
    {name: "x", type: "Number", description: "The number to format."},
    {name: "y", type: "Number", description: "The number of digits after the decimal point to show."}
  ],
  returns: "String",
  examples: [ {
      name: "A few examples.",
      description: "\
    grammar(\"JavaScript\");\n\
    // Round a number to an integer.\n\
    console.assert(sigfig(12.345, 0) === \"12\");\n\
     \n\
    // sigfig respects rounding rules.\n\
    console.assert(sigfig(123.4567, 2) === \"123.46\");\n\
     \n\
    // sigfig will pad extra zeroes.\n\
    console.assert(sigfig(123.4, 3) === \"123.400\");"}
  ]
} );
function sigfig ( x, y ) {
  var p = Math.pow( 10, y );
  var v = ( Math.round( x * p ) / p ).toString();
  if ( y > 0 ) {
    var i = v.indexOf( "." );
    if ( i === -1 ) {
      v += ".";
      i = v.length - 1;
    }
    while ( v.length - i - 1 < y )
      v += "0";
  }
  return v;
}

pliny.issue( "", {
  name: "document fmt function",
  type: "closed",
  description: "Finish writing the documentation for the [fmt](#fmt) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "fmt",
  parameters: [
    {name: "template", type: "String", description: "The template string containing dollar-sign delimited value references."},
    {name: "varargs...", type: "Any", description: "The values to replace into the template. Generally speaking, the `toString()` method of the object will be called. However, dates have special handling. The precision count indicates the fields of the date to print.\n\
* $1.0 - prints just the 4-digit year.\n\
* $1.00 - prints the 2-digit month/4-digit year.\n\
* $1.000 - prints the result of calling `toLocaleDateString()` on the date value.\n\
* $1.0000 - prints the result of calling `toLocaleTimeString()` on the date value, plus additional milliseconds value.\n\
* $1.00000 - same as...\n\
* $1.000000 - prints the result of calling `toLocaleString()` on the date value.\n\
* $1.0000000 - prints the result of calling `toLocaleString()` on the date value, plus additional milliseconds value."}
  ],
  returns: "A formatted string.",
  description: "Replaces 1-indexed place holders in a string with the subsequent \n\
parameters passed to the `fmt()` function, e.g. a \n\ template `\"X: $1, Y: $2\"`\n\
expects to parameters following directly after the template.\n\
\n\
Template place holders start with a dollar sign ($) and are followed by a digit\n\
that references the parameter position of the value to use in the text replacement.\n\
Note that the first position, position 0, would be the template itself. However, you\n\
cannot reference the first position, as zero digit characters are used to indicate\n\
the width to which to pad values.\n\
\n\
Numerical precision, with zero-padding, is indicated with a period and trailing zeros.",
  examples: [
    {name: "Basic examples",
      description: "\
    grammar(\"JavaScript\");\n\
    console.assert(fmt(\"a: $1, b: $2\", 123, \"Sean\") === \"a: 123, b: Sean\");\n\
    console.assert(fmt(\"$001, $002, $003\", 1, 23, 456) === \"001, 023, 456\");\n\
    console.assert(fmt(\"$1.000\", Math.PI) === \"3.142\");\n\
    console.assert(fmt(\"$1.0000\", Math.PI) === \"3.1416\");\n\
    console.assert(fmt(\"$1.00000\", Math.PI) === \"3.14159\");\n\
    console.assert(fmt(\"$1.00 + $2.00 = $3.00\", 0.1, 0.2, 0.1 + 0.2) === \"0.10 + 0.20 = 0.30\");\n\
    // Note that the following values were obtained evaluating the code in the US locale. They won't literally evaluate true.\n\
    console.assert(fmt(\"The current year is $1.0.\", new Date() ) === \"The current year is 2016.\");\n\
    console.assert(fmt(\"The current month and year is $1.00.\", new Date() ) === \"The current month and year is 1/2016.\");\n\
    console.assert(fmt(\"The current date is $1.000.\", new Date() ) === \"The current date is 1/25/2016.\");\n\
    console.assert(fmt(\"The current time is $1.0000.\", new Date() ) === \"The current time is 10:05:28.772 PM.\");\n\
    console.assert(fmt(\"The current date and time is $1.00000.\", new Date() ) === \"The current date and time is 1/25/2016, 10:06:06 PM.\");\n\
    console.assert(fmt(\"The current date and time is $1.0000000.\", new Date() ) === \"The current date and time is 1/25/2016, 10:06:55.667 PM.\");"} ]
} );
var fmt = ( function () {

  function addMillis ( val, txt ) {
    return txt.replace( /( AM| PM|$)/, function ( match, g1 ) {
      return ( val.getMilliseconds() / 1000 ).toString()
          .substring( 1 ) + g1;
    } );
  }

  // - match a dollar sign ($) literally,
  // - (optional) then zero or more zero digit (0) characters, greedily
  // - then one or more digits (the previous rule would necessitate that
  //      the first of these digits be at least one).
  // - (optional) then a period (.) literally
  // -            then one or more zero digit (0) characters
  var paramRegex = /\$(0*)(\d+)(?:\.(0+))?/g;

  function fmt ( template ) {
    var args = arguments;
    if ( typeof template !== "string" ) {
      template = template.toString();
    }
    return template.replace( paramRegex, function ( m, pad, index, precision ) {
      index = parseInt( index, 10 );
      if ( 0 <= index && index < args.length ) {
        var val = args[index];
        if ( val !== null && val !== undefined ) {
          if ( val instanceof Date && precision ) {
            switch ( precision.length ) {
              case 1:
                val = ( val.getYear() + 1900 );
                break;
              case 2:
                val = ( val.getMonth() + 1 ) + "/" + ( val.getYear() + 1900 );
                break;
              case 3:
                val = val.toLocaleDateString();
                break;
              case 4:
                val = addMillis( val, val.toLocaleTimeString() );
                break;
              case 5:
              case 6:
                val = val.toLocaleString();
                break;
              default:
                val = addMillis( val, val.toLocaleString() );
                break;
            }
            return val;
          }
          else {
            if ( precision && precision.length > 0 ) {
              val = sigfig( val, precision.length );
            }
            else {
              val = val.toString();
            }
            if ( pad && pad.length > 0 ) {
              var paddingRegex = new RegExp( "^\\d{" + ( pad.length + 1 ) + "}(\\.\\d+)?" );
              while ( !paddingRegex.test( val ) ) {
                val = "0" + val;
              }
            }
            return val;
          }
        }
      }
      return undefined;
    } );
  }
  return fmt;
} )();



pliny.issue( "", {
  name: "document px function",
  type: "closed",
  description: "Finish writing the documentation for the [px](#px) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "px",
  description: "Appends the string \"px\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS pixel-unit value."} ],
  returns: "The number as a string, plus the text \"px\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(px(100.5) === \"100.5px\");"} ]
} );
var px = fmt.bind( this, "$1px" );

pliny.issue( "", {
  name: "document pct function",
  type: "closed",
  description: "Finish writing the documentation for the [pct](#pct) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "pct",
  description: "Appends the string \"%\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS percentage-unit value."} ],
  returns: "The number as a string, plus the text \"%\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(pct(100.5) === \"100.5%\");"} ]
} );
var pct = fmt.bind( this, "$1%" );

pliny.issue( "", {
  name: "document ems function",
  type: "closed",
  description: "Finish writing the documentation for the [ems](#ems) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "ems",
  description: "Appends the string \"em\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS em-unit value."} ],
  returns: "The number as a string, plus the text \"em\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(ems(100.5) === \"100.5em\");"} ]
} );
var ems = fmt.bind( this, "$1em" );

pliny.function( "", {
  name: "rems",
  description: "Appends the string \"rem\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS rem-unit value."} ],
  returns: "The number as a string, plus the text \"em\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(rems(100.5) === \"100.5rem\");"} ]
} );
var rems = fmt.bind( this, "$1rem" );

pliny.function( "", {
  name: "vws",
  description: "Appends the string \"vw\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS view-width-unit value."} ],
  returns: "The number as a string, plus the text \"vw\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(vws(100.5) === \"100.5vw\");"} ]
} );
var vws = fmt.bind( this, "$1vw" );

pliny.issue( "", {
  name: "document rgb function",
  type: "closed",
  description: "Finish writing the documentation for the [rgb](#rgb) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "rgb",
  description: "Builds a CSS `rbg()` color-value string from three parameters.",
  parameters: [
    {name: "red", type: "Number", description: "The red component, on the range [0, 255]."},
    {name: "green", type: "Number", description: "The green component, on the range [0, 255]."},
    {name: "blue", type: "Number", description: "The blue component, on the range [0, 255]."} ],
  returns: "The color-value string, e.g. `rgb(120, 230, 64)`.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(rgb(120, 230, 64) === \"rgb(120, 230, 64)\");"} ]
} );
var rgb = fmt.bind( this, "rgb($1, $2, $3)" );

pliny.issue( "", {
  name: "document rgba function",
  type: "closed",
  description: "Finish writing the documentation for the [rgba](#rgba) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "rgba",
  description: "Builds a CSS `rbga()` color-value string from three parameters.",
  parameters: [
    {name: "red", type: "Number", description: "The red component, on the range [0, 255]."},
    {name: "green", type: "Number", description: "The green component, on the range [0, 255]."},
    {name: "blue", type: "Number", description: "The blue component, on the range [0, 255]."},
    {name: "alpha", type: "Number", description: "The alpha component, on the range [0, 1]."} ],
  returns: "The color-value string, e.g. `rgba(120, 230, 64, 0.75)`.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(rgba(120, 230, 64, 0.75) === \"rgba(120, 230, 64, 0.75)\");"} ]
} );
var rgba = fmt.bind( this, "rgba($1, $2, $3, $4)" );

pliny.issue( "", {
  name: "document hsl function",
  type: "closed",
  description: "Finish writing the documentation for the [hsl](#hsl) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "hsl",
  description: "Builds a CSS `hsl()` color-value string from three parameters.",
  parameters: [
    {name: "hue", type: "Number", description: "The hue angle, on the range [0, 360]. By definition, 0 = 360. Values also wrap-around, so -120 = 240."},
    {name: "saturation", type: "Number", description: "The saturation percentage, on the range [0, 100]."},
    {name: "lightness", type: "Number", description: "The lightness percentage, on the range [0, 100]."} ],
  returns: "The color-value string, e.g. `hsl(120, 100, 50)`.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(hsl(120, 100, 50) === \"hsl(120, 100%, 50%)\");"} ]
} );
var hsl = fmt.bind( this, "hsl($1, $2%, $3%)" );

pliny.issue( "", {
  name: "document hsla function",
  type: "closed",
  description: "Finish writing the documentation for the [hsla](#hsla) function in the helpers/fmt.js file."
} );
pliny.function( "", {
  name: "hsla",
  description: "Builds a CSS `hsla()` color-value string from three parameters.",
  parameters: [
    {name: "hue", type: "Number", description: "The hue angle, on the range [0, 360]. By definition, 0 = 360. Values also wrap-around, so -120 = 240."},
    {name: "saturation", type: "Number", description: "The saturation percentage, on the range [0, 100]."},
    {name: "lightness", type: "Number", description: "The lightness percentage, on the range [0, 100]."},
    {name: "alpha", type: "Number", description: "The alpha component, on the range [0, 1]."} ],
  returns: "The color-value string, e.g. `hsla(120, 100, 50, 0.25)`.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(hsla(120, 100, 50) === \"hsla(120, 100%, 50%, 0.25)\");"} ]
} );
var hsla = fmt.bind( this, "hsla($1, $2%, $3%, $4)" );;/* global pliny */

pliny.issue( "", {
  name: "document getSetting",
  type: "closed",
  description: "Finish writing the documentation for the `getSetting()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "getSetting",
  parameters: [
    {name: " name", type: "string", description: "The name of the setting to read."},
    {name: "defValue", type: "Object", description: "The default value to return, if the setting is not present in `localStorage`."}
  ],
  returns: "The Object stored in `localStorage` for the given name, or the default value provided if the setting doesn't exist in `localStorage`.",
  description: "Retrieves named values out of `localStorage`. The values should\n\
be valid for passing to `JSON.parse()`. A default value can be specified in the\n\
function call that should be returned if the value does not exist, or causes an\n\
error in parsing. Typically, you'd call this function at page-load time after having\n\
called the [`setSetting()`](#setSetting) function during a previous page session.",
  examples: [
    {name: "Basic usage",
      description: "Assuming a text input element with the id `text1`, the following\n\
code should persist between reloads whatever the user writes in the text area:\n\
\n\
    grammar(\"JavaScript\");\n\
    var text1 = document.getElementById(\"text1\");\n\
    document.addEventListener(\"unload\", function(){\n\
      setSetting(\"text1-value\", text1.value);\n\
    }, false);\n\
    document.addEventListener(\"load\", function(){\n\
      text1.value = getSetting(\"text1-value\", \"My default value!\");\n\
    }, false);"} ]
} );
function getSetting ( name, defValue ) {
  if ( window.localStorage ) {
    var val = window.localStorage.getItem( name );
    if ( val ) {
      try {
        return JSON.parse( val );
      }
      catch ( exp ) {
        console.error( "getSetting", name, val, typeof ( val ), exp );
      }
    }
  }
  return defValue;
}

pliny.issue( "", {
  name: "document setSetting",
  type: "closed",
  description: "Finish writing the documentation for the `setSetting()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "setSetting",
  parameters: [
    {name: " name", type: "string", description: "The name of the setting to set."},
    {name: "val", type: "Object", description: "The value to write. It should be useable as a parameter to `JSON.stringify()`."}
  ],
  description: "Writes named values to `localStorage`. The values should be valid\n\
for passing to `JSON.stringify()`. Typically, you'd call this function at page-unload\n\
time, then call the [`getSetting()`](#getSetting) function during a subsequent page load.",
  examples: [
    {name: "Basic usage",
      description: "Assuming a text input element with the id `text1`, the following\n\
code should persist between reloads whatever the user writes in the text area:\n\
\n\
    grammar(\"JavaScript\");\n\
    var text1 = document.getElementById(\"text1\");\n\
    document.addEventListener(\"unload\", function(){\n\
      setSetting(\"text1-value\", text1.value);\n\
    }, false);\n\
    document.addEventListener(\"load\", function(){\n\
      text1.value = getSetting(\"text1-value\", \"My default value!\");\n\
    }, false);"} ]
} );
function setSetting ( name, val ) {
  if ( window.localStorage && val ) {
    try {
      window.localStorage.setItem( name, JSON.stringify( val ) );
    }
    catch ( exp ) {
      console.error( "setSetting", name, val, typeof ( val ), exp );
    }
  }
}

pliny.issue( "", {
  name: "document deleteSetting",
  type: "closed",
  description: "Finish writing the documentation for the `deleteSetting()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "deleteSetting",
  parameters: [
    {name: " name", type: "string", description: "The name of the setting to delete."}
  ],
  description: "Removes an object from localStorage",
  examples: [ {
      name: "Basic usage",
      description: "\
\n\
    grammar(\"JavaScript\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"default-A\");\n\
    setSetting(\"A\", \"modified-A\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"modified-A\");\n\
    deleteSetting(\"A\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"default-A\");"
    } ]
} );
function deleteSetting ( name ) {
  if ( window.localStorage ) {
    window.localStorage.removeItem( name );
  }
}

pliny.issue( "", {
  name: "document readForm",
  type: "closed",
  description: "Finish writing the documentation for the `readForm()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "readForm",
  parameters: [
    {name: "ctrls", type: "Hash of Elements", description: "An array of HTML form elements, aka INPUT, TEXTAREA, SELECT, etc."}
  ],
  returns: "Object",
  description: "Scans through an array of input elements and builds a state object that contains the values the input elements represent. Elements that do not have an ID attribute set, or have an attribute `data-skipcache` set, will not be included.",
  examples: [ {
      name: "Basic usage",
      description: "Assuming the following HTML form:\n\
\n\
    grammar(\"HTML\");\n\
    <form>\n\
      <input type=\"text\" id=\"txt\" value=\"hello\">\n\
      <input type=\"number\" id=\"num\" value=\"5\">\n\
    </form>\n\
\n\
##Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var ctrls = findEverything();\n\
    ctrls.txt.value = \"world\";\n\
    ctrls.num.value = \"6\"6;\n\
    var state = readForm(ctrls);\n\
    console.assert(state.txt === \"world\");\n\
    console.assert(state.num === \"6\");\n\
    state.txt = \"mars\";\n\
    state.num = 55;\n\
    writeForm(ctrls, state);\n\
    console.assert(ctrls.txt.value === \"mars\");\n\
    console.assert(ctrls.num.value === \"55\");"
    } ]
} );
function readForm ( ctrls ) {
  var state = {};
  if ( ctrls ) {
    for ( var name in ctrls ) {
      var c = ctrls[name];
      if ( ( c.tagName === "INPUT" || c.tagName === "SELECT" ) &&
          ( !c.dataset || !c.dataset.skipcache ) ) {
        if ( c.type === "text" || c.type === "password" || c.tagName === "SELECT" ) {
          state[name] = c.value;
        }
        else if ( c.type === "checkbox" || c.type === "radio" ) {
          state[name] = c.checked;
        }
      }
    }
  }
  return state;
}


pliny.issue( "", {
  name: "document writeForm",
  type: "closed",
  description: "Finish writing the documentation for the `writeForm()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "writeForm",
  parameters: [
    {name: "ctrls", type: "Hash of Elements", description: "A hash-collection of HTML input elements that will have their values set."},
    {name: "state", type: "Hash object", description: "The values that will be set on the form. Hash keys should match IDs of the elements in the `ctrls` parameter."}
  ],
  description: "Writes out a full set of state values to an HTML input form, wherever keys in the `ctrls` parameter match keys in the `state` parameter.",
  examples: [ {
      name: "Basic usage",
      description: "Assuming the following HTML form:\n\
\n\
    grammar(\"HTML\");\n\
    <form>\n\
      <input type=\"text\" id=\"txt\" value=\"hello\">\n\
      <input type=\"number\" id=\"num\" value=\"5\">\n\
    </form>\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var ctrls = findEverything();\n\
    ctrls.txt.value = \"world\";\n\
    ctrls.num.value = \"6\"6;\n\
    var state = readForm(ctrls);\n\
    console.assert(state.txt === \"world\");\n\
    console.assert(state.num === \"6\");\n\
    state.txt = \"mars\";\n\
    state.num = 55;\n\
    writeForm(ctrls, state);\n\
    console.assert(ctrls.txt.value === \"mars\");\n\
    console.assert(ctrls.num.value === \"55\");"
    } ]
} );
function writeForm ( ctrls, state ) {
  if ( state ) {
    for ( var name in ctrls ) {
      var c = ctrls[name];
      if ( state[name] !== null && state[name] !== undefined &&
          ( c.tagName ===
              "INPUT" || c.tagName === "SELECT" ) && ( !c.dataset ||
          !c.dataset.skipcache ) ) {
        if ( c.type === "text" || c.type === "password" || c.tagName === "SELECT" ) {
          c.value = state[name];
        }
        else if ( c.type === "checkbox" || c.type === "radio" ) {
          c.checked = state[name];
        }
      }
    }
  }
}

pliny.issue( "", {
  name: "document helpers/forms.js",
  type: "closed",
  description: "Finish writing the documentation for the [forms](#forms) file in the helpers/ directory."
} );
;/* global THREE, Primrose, isMobile, pliny */

pliny.issue( "", {
  name: "document InsideSphereGeometry",
  type: "closed",
  description: "Finish writing the documentation for the [`InsideSphereGeometry`](#InsideSphereGeometry) class\n\
in the helpers/graphics.js file."
} );
pliny.class( "", {
  name: "InsideSphereGeometry",
  parameters: [
    {name: "radius", type: "Number", description: "How far the sphere should extend away from a center point."},
    {name: "widthSegments", type: "Number", description: "The number of faces wide in which to slice the geometry."},
    {name: "heightSegments", type: "Number", description: "The number of faces tall in which to slice the geometry."},
    {name: "phiStart", type: "Number", description: "The angle in radians around the Y-axis at which the sphere starts."},
    {name: "phiLength", type: "Number", description: "The change of angle in radians around the Y-axis to which the sphere ends."},
    {name: "thetaStart", type: "Number", description: "The angle in radians around the Z-axis at which the sphere starts."},
    {name: "thetaLength", type: "Number", description: "The change of angle in radians around the Z-axis to which the sphere ends."}
  ],
  description: "The InsideSphereGeometry is basically an inside-out Sphere. Or\n\
more accurately, it's a Sphere where the face winding order is reversed, so that\n\
textures appear on the inside of the sphere, rather than the outside. I know, that's\n\
note exactly helpful.\n\
\n\
Say you want a to model the sky as a sphere, or the inside of a helmet. You don't\n\
care anything about the outside of this sphere, only the inside. You would use\n\
InsideSphereGeometry in this case. Or its alias, [`shell()`](#shell)."
} );
function InsideSphereGeometry ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {
  "use strict";

  THREE.Geometry.call( this );

  this.type = 'InsideSphereGeometry';

  this.parameters = {
    radius: radius,
    widthSegments: widthSegments,
    heightSegments: heightSegments,
    phiStart: phiStart,
    phiLength: phiLength,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };

  radius = radius || 50;

  widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
  heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

  phiStart = phiStart !== undefined ? phiStart : 0;
  phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

  thetaStart = thetaStart !== undefined ? thetaStart : 0;
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

  var x,
      y,
      vertices = [ ],
      uvs = [ ];

  for ( y = 0; y <= heightSegments; y++ ) {

    var verticesRow = [ ];
    var uvsRow = [ ];

    for ( x = widthSegments; x >= 0; x-- ) {

      var u = x / widthSegments;

      var v = y / heightSegments;

      var vertex = new THREE.Vector3();
      vertex.x = -radius * Math.cos( phiStart + u * phiLength ) * Math.sin(
          thetaStart + v * thetaLength );
      vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
      vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin(
          thetaStart + v * thetaLength );

      this.vertices.push( vertex );

      verticesRow.push( this.vertices.length - 1 );
      uvsRow.push( new THREE.Vector2( 1 - u, 1 - v ) );

    }

    vertices.push( verticesRow );
    uvs.push( uvsRow );

  }

  for ( y = 0; y < heightSegments; y++ ) {

    for ( x = 0; x < widthSegments; x++ ) {

      var v1 = vertices[ y ][ x + 1 ];
      var v2 = vertices[ y ][ x ];
      var v3 = vertices[ y + 1 ][ x ];
      var v4 = vertices[ y + 1 ][ x + 1 ];

      var n1 = this.vertices[ v1 ].clone()
          .normalize();
      var n2 = this.vertices[ v2 ].clone()
          .normalize();
      var n3 = this.vertices[ v3 ].clone()
          .normalize();
      var n4 = this.vertices[ v4 ].clone()
          .normalize();

      var uv1 = uvs[ y ][ x + 1 ].clone();
      var uv2 = uvs[ y ][ x ].clone();
      var uv3 = uvs[ y + 1 ][ x ].clone();
      var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

      if ( Math.abs( this.vertices[ v1 ].y ) === radius ) {

        uv1.x = ( uv1.x + uv2.x ) / 2;
        this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

      }
      else if ( Math.abs( this.vertices[ v3 ].y ) === radius ) {

        uv3.x = ( uv3.x + uv4.x ) / 2;
        this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

      }
      else {

        this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

        this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3,
          n4.clone() ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

      }

    }

  }

  this.computeFaceNormals();

  for ( var i = 0; i < this.faces.length; ++i ) {
    var f = this.faces[i];
    f.normal.multiplyScalar( -1 );
    for ( var j = 0; j < f.vertexNormals.length; ++j ) {
      f.vertexNormals[j].multiplyScalar( -1 );
    }
  }

  this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

}
if ( typeof window.THREE !== "undefined" ) {

  InsideSphereGeometry.prototype = Object.create( THREE.Geometry.prototype );
  InsideSphereGeometry.prototype.constructor = InsideSphereGeometry;
}

pliny.issue( "", {
  name: "document shell",
  type: "closed",
  description: "Finish writing the documentation for the [`shell`](#shell) function\n\
in the helpers/graphics.js file."
} );

pliny.function( "", {
  name: "shell",
  parameters: [
    {name: "radius", type: "Number", description: "How far the sphere should extend away from a center point."},
    {name: "widthSegments", type: "Number", description: "The number of faces wide in which to slice the geometry."},
    {name: "heightSegments", type: "Number", description: "The number of faces tall in which to slice the geometry."},
    {name: "phi", type: "Number", description: "The angle in radians around the Y-axis of the sphere."},
    {name: "thetaStart", type: "Number", description: "The angle in radians around the Z-axis of the sphere."}
  ],
  description: "The shell is basically an inside-out sphere. Say you want a to model\n\
the sky as a sphere, or the inside of a helmet. You don't care anything about the\n\
outside of this sphere, only the inside. You would use InsideSphereGeometry in this\n\
case. It is mostly an alias for [`InsideSphereGeometry`](#InsideSphereGeometry).",
  examples: [
    {name: "Create a sky sphere", description: "To create a sphere that hovers around the user at a\n\
far distance, showing a sky of some kind, you can use the `shell()` function in\n\
combination with the [`textured()`](#textured) function. Assuming you have an image\n\
file to use as the texture, execute code as such:\n\
\n\
    grammar(\"JavaScript\");\n\
    var sky = textured(\n\
      shell(\n\
          // The radius value should be less than your draw distance.\n\
          1000,\n\
          // The number of slices defines how smooth the sphere will be in the\n\
          // horizontal direction. Think of it like lines of longitude.\n\
          18,\n\
          // The number of rinigs defines how smooth the sphere will be in the\n\
          // vertical direction. Think of it like lines of latitude.\n\
          9,\n\
          // The phi angle is the number or radians around the 'belt' of the sphere\n\
          // to sweep out the geometry. To make a full circle, you'll need 2 * PI\n\
          // radians.\n\
          Math.PI * 2,\n\
          // The theta angle is the number of radians above and below the 'belt'\n\
          // of the sphere to sweep out the geometry. Since the belt sweeps a full\n\
          // 360 degrees, theta only needs to sweep a half circle, or PI radians.\n\
          Math.PI ),\n\
      // Specify the texture image next.\n\
      \"skyTexture.jpg\",\n\
      // Specify that the material should be shadeless, i.e. no shadows. This\n\
      // works best for skymaps.\n\
      true );" }
  ]
} );
function shell ( r, slices, rings, phi, theta ) {
  var SLICE = 0.45;
  if ( phi === undefined ) {
    phi = Math.PI * SLICE;
  }
  if ( theta === undefined ) {
    theta = Math.PI * SLICE;
  }
  var phiStart = 1.5 * Math.PI - phi * 0.5,
      thetaStart = ( Math.PI - theta ) * 0.5,
      geom = new InsideSphereGeometry( r, slices, rings, phiStart, phi,
          thetaStart, theta, true );
  return geom;
}

pliny.issue( "", {
  name: "document axis",
  type: "open",
  description: "Finish writing the documentation for the [`axis`](#axis) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "axis",
  description: "<under construction>"
} );
function axis ( length, width ) {
  var center = hub();
  put( brick( 0xff0000, length, width, width ) ).on( center );
  put( brick( 0x00ff00, width, length, width ) ).on( center );
  put( brick( 0x0000ff, width, width, length ) ).on( center );
  return center;
}

pliny.issue( "", {
  name: "document box",
  type: "open",
  description: "Finish writing the documentation for the [`box`](#box) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "box",
  description: "<under construction>"
} );
function box ( w, h, l ) {
  if ( h === undefined ) {
    h = w;
    l = w;
  }
  return new THREE.BoxGeometry( w, h, l );
}

pliny.issue( "", {
  name: "document light",
  type: "open",
  description: "Finish writing the documentation for the [`light`](#light) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "light",
  description: "<under construction>"
} );
function light ( color, intensity, distance, decay ) {
  return new THREE.PointLight( color, intensity, distance, decay );
}

pliny.issue( "", {
  name: "document v3",
  type: "open",
  description: "Finish writing the documentation for the [`v3`](#v3) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "v3",
  description: "<under construction>"
} );
function v3 ( x, y, z ) {
  return new THREE.Vector3( x, y, z );
}

pliny.issue( "", {
  name: "document quad",
  type: "open",
  description: "Finish writing the documentation for the [`quad`](#quad) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "quad",
  description: "<under construction>"
} );
function quad ( w, h, s, t ) {
  if ( h === undefined ) {
    h = w;
  }
  return new THREE.PlaneBufferGeometry( w, h, s, t );
}

pliny.issue( "", {
  name: "document hub",
  type: "open",
  description: "Finish writing the documentation for the [`hub`](#hub) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "hub",
  description: "<under construction>"
} );
function hub ( ) {
  return new THREE.Object3D( );
}

pliny.issue( "", {
  name: "document brick",
  type: "open",
  description: "Finish writing the documentation for the [`brick`](#brick) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "brick",
  description: "<under construction>"
} );
function brick ( txt, w, h, l ) {
  return textured( box( w || 1, h || 1, l || 1 ), txt, false, 1, w, l );
}

pliny.issue( "", {
  name: "document put",
  type: "open",
  description: "Finish writing the documentation for the [`put`](#put) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "put",
  description: "<under construction>"
} );
function put ( object ) {
  return {
    on: function ( s ) {
      s.add( object );
      return {
        at: function ( x, y, z ) {
          object.position.set( x, y, z );
          return object;
        }
      };
    }
  };
}

pliny.issue( "", {
  name: "document textured",
  type: "open",
  description: "Finish writing the documentation for the [`textured`](#textured) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "textured",
  description: "<under construction>"
} );
function textured ( geometry, txt, unshaded, o, s, t ) {
  var material;
  if ( o === undefined ) {
    o = 1;
  }

  if ( typeof txt === "number" ) {
    if ( unshaded ) {
      material = new THREE.MeshBasicMaterial( {
        transparent: true,
        color: txt,
        opacity: o,
        shading: THREE.FlatShading
      } );
    }
    else {
      material = new THREE.MeshLambertMaterial( {
        transparent: true,
        color: txt,
        opacity: o
      } );
    }
  }
  else {
    var texture;
    if ( typeof txt === "string" ) {
      texture = THREE.ImageUtils.loadTexture( txt );
    }
    else if ( txt instanceof Primrose.Text.Controls.TextBox ) {
      texture = txt.renderer.texture;
    }
    else {
      texture = txt;
    }

    if ( unshaded ) {
      material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        map: texture,
        transparent: true,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        opacity: o
      } );
    }
    else {
      material = new THREE.MeshLambertMaterial( {
        color: 0xffffff,
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: o
      } );
    }

    if ( s * t > 1 ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( s, t );
    }
  }

  var obj = null;
  if ( geometry.type.indexOf( "Geometry" ) > -1 ) {
    obj = new THREE.Mesh( geometry, material );
  }
  else if ( geometry instanceof THREE.Object3D ) {
    geometry.material = material;
    obj = geometry;
  }

  return obj;
}

pliny.issue( "", {
  name: "document sphere",
  type: "open",
  description: "Finish writing the documentation for the [`sphere`](#sphere) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "sphere",
  description: "<under construction>"
} );
function sphere ( r, slices, rings ) {
  return new THREE.SphereBufferGeometry( r, slices, rings );
}

pliny.issue( "", {
  name: "document cylinder",
  type: "open",
  description: "Finish writing the documentation for the [`cylinder`](#cylinder) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "cylinder",
  description: "<under construction>"
} );
function cylinder ( rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd ) {
  return new THREE.CylinderGeometry( rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd );
}

pliny.issue( "", {
  name: "document cloud",
  type: "open",
  description: "Finish writing the documentation for the [`cloud`](#cloud) function\n\
in the helpers/graphics.js file."
} );
pliny.function( "", {
  name: "cloud",
  description: "<under construction>"
} );
function cloud ( verts, c, s ) {
  var geom = new THREE.Geometry();
  for ( var i = 0; i < verts.length; ++i ) {
    geom.vertices.push( verts[i] );
  }
  var mat = new THREE.PointCloudMaterial( {color: c, size: s} );
  return new THREE.PointCloud( geom, mat );
}

pliny.issue( "", {
  name: "document helpers/graphics",
  type: "open",
  description: "Finish writing the documentation for the [graphics](#graphics) class in the helpers/ directory"
} );
;/* global pliny */

pliny.issue( "", {
  name: "document copyObject",
  type: "open",
  description: "Finish writing the documentation for the [`copyObject`](#copyObject) function\n\
in the helpers/oop.js file."
} );
pliny.function( "", {
  name: "copyObject",
  description: "<under construction>"
} );
function copyObject ( dest, source ) {
  var stack = [ {dest: dest, source: source} ];
  while ( stack.length > 0 ) {
    var frame = stack.pop();
    source = frame.source;
    dest = frame.dest;
    for ( var key in source ) {
      if ( source.hasOwnProperty( key ) ) {
        if ( typeof ( source[key] ) !== "object" ) {
          dest[key] = source[key];
        }
        else {
          if ( !dest[key] ) {
            dest[key] = {};
          }
          stack.push( {dest: dest[key], source: source[key]} );
        }
      }
    }
  }
}

pliny.issue( "", {
  name: "document inherit",
  type: "open",
  description: "Finish writing the documentation for the [`inherit`](#inherit) function\n\
in the helpers/oop.js file."
} );
pliny.function( "", {
  name: "inherit",
  description: "<under construction>"
} );
function inherit ( classType, parentType ) {
  classType.prototype = Object.create( parentType.prototype );
  classType.prototype.constructor = classType;
}


pliny.issue( "", {
  name: "document range",
  type: "open",
  description: "Finish writing the documentation for the [`range`](#range) function\n\
in the helpers/oop.js file."
} );
pliny.function( "", {
  name: "range",
  description: "<under construction>"
} );
function range ( n, m, s, t ) {
  var n2 = s && n || 0,
      m2 = s && m || n,
      s2 = t && s || 1,
      t2 = t || s || m;
  for ( var i = n2; i < m2; i += s2 ) {
    t2( i );
  }
}


pliny.issue( "", {
  name: "document emit",
  type: "open",
  description: "Finish writing the documentation for the [`emit`](#emit) function\n\
in the helpers/oop.js file."
} );
pliny.function( "", {
  name: "emit",
  description: "<under construction>"
} );
function emit ( evt, args ) {
  var handlers = this.listeners[evt];
  for ( var i = 0; i < handlers.length; ++i ) {
    handlers[i]( args );
  }
}

pliny.issue( "", {
  name: "document helpers/oop",
  type: "open",
  description: "Finish writing the documentation for the [oop](#oop) class in the helpers/ directory"
} );
;/* global Primrose, pliny */

pliny.issue( "", {
  name: "document clearKeyOption",
  type: "open",
  description: "Finish writing the documentation for the [`clearKeyOption`](#clearKeyOption) function\n\
in the helpers/options.js file."
} );
pliny.function( "", {
  name: "clearKeyOption",
  description: "<under construction>"
} );
function clearKeyOption ( evt ) {
  this.value = "";
  this.dataset.keycode = "";
}

pliny.issue( "", {
  name: "document setKeyOption",
  type: "open",
  description: "Finish writing the documentation for the [`setKeyOption`](#setKeyOption) function\n\
in the helpers/options.js file."
} );
pliny.function( "", {
  name: "setKeyOption",
  description: "<under construction>"
} );
function setKeyOption ( outElem, elemArr, evt ) {
  this.dataset.keycode = evt.keyCode;
  this.value = this.value || Primrose.Keys[evt.keyCode];
  this.value = this.value.toLocaleLowerCase()
      .replace( "arrow", "" );
  this.blur( );
  var text = elemArr.map( function ( e ) {
    return e.value.toLocaleUpperCase();
  } )
      .join( ", " );
  if ( text.length === 10 ) {
    text = text.replace( /, /g, "" );
  }
  outElem.innerHTML = text;
}

pliny.issue( "", {
  name: "document setupKeyOption",
  type: "open",
  description: "Finish writing the documentation for the [`setupKeyOption`](#setupKeyOption) function\n\
in the helpers/options.js file."
} );
pliny.function( "", {
  name: "setupKeyOption",
  description: "<under construction>"
} );
function setupKeyOption ( outElem, elemArr, index, char, code ) {
  var elem = elemArr[index];
  elem.value = char.toLocaleLowerCase( );
  elem.dataset.keycode = code;
  elem.addEventListener( "keydown", clearKeyOption );
  elem.addEventListener( "keyup", setKeyOption.bind( elem, outElem, elemArr ) );
}

pliny.issue( "", {
  name: "document combineDefaults",
  type: "open",
  description: "Finish writing the documentation for the [`combineDefaults`](#combineDefaults) function\n\
in the helpers/options.js file."
} );
pliny.function( "", {
  name: "combineDefaults",
  description: "<under construction>"
} );
function combineDefaults(a, b){
  var c = {}, k;
  for(k in a){
    c[k] = a[k];
  }
  for(k in b){
    if(!c.hasOwnProperty(k)){
      c[k] = b[k];
    }
  }
  return c;
}

pliny.issue( "", {
  name: "document helpers/options",
  type: "open",
  description: "Finish writing the documentation for the [options](#options) class in the helpers/ directory"
} );
;/* global Primrose, THREE, pliny */

Primrose.Input.ButtonAndAxis = ( function () {

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.ButtonAndAxis](#Primrose_Input_ButtonAndAxis) class in the input/ directory."
  } );
  
  pliny.class( "Primrose.Input", {
    name: "ButtonAndAxis",
    description: "<under construction>",
    parameters: [
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""}
    ]
  } );
  function ButtonAndAxisInput ( name, commands, socket, axes ) {
    Primrose.NetworkedInput.call( this, name, commands, socket );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.inputState.axes",
      type: "open",
      description: ""
    } );
    this.inputState.axes = [ ];

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.inputState.buttons",
      type: "open",
      description: ""
    } );
    this.inputState.buttons = [ ];

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.axisNames",
      type: "open",
      description: ""
    } );
    this.axisNames = axes || [ ];

    for ( var i = 0; i < this.axisNames.length; ++i ) {
      this.inputState.axes[i] = 0;
    }

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.setDeadzone",
      type: "open",
      description: ""
    } );
    this.setDeadzone = this.setProperty.bind( this, "deadzone" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.setScale",
      type: "open",
      description: ""
    } );
    this.setScale = this.setProperty.bind( this, "scale" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.setDT",
      type: "open",
      description: ""
    } );
    this.setDT = this.setProperty.bind( this, "dt" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.setMin",
      type: "open",
      description: ""
    } );
    this.setMin = this.setProperty.bind( this, "min" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.setMax",
      type: "open",
      description: ""
    } );
    this.setMax = this.setProperty.bind( this, "max" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.addMetaKey",
      type: "open",
      description: ""
    } );
    this.addMetaKey = this.addToArray.bind( this, "metaKeys" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.addAxis",
      type: "open",
      description: ""
    } );
    this.addAxis = this.addToArray.bind( this, "axes" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.addButton",
      type: "open",
      description: ""
    } );
    this.addButton = this.addToArray.bind( this, "buttons" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.removeMetaKey",
      type: "open",
      description: ""
    } );
    this.removeMetaKey = this.removeFromArray.bind( this, "metaKeys" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.removeAxis",
      type: "open",
      description: ""
    } );
    this.removeAxis = this.removeFromArray.bind( this, "axes" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.removeButton",
      type: "open",
      description: ""
    } );
    this.removeButton = this.removeFromArray.bind( this, "buttons" );


    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.invertAxis",
      type: "open",
      description: ""
    } );
    this.invertAxis = this.invertInArray.bind( this, "axes" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.invertButton",
      type: "open",
      description: ""
    } );
    this.invertButton = this.invertInArray.bind( this, "buttons" );

    pliny.issue( "Primrose.Input.ButtonAndAxis", {
      name: "document ButtonAndAxis.invertMetaKey",
      type: "open",
      description: ""
    } );
    this.invertMetaKey = this.invertInArray.bind( this, "metaKeys" );
  }

  inherit( ButtonAndAxisInput, Primrose.NetworkedInput );

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.inherit",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.inherit = function ( classFunc ) {
    inherit( classFunc, ButtonAndAxisInput );
    if ( classFunc.AXES ) {
      classFunc.AXES.forEach( function ( name, i ) {
        classFunc[name] = i + 1;
        Object.defineProperty( classFunc.prototype, name, {
          get: function () {
            return this.getAxis( name );
          },
          set: function ( v ) {
            this.setAxis( name, v );
          }
        } );
      } );
    }
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.getAxis",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.getAxis = function ( name ) {
    var i = this.axisNames.indexOf( name );
    if ( i > -1 ) {
      var value = this.inputState.axes[i] || 0;
      return value;
    }
    return null;
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.setAxis",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.setAxis = function ( name, value ) {
    var i = this.axisNames.indexOf( name );
    if ( i > -1 ) {
      this.inPhysicalUse = true;
      this.inputState.axes[i] = value;
    }
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.setButton",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.setButton = function ( index, pressed ) {
    this.inPhysicalUse = true;
    this.inputState.buttons[index] = pressed;
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.getValue",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.getValue = function ( name ) {
    return ( ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        this.isEnabled( name ) &&
        this.commands[name].state.value ) ||
        this.getAxis( name ) || 0;
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.setValue",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.setValue = function ( name, value ) {
    var j = this.axisNames.indexOf( name );
    if ( !this.commands[name] && j > -1 ) {
      this.setAxis( name, value );
    }
    else if ( this.commands[name] && !this.commands[name].disabled ) {
      this.commands[name].state.value = value;
    }
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.getVector3",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.getVector3 = function ( x, y, z, value ) {
    value = value || new THREE.Vector3();
    value.set(
        this.getValue( x ),
        this.getValue( y ),
        this.getValue( z ) );
    return value;
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.addVector3",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.addVector3 = function ( x, y, z, value ) {
    value.x += this.getValue( x );
    value.y += this.getValue( y );
    value.z += this.getValue( z );
    return value;
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.isDown",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.isDown = function ( name ) {
    return ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        this.isEnabled( name ) &&
        this.commands[name].state.pressed;
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.isUp",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.isUp = function ( name ) {
    return ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        this.isEnabled( name ) &&
        this.commands[name].state.pressed;
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.maybeClone",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.maybeClone = function ( arr ) {
    var output = [ ];
    if ( arr ) {
      for ( var i = 0; i < arr.length; ++i ) {
        output[i] = {
          index: Math.abs( arr[i] ) - 1,
          toggle: arr[i] < 0,
          sign: ( arr[i] < 0 ) ? -1 : 1
        };
      }
    }
    return output;
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.cloneCommand",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.cloneCommand = function ( cmd ) {
    return {
      name: cmd.name,
      disabled: !!cmd.disabled,
      dt: cmd.dt || 0,
      deadzone: cmd.deadzone || 0,
      threshold: cmd.threshold || 0,
      repetitions: cmd.repetitions || 1,
      scale: cmd.scale,
      offset: cmd.offset,
      min: cmd.min,
      max: cmd.max,
      integrate: cmd.integrate || false,
      delta: cmd.delta || false,
      axes: this.maybeClone( cmd.axes ),
      commands: cmd.commands && cmd.commands.slice() || [ ],
      buttons: this.maybeClone( cmd.buttons ),
      metaKeys: this.maybeClone( cmd.metaKeys && cmd.metaKeys.map( function ( k ) {
        for ( var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i ) {
          var m = Primrose.Keys.MODIFIER_KEYS[i];
          if ( Math.abs( k ) === Primrose.Keys[m.toLocaleUpperCase()] ) {
            return Math.sign( k ) * ( i + 1 );
          }
        }
      }.bind( this ) ) ),
      commandDown: cmd.commandDown,
      commandUp: cmd.commandUp
    };
  };

  pliny.issue( "Primrose.Input.ButtonAndAxis", {
    name: "document ButtonAndAxis.evalCommand",
    type: "open",
    description: ""
  } );
  ButtonAndAxisInput.prototype.evalCommand = function ( cmd, metaKeysSet, dt ) {
    if ( metaKeysSet ) {
      var pressed = true,
          value = 0,
          n, v;

      if ( cmd.buttons ) {
        for ( n = 0; n < cmd.buttons.length; ++n ) {
          var b = cmd.buttons[n];
          var p = !!this.inputState.buttons[b.index + 1];
          v = p ? b.sign : 0;
          pressed = pressed && ( p && !b.toggle || !p && b.toggle );
          if ( Math.abs( v ) > Math.abs( value ) ) {
            value = v;
          }
        }
      }

      if ( cmd.axes ) {
        for ( n = 0; n < cmd.axes.length; ++n ) {
          var a = cmd.axes[n];
          v = a.sign * this.inputState.axes[a.index];
          if ( Math.abs( v ) > Math.abs( value ) ) {
            value = v;
          }
        }
      }

      for ( n = 0; n < cmd.commands.length; ++n ) {
        v = this.getValue( cmd.commands[n] );
        if ( Math.abs( v ) > Math.abs( value ) ) {
          value = v;
        }
      }

      if ( cmd.scale !== undefined ) {
        value *= cmd.scale;
      }

      if ( cmd.offset !== undefined ) {
        value += cmd.offset;
      }

      if ( cmd.deadzone && Math.abs( value ) < cmd.deadzone ) {
        value = 0;
      }

      if ( cmd.integrate ) {
        value = this.getValue( cmd.name ) + value * dt;
      }
      else if ( cmd.delta ) {
        var ov = value;
        if ( cmd.state.lv !== undefined ) {
          value = ( value - cmd.state.lv ) / dt;
        }
        cmd.state.lv = ov;
      }

      if ( cmd.min !== undefined ) {
        value = Math.max( cmd.min, value );
      }

      if ( cmd.max !== undefined ) {
        value = Math.min( cmd.max, value );
      }

      if ( cmd.threshold ) {
        pressed = pressed && ( value > cmd.threshold );
      }

      cmd.state.pressed = pressed;
      cmd.state.value = value;
    }
  };

  return ButtonAndAxisInput;
} )();
;/* global Primrose, MediaStreamTrack, THREE, Navigator, pliny */

Primrose.Input.Camera = ( function () {

  /* polyfill */
  Navigator.prototype.getUserMedia =
      Navigator.prototype.getUserMedia ||
      Navigator.prototype.webkitGetUserMedia ||
      Navigator.prototype.mozGetUserMedia ||
      Navigator.prototype.msGetUserMedia ||
      Navigator.prototype.oGetUserMedia ||
      function () {
      };

  pliny.issue( "Primrose.Input.Camera", {
    name: "document Camera",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.Camera](#Primrose_Input_Camera) class in the input/ directory"
  } );
  
  pliny.class("Primrose.Input", {
    name: "Camera",
    description: "<under construction>"
  });
  function CameraInput ( elem, id, size, x, y, z, options ) {
    MediaStreamTrack.getSources( function ( infos ) {
      var option = document.createElement( "option" );
      option.value = "";
      option.innerHTML = "-- select camera --";
      elem.appendChild( option );
      for ( var i = 0; i < infos.length; ++i ) {
        if ( infos[i].kind === "video" ) {
          option = document.createElement( "option" );
          option.value = infos[i].id;
          option.innerHTML = fmt( "[Facing: $1] [ID: $2...]",
              infos[i].facing ||
              "N/A", infos[i].id.substring( 0, 8 ) );
          option.selected = infos[i].id === id;
          elem.appendChild( option );
        }
      }
    } );

    pliny.issue( "Primrose.Input.Camera", {
      name: "document Camera.options",
      type: "open",
      description: ""
    } );
    this.options = combineDefaults( options, CameraInput );

    pliny.issue( "Primrose.Input.Camera", {
      name: "document Camera.videoElement",
      type: "open",
      description: ""
    } );
    this.videoElement = document.createElement( "video" );

    pliny.issue( "Primrose.Input.Camera", {
      name: "document Camera.buffer",
      type: "open",
      description: ""
    } );
    this.buffer = document.createElement( "canvas" );

    pliny.issue( "Primrose.Input.Camera", {
      name: "document Camera.gfx",
      type: "open",
      description: ""
    } );
    this.gfx = this.buffer.getContext( "2d" );

    pliny.issue( "Primrose.Input.Camera", {
      name: "document Camera.texture",
      type: "open",
      description: ""
    } );
    this.texture = new THREE.Texture( this.buffer );
    var material = new THREE.MeshBasicMaterial( {
      map: this.texture,
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: THREE.FlatShading
    } );

    this.gfx.width = 500;
    this.gfx.height = 500;
    this.gfx.fillStyle = "white";
    this.gfx.fillRect( 0, 0, 500, 500 );

    var geometry = new THREE.PlaneGeometry( size, size );
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    pliny.issue( "Primrose.Input.Camera", {
      name: "document Camera.mesh",
      type: "open",
      description: ""
    } );
    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.set( x, y, z );

    pliny.issue( "Primrose.Input.Camera", {
      name: "document Camera.streaming",
      type: "open",
      description: ""
    } );
    this.streaming = false;
    this.videoElement.autoplay = 1;
    var getUserMediaFallthrough = function ( vidOpt, success, err ) {
      navigator.getUserMedia( {video: vidOpt}, function ( stream ) {
        streamURL = window.URL.createObjectURL( stream );
        this.videoElement.src = streamURL;
        success();
      }.bind( this ), err );
    }.bind( this );

    var tryModesFirstThen = function ( source, err, i ) {
      i = i || 0;
      if ( this.options.videoModes && i < this.options.videoModes.length ) {
        var mode = this.options.videoModes[i];
        var opt = {optional: [ {sourceId: source} ]};
        if ( mode !== "default" ) {
          opt.mandatory = {
            minWidth: mode.w,
            minHeight: mode.h
          };
          mode = fmt( "[w:$1, h:$2]", mode.w, mode.h );
        }
        getUserMediaFallthrough( opt, function () {
          console.log( fmt( "Connected to camera at mode $1.", mode ) );
        }, function ( err ) {
          console.error( fmt( "Failed to connect at mode $1. Reason: $2", mode,
              err ) );
          tryModesFirstThen( source, err, i + 1 );
        } );
      }
      else {
        err( "no video modes specified." );
      }
    }.bind( this );

    this.videoElement.addEventListener( "canplay", function () {
      if ( !this.streaming ) {
        this.streaming = true;
      }
    }.bind( this ), false );

    this.videoElement.addEventListener( "playing", function () {
      this.videoElement.height = this.buffer.height = this.videoElement.videoHeight;
      this.videoElement.width = this.buffer.width = this.videoElement.videoWidth;
      var aspectRatio = this.videoElement.videoWidth /
          this.videoElement.videoHeight;
      this.mesh.scale.set( aspectRatio, 1, 1 );
    }.bind( this ), false );

    pliny.issue( "Primrose.Input.Camera", {
      name: "document Camera.connect",
      type: "open",
      description: ""
    } );
    this.connect = function ( source ) {
      if ( this.streaming ) {
        try {
          if ( window.stream ) {
            window.stream.stop();
          }
          this.videoElement.src = null;
          this.streaming = false;
        }
        catch ( err ) {
          console.error( "While stopping", err );
        }
      }

      tryModesFirstThen( source, function ( err ) {
        console.error( fmt(
            "Couldn't connect at requested resolutions. Reason: $1", err ) );
        getUserMediaFallthrough( true,
            console.log.bind( console,
                "Connected to camera at default resolution" ),
            console.error.bind( console, "Final connect attempt" ) );
      } );
    }.bind( this );

    if ( id ) {
      this.connect( id );
    }
  }

  pliny.issue( "Primrose.Input.Camera", {
    name: "document Camera.DEFAULTS",
    type: "open",
    description: ""
  } );
  CameraInput.DEFAULTS = {
    videoModes: [
      {w: 320, h: 240},
      {w: 640, h: 480},
      "default"
    ]
  };

  pliny.issue( "Primrose.Input.Camera", {
    name: "document Camera.update",
    type: "open",
    description: ""
  } );
  CameraInput.prototype.update = function () {
    this.gfx.drawImage( this.videoElement, 0, 0 );
    this.texture.needsUpdate = true;
  };
  return CameraInput;
} )();
;/* global Primrose, THREE, emit, isMobile, pliny */

Primrose.Input.FPSInput = ( function ( ) {
  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.FPSInput](#Primrose_Input_FPSInput) class in the input/ directory"
  } );
  
  pliny.class("Primrose.Input", {
    name: "FPSInput",
    description: "<under construction>"
  });
  function FPSInput ( DOMElement, near, far ) {
    DOMElement = DOMElement || window;

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.listeners",
      type: "open",
      description: ""
    } );
    this.listeners = {
      jump: [ ],
      zero: [ ]
    };

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.managers",
      type: "open",
      description: ""
    } );
    this.managers = [
      // keyboard should always run on the window
      new Primrose.Input.Keyboard( "keyboard", window, {
        strafeLeft: {
          buttons: [
            -Primrose.Keys.A,
            -Primrose.Keys.LEFTARROW ]},
        strafeRight: {
          buttons: [
            Primrose.Keys.D,
            Primrose.Keys.RIGHTARROW ]},
        strafe: {commands: [ "strafeLeft", "strafeRight" ]},
        driveForward: {
          buttons: [
            -Primrose.Keys.W,
            -Primrose.Keys.UPARROW ]},
        driveBack: {
          buttons: [
            Primrose.Keys.S,
            Primrose.Keys.DOWNARROW ]},
        drive: {commands: [ "driveForward", "driveBack" ]},
        select: {buttons: [ Primrose.Keys.ENTER ]},
        dSelect: {buttons: [ Primrose.Keys.ENTER ], delta: true},
        jump: {
          buttons: [ Primrose.Keys.SPACE ],
          metaKeys: [ -Primrose.Keys.SHIFT ],
          commandDown: emit.bind( this, "jump" ), dt: 0.5
        },
        zero: {
          buttons: [ Primrose.Keys.Z ],
          metaKeys: [
            -Primrose.Keys.CTRL,
            -Primrose.Keys.ALT,
            -Primrose.Keys.SHIFT,
            -Primrose.Keys.META
          ],
          commandUp: emit.bind( this, "zero" )
        }
      } ),
      new Primrose.Input.Mouse( "mouse", DOMElement, {
        buttons: {axes: [ Primrose.Input.Mouse.BUTTONS ]},
        dButtons: {axes: [ Primrose.Input.Mouse.BUTTONS ], delta: true},
        dx: {axes: [ -Primrose.Input.Mouse.X ], delta: true, scale: 0.005, min: -5, max: 5},
        heading: {commands: [ "dx" ], integrate: true},
        dy: {axes: [ -Primrose.Input.Mouse.Y ], delta: true, scale: 0.005, min: -5, max: 5},
        pitch: {commands: [ "dy" ], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5},
        pointerPitch: {commands: [ "dy" ], integrate: true, min: -Math.PI * 0.25, max: Math.PI * 0.25}
      } ),
      new Primrose.Input.Touch( "touch", DOMElement, {
        buttons: {axes: [ Primrose.Input.Touch.FINGERS ]},
        dButtons: {axes: [ Primrose.Input.Touch.FINGERS ], delta: true}
      } ),
      new Primrose.Input.Gamepad( "gamepad", {
        strafe: {axes: [ Primrose.Input.Gamepad.LSX ]},
        drive: {axes: [ Primrose.Input.Gamepad.LSY ]},
        heading: {axes: [ -Primrose.Input.Gamepad.RSX ], integrate: true},
        dheading: {commands: [ "heading" ], delta: true},
        pitch: {axes: [ Primrose.Input.Gamepad.RSY ], integrate: true}
      } ) ];
    
    if ( isVR ) {
      this.managers.push( new Primrose.Input.VR( "vr", near, far ) );
    }
    else if ( isMobile ) {
      this.managers.push(
          new Primrose.Input.Motion( "motion", {
            headVX: {axes: [ Primrose.Input.Motion.headAX ], integrate: true},
            headVY: {axes: [ Primrose.Input.Motion.headAY ], integrate: true},
            headVZ: {axes: [ Primrose.Input.Motion.headAZ ], integrate: true},
            headX: {commands: [ Primrose.Input.Motion.headVX ], integrate: true},
            headY: {commands: [ Primrose.Input.Motion.headVY ], integrate: true},
            headZ: {commands: [ Primrose.Input.Motion.headVZ ], integrate: true}
          } ) );
    }

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.keyboard",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.mouse",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.touch",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.gamepad",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.vr",
      type: "open",
      description: ""
    } );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.motion",
      type: "open",
      description: ""
    } );

    this.managers.reduce( function ( inst, mgr ) {
      inst[mgr.name] = mgr;
      return inst;
    }, this );

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.connectGamepad",
      type: "open",
      description: ""
    } );
    this.connectGamepad = function ( id ) {
      if ( !this.gamepad.isGamepadSet( ) && confirm( fmt(
          "Would you like to use this gamepad? \"$1\"", id ) ) ) {
        this.gamepad.setGamepad( id );
      }
    };
    this.gamepad.addEventListener( "gamepadconnected", this.connectGamepad.bind( this ), false );
  }

  var SETTINGS_TO_ZERO = [ "heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ" ];

  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput.zero",
    type: "open",
    description: ""
  } );
  FPSInput.prototype.zero = function () {
    if ( this.vr && this.vr.currentDisplay) {
      this.vr.currentDisplay.resetPose( );
    }
    if ( this.motion ) {
      this.motion.zeroAxes();
    }
    for ( var i = 0; i < this.managers.length; ++i ) {
      var mgr = this.managers[i];
      for ( var j = 0; mgr.enabled && j < SETTINGS_TO_ZERO.length; ++j ) {
        mgr.setValue( SETTINGS_TO_ZERO[j], 0 );
      }
    }
  };

  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput.update",
    type: "open",
    description: ""
  } );
  FPSInput.prototype.update = function ( dt ) {
    for ( var i = 0; i < this.managers.length; ++i ) {
      var mgr = this.managers[i];
      if ( mgr.enabled ) {
        mgr.update( dt );
      }
    }
  };

  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput.addEventListener",
    type: "open",
    description: ""
  } );
  FPSInput.prototype.addEventListener = function ( evt, thunk, bubbles ) {
    if ( this.listeners[evt] ) {
      this.listeners[evt].push( thunk );
    }
    else {
      this.managers.forEach( function ( mgr ) {
        if ( mgr.addEventListener ) {
          mgr.addEventListener( evt, thunk, bubbles );
        }
      } );
    }
  };

  pliny.issue( "Primrose.Input.FPSInput", {
    name: "document FPSInput.getValue",
    type: "open",
    description: ""
  } );
  FPSInput.prototype.getValue = function ( name ) {
    var value = 0;
    for ( var i = 0; i < this.managers.length; ++i ) {
      var mgr = this.managers[i];
      if ( mgr.enabled ) {
        value += mgr.getValue( name );
      }
    }
    return value;
  };

  if ( window.THREE ) {
    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.getVector3",
      type: "open",
      description: ""
    } );
    FPSInput.prototype.getVector3 = function ( x, y, z, value ) {
      value = value || new THREE.Vector3( );
      value.set( 0, 0, 0 );
      for ( var i = 0; i < this.managers.length; ++i ) {
        var mgr = this.managers[i];
        if ( mgr.enabled ) {
          mgr.addVector3( x, y, z, value );
        }
      }
      return value;
    };

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.getVector3s",
      type: "open",
      description: ""
    } );
    FPSInput.prototype.getVector3s = function ( x, y, z, values ) {
      values = values || [ ];
      for ( var i = 0; i < this.managers.length; ++i ) {
        var mgr = this.managers[i];
        if ( mgr.enabled ) {
          values[i] = mgr.getVector3( x, y, z, values[i] );
        }
      }
      return values;
    };

    var temp = new THREE.Quaternion( );
    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.getQuaternion",
      type: "open",
      description: ""
    } );
    FPSInput.prototype.getQuaternion = function ( x, y, z, w, value, accumulate ) {
      value = value || new THREE.Quaternion( );
      value.set( 0, 0, 0, 1 );
      for ( var i = 0; i < this.managers.length; ++i ) {
        var mgr = this.managers[i];
        if ( mgr.enabled && mgr.getQuaternion ) {
          mgr.getQuaternion( x, y, z, w, temp );
          value.multiply( temp );
          if ( !accumulate ) {
            break;
          }
        }
      }
      return value;
    };

    pliny.issue( "Primrose.Input.FPSInput", {
      name: "document FPSInput.transforms",
      type: "open",
      description: ""
    } );
    Object.defineProperties( FPSInput.prototype, {
      transforms: {
        get: function () {
          if ( this.vr && this.vr.transforms ) {
            return this.vr.transforms;
          }
          else {
            return Primrose.Input.Motion.DEFAULT_TRANSFORMS;
          }
        }
      }
    } );

    return FPSInput;
  }
} )( );;/* global Primrose, pliny */

Primrose.Input.Gamepad = ( function () {


  pliny.issue( "Primrose.Input.Gamepad", {
    name: "document Gamepad",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.Gamepad](#Primrose_Input_Gamepad) class in the input/ directory"
  } );
  
  pliny.class( "Primrose.Input", {
    name: "Gamepad",
    description: "<under construction>",
    parameters: [
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""}
    ]
  } );
  function GamepadInput ( name, commands, socket, gpid ) {
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, GamepadInput.AXES, true );
    var connectedGamepads = [ ],
        listeners = {
          gamepadconnected: [ ],
          gamepaddisconnected: [ ]
        };


    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.superUpdate",
      type: "open",
      description: ""
    } );
    this.superUpdate = this.update;

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.checkDevice",
      type: "open",
      description: ""
    } );
    this.checkDevice = function ( pad ) {
      var i;
      for ( i = 0; i < pad.buttons.length; ++i ) {
        this.setButton( i, pad.buttons[i].pressed );
      }
      for ( i = 0; i < pad.axes.length; ++i ) {
        this.setAxis( GamepadInput.AXES[i], pad.axes[i] );
      }
    };

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.update",
      type: "open",
      description: ""
    } );
    this.update = function ( dt ) {
      var pads,
          currentPads = [ ],
          i;

      if ( navigator.getGamepads ) {
        pads = navigator.getGamepads();
      }
      else if ( navigator.webkitGetGamepads ) {
        pads = navigator.webkitGetGamepads();
      }

      if ( pads ) {
        for ( i = 0; i < pads.length; ++i ) {
          var pad = pads[i];
          if ( pad ) {
            if ( connectedGamepads.indexOf( pad.id ) === -1 ) {
              connectedGamepads.push( pad.id );
              onConnected( pad.id );
            }
            if ( pad.id === gpid ) {
              this.checkDevice( pad );
            }
            currentPads.push( pad.id );
          }
        }
      }

      for ( i = connectedGamepads.length - 1; i >= 0; --i ) {
        if ( currentPads.indexOf( connectedGamepads[i] ) === -1 ) {
          onDisconnected( connectedGamepads[i] );
          connectedGamepads.splice( i, 1 );
        }
      }

      this.superUpdate( dt );
    };

    function add ( arr, val ) {
      if ( arr.indexOf( val ) === -1 ) {
        arr.push( val );
      }
    }

    function remove ( arr, val ) {
      var index = arr.indexOf( val );
      if ( index > -1 ) {
        arr.splice( index, 1 );
      }
    }

    function sendAll ( arr, id ) {
      for ( var i = 0; i < arr.length; ++i ) {
        arr[i]( id );
      }
    }

    function onConnected ( id ) {
      sendAll( listeners.gamepadconnected, id );
    }

    function onDisconnected ( id ) {
      sendAll( listeners.gamepaddisconnected, id );
    }

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.getErrorMessage",
      type: "open",
      description: ""
    } );
    this.getErrorMessage = function () {
      return errorMessage;
    };

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.setGamepad",
      type: "open",
      description: ""
    } );
    this.setGamepad = function ( id ) {
      gpid = id;
      this.inPhysicalUse = true;
    };

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.clearGamepad",
      type: "open",
      description: ""
    } );
    this.clearGamepad = function () {
      gpid = null;
      this.inPhysicalUse = false;
    };

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.isGamepadSet",
      type: "open",
      description: ""
    } );
    this.isGamepadSet = function () {
      return !!gpid;
    };

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.getConnectedGamepads",
      type: "open",
      description: ""
    } );
    this.getConnectedGamepads = function () {
      return connectedGamepads.slice();
    };

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.addEventListener",
      type: "open",
      description: ""
    } );
    this.addEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        listeners[event].push( handler );
      }
      if ( event === "gamepadconnected" ) {
        connectedGamepads.forEach( onConnected );
      }
    };

    pliny.issue( "Primrose.Input.Gamepad", {
      name: "document Gamepad.removeEventListener",
      type: "open",
      description: ""
    } );
    this.removeEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        remove( listeners[event], handler );
      }
    };

    try {
      this.update( 0 );
      available = true;
    }
    catch ( err ) {
      avaliable = false;
      errorMessage = err;
    }
  }

  pliny.issue( "Primrose.Input.Gamepad", {
    name: "document Gamepad.AXES",
    type: "open",
    description: ""
  } );
  GamepadInput.AXES = [ "LSX", "LSY", "RSX", "RSY" ];
  Primrose.Input.ButtonAndAxis.inherit( GamepadInput );
  return GamepadInput;
} )();

Primrose.Input.Gamepad.XBOX_BUTTONS = pliny.enumeration( "Primrose.Input.Gamepad", {
  name: "XBOX_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller.",
  value: {
    A: 1,
    B: 2,
    X: 3,
    Y: 4,
    leftBumper: 5,
    rightBumper: 6,
    leftTrigger: 7,
    rightTrigger: 8,
    back: 9,
    start: 10,
    leftStick: 11,
    rightStick: 12,
    up: 13,
    down: 14,
    left: 15,
    right: 16
  }
} );;/* global Primrose, pliny */

Primrose.Input.Keyboard = ( function () {

  pliny.issue( "Primrose.Input.Keyboard", {
    name: "document Keyboard",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.Keyboard](#Primrose_Input_Keyboard) class in the input/ directory"
  } );
  
  pliny.class( "Primrose.Input", {
    name: "Keyboard",
    baseClass: "Primrose.Input.ButtonAndAxis",
    description: "<under construction>",
    parameters: [
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""}
    ]
  } );
  function KeyboardInput ( name, DOMElement, commands, socket ) {
    DOMElement = DOMElement || window;

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket );

    function execute ( stateChange, event ) {
      this.setButton( event.keyCode, stateChange );
    }

    DOMElement.addEventListener( "keydown", execute.bind( this, true ), false );
    DOMElement.addEventListener( "keyup", execute.bind( this, false ), false );
  }

  Primrose.Input.ButtonAndAxis.inherit( KeyboardInput );
  return KeyboardInput;
} )();
;/* global Primrose, requestAnimationFrame, Leap, LeapMotionInput, pliny */

Primrose.Input.LeapMotion = ( function () {
  function processFingerParts ( i ) {
    return LeapMotionInput.FINGER_PARTS.map( function ( p ) {
      return "FINGER" + i + p.toUpperCase();
    } );
  }


  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.LeapMotion](#Primrose_Input_LeapMotion) class in the input/ directory"
  } );
  
  pliny.class("Primrose.Input", {
    name: "LeapMotionInput",
    description: "<under construction>"
  });
  function LeapMotionInput ( name, commands, socket ) {

    pliny.issue( "Primrose.Input.LeapMotion", {
      name: "document LeapMotion.isStreaming",
      type: "open",
      description: ""
    } );
    this.isStreaming = false;

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, LeapMotionInput.AXES );

    pliny.issue( "Primrose.Input.LeapMotion", {
      name: "document LeapMotion.controller",
      type: "open",
      description: ""
    } );
    this.controller = new Leap.Controller( {enableGestures: true} );
  }

  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.COMPONENTS",
    type: "open",
    description: ""
  } );
  LeapMotionInput.COMPONENTS = [ "X", "Y", "Z" ];
  
  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.NUM_HANDS",
    type: "open",
    description: ""
  } );
  LeapMotionInput.NUM_HANDS = 2;
  
  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.NUM_FINGERS",
    type: "open",
    description: ""
  } );
  LeapMotionInput.NUM_FINGERS = 10;
  
  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.FINGER_PARTS",
    type: "open",
    description: ""
  } );
  LeapMotionInput.FINGER_PARTS = [ "tip", "dip", "pip", "mcp", "carp" ];
  
  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.AXES",
    type: "open",
    description: ""
  } );
  LeapMotionInput.AXES = [ "X0", "Y0", "Z0",
    "X1", "Y1", "Z1",
    "FINGER0TIPX", "FINGER0TIPY",
    "FINGER0DIPX", "FINGER0DIPY",
    "FINGER0PIPX", "FINGER0PIPY",
    "FINGER0MCPX", "FINGER0MCPY",
    "FINGER0CARPX", "FINGER0CARPY",
    "FINGER1TIPX", "FINGER1TIPY",
    "FINGER1DIPX", "FINGER1DIPY",
    "FINGER1PIPX", "FINGER1PIPY",
    "FINGER1MCPX", "FINGER1MCPY",
    "FINGER1CARPX", "FINGER1CARPY",
    "FINGER2TIPX", "FINGER2TIPY",
    "FINGER2DIPX", "FINGER2DIPY",
    "FINGER2PIPX", "FINGER2PIPY",
    "FINGER2MCPX", "FINGER2MCPY",
    "FINGER2CARPX", "FINGER2CARPY",
    "FINGER3TIPX", "FINGER3TIPY",
    "FINGER3DIPX", "FINGER3DIPY",
    "FINGER3PIPX", "FINGER3PIPY",
    "FINGER3MCPX", "FINGER3MCPY",
    "FINGER3CARPX", "FINGER3CARPY",
    "FINGER4TIPX", "FINGER4TIPY",
    "FINGER4DIPX", "FINGER4DIPY",
    "FINGER4PIPX", "FINGER4PIPY",
    "FINGER4MCPX", "FINGER4MCPY",
    "FINGER4CARPX", "FINGER4CARPY",
    "FINGER5TIPX", "FINGER5TIPY",
    "FINGER5DIPX", "FINGER5DIPY",
    "FINGER5PIPX", "FINGER5PIPY",
    "FINGER5MCPX", "FINGER5MCPY",
    "FINGER5CARPX", "FINGER5CARPY",
    "FINGER6TIPX", "FINGER6TIPY",
    "FINGER6DIPX", "FINGER6DIPY",
    "FINGER6PIPX", "FINGER6PIPY",
    "FINGER6MCPX", "FINGER6MCPY",
    "FINGER6CARPX", "FINGER6CARPY",
    "FINGER7TIPX", "FINGER7TIPY",
    "FINGER7DIPX", "FINGER7DIPY",
    "FINGER7PIPX", "FINGER7PIPY",
    "FINGER7MCPX", "FINGER7MCPY",
    "FINGER7CARPX", "FINGER7CARPY",
    "FINGER8TIPX", "FINGER8TIPY",
    "FINGER8DIPX", "FINGER8DIPY",
    "FINGER8PIPX", "FINGER8PIPY",
    "FINGER8MCPX", "FINGER8MCPY",
    "FINGER8CARPX", "FINGER8CARPY",
    "FINGER9TIPX", "FINGER9TIPY",
    "FINGER9DIPX", "FINGER9DIPY",
    "FINGER9PIPX", "FINGER9PIPY",
    "FINGER9MCPX", "FINGER9MCPY",
    "FINGER9CARPX", "FINGER9CARPY" ];

  Primrose.Input.ButtonAndAxis.inherit( LeapMotionInput );

  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.CONNECTION_TIMEOUT",
    type: "open",
    description: ""
  } );
  LeapMotionInput.CONNECTION_TIMEOUT = 5000;
  
  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.E",
    type: "open",
    description: ""
  } );
  LeapMotionInput.prototype.E = function ( e, f ) {
    if ( f ) {
      this.controller.on( e, f );
    }
    else {
      this.controller.on( e, console.log.bind( console,
          "Leap Motion Event: " + e ) );
    }
  };

  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.start",
    type: "open",
    description: ""
  } );
  LeapMotionInput.prototype.start = function ( gameUpdateLoop ) {
    if ( this.isEnabled() ) {
      var canceller = null,
          startAlternate = null;
      if ( gameUpdateLoop ) {
        var alternateLooper = function ( t ) {
          requestAnimationFrame( alternateLooper );
          gameUpdateLoop( t );
        };
        startAlternate = requestAnimationFrame.bind( window,
            alternateLooper );
        var timeout = setTimeout( startAlternate,
            LeapMotionInput.CONNECTION_TIMEOUT );
        canceller = function () {
          clearTimeout( timeout );
          this.isStreaming = true;
        }.bind( this );
        this.E( "deviceStreaming", canceller );
        this.E( "streamingStarted", canceller );
        this.E( "streamingStopped", startAlternate );
      }
      this.E( "connect" );
      //this.E("protocol");
      this.E( "deviceStopped" );
      this.E( "disconnect" );
      this.E( "frame", this.setState.bind( this, gameUpdateLoop ) );
      this.controller.connect();
    }
  };

  pliny.issue( "Primrose.Input.LeapMotion", {
    name: "document LeapMotion.setState",
    type: "open",
    description: ""
  } );
  LeapMotionInput.prototype.setState = function ( gameUpdateLoop, frame ) {
    var prevFrame = this.controller.history.get( 1 ),
        i,
        j;
    if ( !prevFrame || frame.hands.length !== prevFrame.hands.length ) {
      for ( i = 0; i < this.commands.length; ++i ) {
        this.enable( this.commands[i].name, frame.hands.length > 0 );
      }
    }

    for ( i = 0; i < frame.hands.length; ++i ) {
      var hand = frame.hands[i].palmPosition;
      var handName = "HAND" + i;
      for ( j = 0; j < LeapMotionInput.COMPONENTS.length; ++j ) {
        this.setAxis( handName + LeapMotionInput.COMPONENTS[j], hand[j] );
      }
    }

    for ( i = 0; i < frame.fingers.length; ++i ) {
      var finger = frame.fingers[i];
      var fingerName = "FINGER" + i;
      for ( j = 0; j < LeapMotionInput.FINGER_PARTS.length; ++j ) {
        var joint = finger[LeapMotionInput.FINGER_PARTS[j] + "Position"];
        var jointName = fingerName +
            LeapMotionInput.FINGER_PARTS[j].toUpperCase();
        for ( var k = 0; k < LeapMotionInput.COMPONENTS.length; ++k ) {
          this.setAxis( jointName + LeapMotionInput.COMPONENTS[k],
              joint[k] );
        }
      }
    }

    if ( gameUpdateLoop ) {
      gameUpdateLoop( frame.timestamp * 0.001 );
    }
  };
  return LeapMotionInput;
} )();
;/* global Primrose, pliny */

Primrose.Input.Location = ( function () {

  pliny.issue( "Primrose.Input.Location", {
    name: "document Location",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.Location](#Primrose_Input_Location) class in the input/ directory"
  } );
  
  pliny.class("Primrose.Input", {
    name: "Location",
    description: "<under construction>"
  });
  function LocationInput ( name, commands, socket, options ) {

    pliny.issue( "Primrose.Input.Location", {
      name: "document Location.options",
      type: "open",
      description: ""
    } );
    this.options = combineDefaults( options, LocationInput );
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, LocationInput.AXES );

    pliny.issue( "Primrose.Input.Location", {
      name: "document Location.available",
      type: "open",
      description: ""
    } );
    this.available = !!navigator.geolocation;
    if ( this.available ) {
      navigator.geolocation.watchPosition(
          this.setState.bind( this ),
          function () {
            this.available = false;
          }.bind( this ),
          this.options );
    }
  }

  pliny.issue( "Primrose.Input.Location", {
    name: "document Location.AXES",
    type: "open",
    description: ""
  } );
  LocationInput.AXES = [ "LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED" ];
  Primrose.Input.ButtonAndAxis.inherit( LocationInput );

  pliny.issue( "Primrose.Input.Location", {
    name: "document Location.DEFAULTS",
    type: "open",
    description: ""
  } );
  LocationInput.DEFAULTS = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 25000
  };

  pliny.issue( "Primrose.Input.Location", {
    name: "document Location.setState",
    type: "open",
    description: ""
  } );
  LocationInput.prototype.setState = function ( location ) {
    for ( var p in location.coords ) {
      var k = p.toUpperCase();
      if ( LocationInput.AXES.indexOf( k ) > -1 ) {
        this.setAxis( k, location.coords[p] );
      }
    }
  };
  return LocationInput;
} )();;/* global Primrose, THREE, isWebKit, isiOS, devicePixelRatio, pliny */

Primrose.Input.Motion = ( function ( ) {
  ////
  // Class: MotionCorrector
  // 
  // The MotionCorrector class observes orientation and gravitational acceleration values
  // and determines a corrected set of orientation values that reset the orientation
  // origin to 0 degrees north, 0 degrees above the horizon, with 0 degrees of tilt
  // in the landscape orientation. This is useful for head-mounted displays (HMD).
  // 
  // Constructor: new MotionCorrector( );
  // 
  // Properties:
  // degrees: get/set the current value of the angle in degrees.
  // radians: get/set the current value of the angle in radians.
  ///
  function MotionCorrector ( ) {
    var acceleration,
        orientation,
        deltaAlpha,
        signAlpha,
        heading,
        deltaGamma,
        signGamma,
        pitch,
        deltaBeta,
        signBeta,
        roll,
        omx,
        omy,
        omz,
        osx,
        osy,
        osz,
        isPrimary,
        isAboveHorizon,
        dAccel = {x: 0, y: 0, z: 0},
    dOrient = {alpha: 0, beta: 0, gamma: 0};
    signAlpha = -1;
    function wrap ( v ) {
      while ( v < 0 ) {
        v += 360;
      }
      while ( v >= 360 ) {
        v -= 360;
      }
      return v;
    }

    function calculate ( ) {
      if ( acceleration && orientation ) {
        omx = Math.abs( acceleration.x );
        omy = Math.abs( acceleration.y );
        omz = Math.abs( acceleration.z );
        osx = ( omx > 0 ) ? acceleration.x / omx : 1;
        osy = ( omy > 0 ) ? acceleration.y / omy : 1;
        osz = ( omz > 0 ) ? acceleration.z / omz : 1;
        if ( omx > omy && omx > omz && omx > 4.5 ) {
          isPrimary = osx === -1;
        }
        else if ( omy > omz && omy > omx && omy > 4.5 ) {
          isPrimary = osy === 1;
        }

        isAboveHorizon = isWebKit ?
            ( isPrimary ?
                orientation.gamma > 0 :
                orientation.gamma < 0 ) :
            osz === 1;
        deltaAlpha = ( isWebKit && ( isAboveHorizon ^ !isPrimary ) || !isWebKit && isPrimary ) ? 270 : 90;
        if ( isPrimary ) {
          if ( isAboveHorizon ) {
            if ( isiOS ) {
              deltaGamma = 90;
            }
            else {
              deltaGamma = -90;
            }
            signGamma = 1;
            signBeta = -1;
            deltaBeta = 0;
          }
          else {
            if ( isWebKit ) {
              signGamma = 1;
            }
            else {
              signGamma = -1;
            }
            if ( isiOS ) {
              deltaGamma = -90;
            }
            else {
              deltaGamma = 90;
            }
            signBeta = 1;
            deltaBeta = 180;
          }
        }
        else {
          if ( isAboveHorizon ) {
            if ( isiOS ) {
              deltaGamma = 90;
            }
            else {
              deltaGamma = -90;
            }
            signGamma = -1;
            signBeta = 1;
            deltaBeta = 0;
          }
          else {
            if ( isWebKit ) {
              signGamma = -1;
            }
            else {
              signGamma = 1;
            }
            if ( isiOS ) {
              deltaGamma = -90;
            }
            else {
              deltaGamma = 90;
            }
            signBeta = -1;
            deltaBeta = 180;
          }
        }

        heading = wrap( signAlpha * orientation.alpha + deltaAlpha - dOrient.alpha );
        pitch = wrap( signGamma * orientation.gamma + deltaGamma - dOrient.gamma ) - 360;
        if ( pitch < -180 ) {
          pitch += 360;
        }
        roll = wrap( signBeta * orientation.beta + deltaBeta - dOrient.beta );
        if ( roll > 180 ) {
          roll -= 360;
        }
      }
    }

    Object.defineProperties( this, {
      acceleration: {
        set: function ( v ) {
          acceleration = v;
          calculate( );
        },
        get: function ( ) {
          return acceleration;
        }
      },
      orientation: {
        set: function ( v ) {
          orientation = v;
          calculate( );
        },
        get: function ( ) {
          return orientation;
        }
      },
      heading: {
        get: function ( ) {
          return heading;
        }
      },
      pitch: {
        get: function ( ) {
          return pitch;
        }
      },
      roll: {
        get: function ( ) {
          return roll;
        }
      }
    } );

    this.zeroAxes = function ( ) {
      if ( acceleration ) {
        dAccel.x = acceleration.x;
        dAccel.y = acceleration.y;
        dAccel.z = acceleration.z;
      }
      if ( orientation ) {
        dOrient.alpha = orientation.alpha;
        dOrient.beta = orientation.beta;
        dOrient.gamma = orientation.gamma;
      }
    };
    /*
     Add an event listener for motion/orientation events.
     
     Parameters:
     type: There is only one type of event, called "deviceorientation". Any other value for type will result
     in an error. It is included to maintain interface compatability with the regular DOM event handler
     syntax, and the standard device orientation events.
     
     callback: the function to call when an event occures
     
     [bubbles]: set to true if the events should be captured in the bubbling phase. Defaults to false. The
     non-default behavior is rarely needed, but it is included for completeness.
     */
    this.addEventListener = function ( type, callback, bubbles ) {
      if ( type !== "deviceorientation" ) {
        throw new Error(
            "The only event type that is supported is \"deviceorientation\". Type parameter was: " +
            type );
      }
      if ( typeof ( callback ) !== "function" ) {
        throw new Error(
            "A function must be provided as a callback parameter. Callback parameter was: " +
            callback );
      }

      var headingAngle = null, pitchAngle = null, rollAngle = null;
      this.onChange = function ( ) {
        var a = this.acceleration;
        if ( this.orientation && a ) {
          if ( headingAngle !== null ) {
            headingAngle.degrees = -this.heading;
            pitchAngle.degrees = this.pitch;
            rollAngle.degrees = this.roll;
          }
          else {
            headingAngle = new Primrose.Angle( -this.heading );
            pitchAngle = new Primrose.Angle( this.pitch );
            rollAngle = new Primrose.Angle( this.roll );
          }
          callback( {
            HEADING: headingAngle.radians,
            PITCH: pitchAngle.radians,
            ROLL: rollAngle.radians,
            headAX: a.y - dAccel.y,
            headAY: a.x - dAccel.x,
            headAZ: a.z - dAccel.z
          } );
        }
      };

      this.checkOrientation = function ( event ) {
        this.orientation = event.alpha !== null && event;
        this.onChange( );
      };

      this.checkMotion = function ( event ) {
        if ( event && event.accelerationIncludingGravity &&
            event.accelerationIncludingGravity.x !== null ) {
          this.acceleration = event.accelerationIncludingGravity;
          this.onChange( );
        }
        else if ( event && event.acceleration && event.acceleration.x !== null ) {
          this.acceleration = event.acceleration;
          this.onChange( );
        }

      };

      this.acceleration = MotionCorrector.ZERO_VECTOR;
      this.orientation = MotionCorrector.ZERO_EULER;
      window.addEventListener( "deviceorientation", this.checkOrientation.bind( this ), bubbles );
      window.addEventListener( "devicemotion", this.checkMotion.bind( this ), bubbles );
    };
  }


// A few default values to let the code
// run in a static view on a sensorless device.
  MotionCorrector.ZERO_VECTOR = {x: -9.80665, y: 0, z: 0};
  MotionCorrector.ZERO_EULER = {gamma: 90, alpha: 270, beta: 0};

  pliny.class("Primrose.Input", {
    name: "Motion",
    description: "<under construction>"
  });
  function MotionInput ( name, commands, socket ) {
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, MotionInput.AXES );
    var corrector = new MotionCorrector( ),
        a = new THREE.Quaternion( ),
        b = new THREE.Quaternion( ),
        RIGHT = new THREE.Vector3( 1, 0, 0 ),
        UP = new THREE.Vector3( 0, 1, 0 ),
        FORWARD = new THREE.Vector3( 0, 0, -1 );
    corrector.addEventListener( "deviceorientation", function ( evt ) {
      for ( var i = 0; i < MotionInput.AXES.length; ++i ) {
        var k = MotionInput.AXES[i];
        this.setAxis( k, evt[k] );
      }
      a.set( 0, 0, 0, 1 )
          .multiply( b.setFromAxisAngle( UP, evt.HEADING ) )
          .multiply( b.setFromAxisAngle( RIGHT, evt.PITCH ) )
          .multiply( b.setFromAxisAngle( FORWARD, evt.ROLL ) );
      this.headRX = a.x;
      this.headRY = a.y;
      this.headRZ = a.z;
      this.headRW = a.w;
    }.bind( this ) );
    this.zeroAxes = corrector.zeroAxes.bind( corrector );
  }

  MotionInput.AXES = [
    "HEADING", "PITCH", "ROLL",
    "D_HEADING", "D_PITCH", "D_ROLL",
    "headAX", "headAY", "headAZ",
    "headRX", "headRY", "headRZ", "headRW" ];
  Primrose.Input.ButtonAndAxis.inherit( MotionInput );

  function makeTransform ( s, eye ) {
    var sw = Math.max( screen.width, screen.height ),
        sh = Math.min( screen.width, screen.height ),
        w = Math.floor( sw * devicePixelRatio / 2 ),
        h = Math.floor( sh * devicePixelRatio ),
        i = ( eye + 1 ) / 2;

    s.transform = new THREE.Matrix4().makeTranslation( eye * 0.034, 0, 0 );
    s.viewport = {
      x: i * w,
      y: 0,
      width: w,
      height: h,
      top: 0,
      right: ( i + 1 ) * w,
      bottom: h,
      left: i * w};
    s.fov = 75;
  }

  MotionInput.DEFAULT_TRANSFORMS = [ {}, {} ];
  makeTransform( MotionInput.DEFAULT_TRANSFORMS[0], -1 );
  makeTransform( MotionInput.DEFAULT_TRANSFORMS[1], 1 );

  MotionInput.prototype.getQuaternion = function ( x, y, z, w, value ) {
    value = value || new THREE.Quaternion();
    value.set( this.getValue( x ),
        this.getValue( y ),
        this.getValue( z ),
        this.getValue( w ) );
    return value;
  };
  return MotionInput;
} )( );

pliny.issue( "Primrose.Input.Motion", {
  name: "document Motion",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.Motion](#Primrose_Input_Motion) class in the input/ directory"
} );
;/* global Primrose, THREE, isChrome, pliny */

Primrose.Input.Mouse = ( function () {
  
  pliny.class("Primrose.Input", {
    name: "Mouse",
    description: "<under construction>"
  });
  function MouseInput ( name, DOMElement, commands, socket ) {
    DOMElement = DOMElement || window;
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, MouseInput.AXES );
    this.setLocation = function ( x, y ) {
      this.X = x;
      this.Y = y;
    };

    this.setMovement = function ( dx, dy ) {
      this.X += dx;
      this.Y += dy;
    };

    this.readEvent = function ( event ) {
      this.BUTTONS = event.buttons << 10;
      if ( MouseInput.isPointerLocked() ) {
        var mx = event.movementX,
            my = event.movementY;

        if ( mx === undefined ) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        this.setMovement( mx, my );
      }
      else {
        this.setLocation( event.layerX, event.layerY );
      }
    };

    DOMElement.addEventListener( "mousedown", function ( event ) {
      this.setButton( event.button, true );
      this.BUTTONS = event.buttons << 10;
    }.bind( this ), false );

    DOMElement.addEventListener( "mouseup", function ( event ) {
      this.setButton( event.button, false );
      this.BUTTONS = event.buttons << 10;
    }.bind( this ), false );

    DOMElement.addEventListener( "mousemove", this.readEvent.bind( this ), false );

    DOMElement.addEventListener( "wheel", function ( event ) {
      if ( isChrome ) {
        this.W += event.deltaX;
        this.Z += event.deltaY;
      }
      else if ( event.shiftKey ) {
        this.W += event.deltaY;
      }
      else {
        this.Z += event.deltaY;
      }
      event.preventDefault();
    }.bind( this ), false );

    this.addEventListener = function ( event, handler, bubbles ) {
      if ( event === "pointerlockchange" ) {
        if ( document.exitPointerLock ) {
          document.addEventListener(
              'pointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.mozExitPointerLock ) {
          document.addEventListener(
              'mozpointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.webkitExitPointerLock ) {
          document.addEventListener(
              'webkitpointerlockchange',
              handler,
              bubbles );
        }
      }
    };

    this.removeEventListener = function ( event, handler, bubbles ) {
      if ( event === "pointerlockchange" ) {
        if ( document.exitPointerLock ) {
          document.removeEventListener(
              'pointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.mozExitPointerLock ) {
          document.removeEventListener(
              'mozpointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.webkitExitPointerLock ) {
          document.removeEventListener(
              'webkitpointerlockchange',
              handler,
              bubbles );
        }
      }
    };

    DOMElement.requestPointerLock = DOMElement.requestPointerLock ||
        DOMElement.webkitRequestPointerLock ||
        DOMElement.mozRequestPointerLock ||
        function () {
        };

    this.requestPointerLock = function () {
      if ( !MouseInput.isPointerLocked() ) {
        DOMElement.requestPointerLock();
      }
    };

    this.exitPointerLock = ( document.webkitExitPointerLock ||
        document.mozExitPointerLock ||
        document.exitPointerLock ||
        function () {
        } ).bind( document );

    this.togglePointerLock = function () {
      if ( MouseInput.isPointerLocked() ) {
        this.exitPointerLock();
      }
      else {
        this.requestPointerLock();
      }
    };
  }

  MouseInput.isPointerLocked = function () {
    return !!( document.pointerLockElement ||
        document.webkitPointerLockElement ||
        document.mozPointerLockElement );
  };
  MouseInput.AXES = [ "X", "Y", "Z", "W", "BUTTONS" ];
  Primrose.Input.ButtonAndAxis.inherit( MouseInput );

  return MouseInput;
} )();

pliny.issue( "Primrose.Input.Mouse", {
  name: "document Mouse",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.Mouse](#Primrose_Input_Mouse) class in the input/ directory"
} );
;/* global Primrose, pliny */

Primrose.Input.Speech = ( function () {
  
////
//   Class: SpeechInput
//
//   Connects to a the webkitSpeechRecognition API and manages callbacks based on
//   keyword sets related to the callbacks. Note that the webkitSpeechRecognition
//   API requires a network connection, as the processing is done on an external
//   server.
//
//   Constructor: new SpeechInput(name, commands, socket);
//
//   The `name` parameter is used when transmitting the commands through the command
//   proxy server.
//
//   The `commands` parameter specifies a collection of keywords tied to callbacks
//   that will be called when one of the keywords are heard. Each callback can
//   be associated with multiple keywords, to be able to increase the accuracy
//   of matches by combining words and phrases that sound similar.
//
//   Each command entry is a simple object following the pattern:
//
//   {
//   "keywords": ["phrase no. 1", "phrase no. 2", ...],
//   "command": <callbackFunction>
//   }
//
//   The `keywords` property is an array of strings for which SpeechInput will
//   listen. If any of the words or phrases in the array matches matches the heard
//   command, the associated callbackFunction will be executed.
//
//  The `command` property is the callback function that will be executed. It takes no
//  parameters.
//
//  The `socket` (optional) parameter is a WebSocket connecting back to the command
//  proxy server.
//
//  Methods:
//  `start()`: starts the command unrecognition, unless it's not available, in which
//  case it prints a message to the console error log. Returns true if the running
//  state changed. Returns false otherwise.
//
//  `stop()`: uhm... it's like start, but it's called stop.
//
//  `isAvailable()`: returns true if the setup process was successful.
//
//  `getErrorMessage()`: returns the Error object that occured when setup failed, or
//  null if setup was successful.
///

  pliny.class("Primrose.Input", {
    name: "Speech",
    description: "<under construction>"
  });
  function SpeechInput ( name, commands, socket ) {
    Primrose.NetworkedInput.call( this, name, commands, socket );
    var running = false,
        recognition = null,
        errorMessage = null;

    function warn () {
      var msg = fmt( "Failed to initialize speech engine. Reason: $1",
          errorMessage.message );
      console.error( msg );
      return false;
    }

    function start () {
      if ( !available ) {
        return warn();
      }
      else if ( !running ) {
        running = true;
        recognition.start();
        return true;
      }
      return false;
    }

    function stop () {
      if ( !available ) {
        return warn();
      }
      if ( running ) {
        recognition.stop();
        return true;
      }
      return false;
    }

    this.check = function () {
      if ( this.enabled && !running ) {
        start();
      }
      else if ( !this.enabled && running ) {
        stop();
      }
    };

    this.getErrorMessage = function () {
      return errorMessage;
    };

    try {
      if ( window.SpeechRecognition ) {
        // just in case this ever gets standardized
        recognition = new SpeechRecognition();
      }
      else {
        // purposefully don't check the existance so it errors out and setup fails.
        recognition = new webkitSpeechRecognition();
      }
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      var restart = false;
      recognition.addEventListener( "start", function () {
        console.log( "speech started" );
        command = "";
      }.bind( this ), true );

      recognition.addEventListener( "error", function ( event ) {
        restart = true;
        console.log( "speech error", event );
        running = false;
        command = "speech error";
      }.bind( this ), true );

      recognition.addEventListener( "end", function () {
        console.log( "speech ended", arguments );
        running = false;
        command = "speech ended";
        if ( restart ) {
          restart = false;
          this.enable( true );
        }
      }.bind( this ), true );

      recognition.addEventListener( "result", function ( event ) {
        var newCommand = [ ];
        var result = event.results[event.resultIndex];
        var max = 0;
        var maxI = -1;
        if ( result && result.isFinal ) {
          for ( var i = 0; i < result.length; ++i ) {
            var alt = result[i];
            if ( alt.confidence > max ) {
              max = alt.confidence;
              maxI = i;
            }
          }
        }

        if ( max > 0.85 ) {
          newCommand.push( result[maxI].transcript.trim() );
        }

        newCommand = newCommand.join( " " );

        if ( newCommand !== this.inputState ) {
          this.inputState.text = newCommand;
        }
      }.bind( this ), true );

      available = true;
    }
    catch ( err ) {
      errorMessage = err;
      available = false;
    }
  }

  inherit( SpeechInput, Primrose.NetworkedInput );

  SpeechInput.maybeClone = function ( arr ) {
    return ( arr && arr.slice() ) || [ ];
  };

  SpeechInput.prototype.cloneCommand = function ( cmd ) {
    return {
      name: cmd.name,
      preamble: cmd.preamble,
      keywords: SpeechInput.maybeClone( cmd.keywords ),
      commandUp: cmd.commandUp,
      disabled: cmd.disabled
    };
  };

  SpeechInput.prototype.evalCommand = function ( cmd, cmdState,
      metaKeysSet, dt ) {
    if ( metaKeysSet && this.inputState.text ) {
      for ( var i = 0; i < cmd.keywords.length; ++i ) {
        if ( this.inputState.text.indexOf( cmd.keywords[i] ) === 0 &&
            ( cmd.preamble || cmd.keywords[i].length ===
                this.inputState.text.length ) ) {
          cmdState.pressed = true;
          cmdState.value = this.inputState.text.substring(
              cmd.keywords[i].length )
              .trim();
          this.inputState.text = null;
        }
      }
    }
  };

  SpeechInput.prototype.enable = function ( k, v ) {
    Primrose.NetworkedInput.prototype.enable.call( this, k, v );
    this.check();
  };

  SpeechInput.prototype.transmit = function ( v ) {
    Primrose.NetworkedInput.prototype.transmit.call( this, v );
    this.check();
  };
  return SpeechInput;
} )();

pliny.issue( "Primrose.Input.Speech", {
  name: "document Speech",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.Speech](#Primrose_Input_Speech) class in the input/ directory"
} );
;/* global Primrose, pliny */

Primrose.Input.Touch = ( function () {
  
  pliny.class("Primrose.Input", {
    name: "Touch",
    description: "<under construction>"
  });
  function TouchInput ( name, DOMElement, commands, socket ) {
    DOMElement = DOMElement || window;

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, TouchInput.AXES );

    function setState ( stateChange, setAxis, event ) {
      var touches = event.changedTouches;
      for ( var i = 0; i < touches.length; ++i ) {
        var t = touches[i];

        if ( setAxis ) {
          this.setAxis( "X" + t.identifier, t.pageX );
          this.setAxis( "Y" + t.identifier, t.pageY );
        }
        else {
          this.setAxis( "LX" + t.identifier, t.pageX );
          this.setAxis( "LY" + t.identifier, t.pageY );
        }

        var mask = 1 << t.identifier;
        if ( stateChange ) {
          this.FINGERS |= mask;
        }
        else {
          mask = ~mask;
          this.FINGERS &= mask;
        }
      }
    }

    DOMElement.addEventListener( "touchstart", setState.bind( this, true, false ), false );
    DOMElement.addEventListener( "touchend", setState.bind( this, false, true ), false );
    DOMElement.addEventListener( "touchmove", setState.bind( this, true, true ), false );
  }

  TouchInput.NUM_FINGERS = 10;
  TouchInput.AXES = [ "FINGERS" ];
  for ( var i = 0; i < TouchInput.NUM_FINGERS; ++i ) {
    TouchInput.AXES.push( "X" + i );
    TouchInput.AXES.push( "Y" + i );
  }
  Primrose.Input.ButtonAndAxis.inherit( TouchInput );
  return TouchInput;
} )();

pliny.issue( "Primrose.Input.Touch", {
  name: "document Touch",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.Touch](#Primrose_Input_Touch) class in the input/ directory"
} );
;/* global THREE, Primrose, HMDVRDevice, PositionSensorVRDevice, pliny, Promise */

Primrose.Input.VR = ( function () {

  function withFullScreenChange ( act ) {
    return new Promise( function ( resolve, reject ) {
      var onFullScreen,
          onFullScreenError,
          timeout,
          tearDown = function () {
        clearTimeout(timeout);
        window.removeEventListener( "fullscreenchange", onFullScreen );
        window.removeEventListener( "webkitfullscreenchange", onFullScreen );
        window.removeEventListener( "mozfullscreenchange", onFullScreen );
        window.removeEventListener( "msfullscreenchange", onFullScreen );
        
        window.removeEventListener( "fullscreenerror", onFullScreenError );
        window.removeEventListener( "webkitfullscreenerror", onFullScreenError );
        window.removeEventListener( "mozfullscreenerror", onFullScreenError );
        window.removeEventListener( "msfullscreenerror", onFullScreenError );
      };

      onFullScreen = function () {
        tearDown();
        console.log( "got fullscreen" );
        resolve( document.webkitFullscreenElement || document.fullscreenElement );
      };

      onFullScreenError = function ( evt ) {
        tearDown();
        console.error( "no got fullscreen" );
        reject( evt );
      };

      window.addEventListener( "fullscreenchange", onFullScreen, false );
      window.addEventListener( "webkitfullscreenchange", onFullScreen, false );
      window.addEventListener( "mozfullscreenchange", onFullScreen, false );
      window.addEventListener( "msfullscreenchange", onFullScreen, false );
      
      window.addEventListener( "fullscreenerror", onFullScreenError, false );
      window.addEventListener( "webkitfullscreenerror", onFullScreenError, false );
      window.addEventListener( "mozfullscreenerror", onFullScreenError, false );
      window.addEventListener( "msfullscreenerror", onFullScreenError, false );

      act();
      
      // Timeout wating on the fullscreen to happen, for systems like iOS that
      // don't properly support it, even though they say they do.
      timeout = setTimeout(reject, 1000);
    } );
  }

  function requestFullScreen ( elem, fullScreenParam ) {
    console.log( "requesting fullscreen" );
    return new Promise( function ( resolve, reject ) {
      withFullScreenChange( function () {
        if ( elem.webkitRequestFullscreen ) {
          elem.webkitRequestFullscreen( fullScreenParam || window.Element.ALLOW_KEYBOARD_INPUT );
        }
        else if ( elem.mozRequestFullScreen && fullScreenParam ) {
          elem.mozRequestFullScreen( fullScreenParam );
        }
        else if ( elem.mozRequestFullScreen && !fullScreenParam ) {
          elem.mozRequestFullScreen( );
        }
        else if ( elem.requestFullScreen ) {
          elem.requestFullScreen( );
        }
        else {
          reject();
        }
      } )
          .then( resolve )
          .catch( reject );
    } );
  }

  function exitFullScreen ( ) {
    console.log( "Exiting fullscreen" );
    return new Promise( function ( resolve, reject ) {
      withFullScreenChange( function () {
        if ( document.exitFullscreen ) {
          document.exitFullscreen();
        }
        else if ( document.webkitExitFullscreen ) {
          document.webkitExitFullscreen();
        }
        else if ( document.webkitCancelFullScreen ) {
          document.webkitCancelFullScreen();
        }
        else if ( document.mozCancelFullScreen ) {
          document.mozCancelFullScreen();
        }
        else if ( document.msExitFullscreen ) {
          document.msExitFullscreen( );
        }
        else {
          reject();
        }
      } ).then( resolve )
          .catch( reject );
    } );
  }

  function MockVRDisplay ( device ) {
    this.capabilities = {
      canPresent: !!device.display,
      hasExternalDisplay: !!device.display && !isMobile,
      hasOrientation: !!device.sensor,
      hasPosition: !!device.sensor && !isMobile
    };

    this.displayId = device.display.hardwareUnitId;

    this.displayName = "";
    var a = device.display.deviceName,
        b = device.sensor.deviceName;
    for ( var i = 0; i < a.length && i < b.length && a[i] === b[i]; ++i ) {
      this.displayName += a[i];
    }
    while ( this.displayName.length > 0 && !/\w/.test( this.displayName[this.displayName.length - 1] ) ) {
      this.displayName = this.displayName.substring( 0, this.displayName.length - 1 );
    }

    this.isConnected = true;
    this.isPresenting = false;
    this.stageParameters = null;

    this.getEyeParameters = function ( side ) {
      console.log( "getting eye parameters: ", side );
      var oldFormat = null;
      if ( device.display.getEyeParameters ) {
        oldFormat = device.display.getEyeParameters( side );
      }
      else {
        oldFormat = {
          renderRect: device.display.getRecommendedEyeRenderRect( side ),
          eyeTranslation: device.display.getEyeTranslation( side ),
          recommendedFieldOfView: device.display.getRecommendedEyeFieldOfView( side )
        };
      }

      console.log( "VR Eye Parameters" );
      console.log( "old format", oldFormat );

      var newFormat = {
        renderWidth: oldFormat.renderRect.width,
        renderHeight: oldFormat.renderRect.height,
        offset: new Float32Array( [
          oldFormat.eyeTranslation.x,
          oldFormat.eyeTranslation.y,
          oldFormat.eyeTranslation.z
        ] ),
        fieldOfView: oldFormat.recommendedFieldOfView
      };

      console.log( "new format", newFormat );

      return newFormat;
    };
    var frameID = 0;
    function createPoseFromState ( state ) {
      var pose = {
        timestamp: state.timestamp,
        frameID: ++frameID
      };
      if ( state.position ) {
        pose.position = new Float32Array( [
          state.position.x,
          state.position.y,
          state.position.z
        ] );
      }
      if ( state.linearVelocity ) {
        pose.linearVelocity = new Float32Array( [
          state.linearVelocity.x,
          state.linearVelocity.y,
          state.linearVelocity.z
        ] );
      }
      if ( state.linearAcceleration ) {
        pose.linearAcceleration = new Float32Array( [
          state.linearAcceleration.x,
          state.linearAcceleration.y,
          state.linearAcceleration.z
        ] );
      }
      if ( state.orientation ) {
        pose.orientation = new Float32Array( [
          state.orientation.x,
          state.orientation.y,
          state.orientation.z,
          state.orientation.w
        ] );
      }
      if ( state.angularVelocity ) {
        pose.angularVelocity = new Float32Array( [
          state.angularVelocity.x,
          state.angularVelocity.y,
          state.angularVelocity.z
        ] );
      }
      if ( state.angularAcceleration ) {
        pose.angularAcceleration = new Float32Array( [
          state.angularAcceleration.x,
          state.angularAcceleration.y,
          state.angularAcceleration.z
        ] );
      }
      return pose;
    }

    this.getImmediatePose = function () {
      return createPoseFromState( device.sensor.getImmediateState() );
    };

    this.getPose = function () {
      return createPoseFromState( device.sensor.getState() );
    };

    this.resetPose = device.sensor.resetSensor.bind( device.sensor );

    var currentLayer = null;

    this.getLayers = function () {
      return [ currentLayer ];
    };

    var fullScreenParam = {vrDisplay: device.display, vrDistortion: true};

    this.requestPresent = function ( layer ) {
      var promises = [ ];
      if ( currentLayer ) {
        console.log("need to exit the previous presentation mode, first.");
        promises.push( this.exitPresent() );
      }
      promises.push( new Promise( function ( resolve, reject ) {
        if ( !this.capabilities.canPresent ) {
          reject( new Error( "This device cannot be used as a presentation display. DisplayID: " + this.displayId + ". Name: " + this.displayName ) );
        }
        else if ( !layer ) {
          reject( new Error( "No layer provided to requestPresent" ) );
        }
        else if ( !layer.source ) {
          reject( new Error( "No source on layer parameter." ) );
        }
        else {
          requestFullScreen( layer.source, fullScreenParam )
              .then( function ( elem ) {
                this.isPresenting = elem === layer.source;
                currentLayer = layer;
                if ( isMobile && screen.orientation && screen.orientation.lock ) {
                  screen.orientation.lock( 'landscape-primary' );
                }
                resolve();
              }.bind( this ) )
              .catch( function ( evt ) {
                this.isPresenting = false;
                reject( evt );
              }.bind( this ) );
        }
      }.bind( this ) ) );
      return Promise.all( promises );
    }.bind( this );

    this.exitPresent = function () {
      return new Promise( function ( resolve, reject ) {
        if ( !this.isPresenting ) {
          reject( new Error( "Not presenting." ) );
        }
        else if ( !currentLayer ) {
          reject( new Error( "Not in control of presentation." ) );
        }
        else {
          var clear = function () {
            this.isPresenting = false;
            currentLayer = null;
          }.bind( this );

          exitFullScreen( )
              .then( function () {
                clear();
                resolve();
              } )
              .catch( function ( err ) {
                clear();
                reject( err );
              } );
        }
      } );
    };
  }

  MockVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind( window );
  MockVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind( window );

  MockVRDisplay.prototype.submitFrame = function () {
  };

  pliny.class( "Primrose.Input", {
    name: "VR",
    description: "<under construction>"
  } );
  function VRInput ( name, near, far, commands, socket, elem, selectedIndex ) {
    if ( commands === undefined || commands === null ) {
      commands = VRInput.AXES.map( function ( a ) {
        return {
          name: a,
          axes: [ Primrose.Input.VR[a] ]
        };
      } );
    }

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, VRInput.AXES );

    var listeners = {
      vrdeviceconnected: [ ],
      vrdevicelost: [ ]
    };


    this.addEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        listeners[event].push( handler );
      }
      if ( event === "vrdeviceconnected" ) {
        Object.keys( this.displays ).forEach( handler );
      }
    };

    function onConnected ( id ) {
      for ( var i = 0; i < listeners.vrdeviceconnected.length; ++i ) {
        listeners.vrdeviceconnected[i]( id );
      }
    }

    this.displays = [ ];
    this.currentDisplay = null;
    this.currentPose = null;
    this.params = null;
    this.transforms = null;

    function registerDisplays ( elem, displays ) {
      console.log( "Displays found:", displays.length );
      console.log( "Displays:", displays );
      this.displays = displays;

      if ( elem ) {
        console.log( "Building chooser interface.", elem );
        elem.innerHTML = "";
        for ( var i = 0; i < this.displays.length; ++i ) {
          var option = document.createElement( "option" );
          option.value = i;
          option.innerHTML = this.displays[i].deviceName;
          option.selected = ( selectedIndex === i );
          elem.appendChild( option );
        }
      }

      this.displays.forEach( onConnected );

      if ( typeof selectedIndex !== "number" && this.displays.length === 1 ) {
        selectedIndex = 0;
      }
      if ( typeof selectedIndex === "number" ) {
        this.connect( selectedIndex, near, far );
      }
    }

    function enumerateVRDevices ( elem, devices ) {
      console.log( "Devices found:", devices.length );
      console.log( "Devices:", devices );
      var displays = {},
          id = null;

      for ( var i = 0; i < devices.length; ++i ) {
        var device = devices[i];
        id = device.hardwareUnitId;
        if ( !displays[id] ) {
          displays[id] = {};
        }

        var display = displays[id];
        if ( device instanceof HMDVRDevice ) {
          display.display = device;
        }
        else if ( devices[i] instanceof PositionSensorVRDevice ) {
          display.sensor = device;
        }
      }

      var mockDisplays = [ ];
      for ( id in displays ) {
        mockDisplays.push( new MockVRDisplay( displays[id] ) );
      }

      registerDisplays.call( this, elem, mockDisplays );
    }

    function checkForVRDisplays () {
      console.log( "Checking for VR Displays..." );
      if ( navigator.getVRDisplays ) {
        console.log( "Using WebVR API 1" );
        navigator.getVRDisplays().then( registerDisplays.bind( this, elem ) );
      }
      else if ( navigator.getVRDevices ) {
        console.log( "Using Chromium Experimental WebVR API" );
        navigator.getVRDevices()
            .then( enumerateVRDevices.bind( this, elem ) )
            .catch( console.error.bind( console, "Could not find VR devices" ) );
      } else if ( navigator.mozGetVRDevices ) {
        console.log( "Using Firefox Experimental WebVR API" );
        navigator.mozGetVRDevices( enumerateVRDevices.bind( this, elem ) );
      }
      else {
        console.log( "Your browser doesn't have WebVR capability. Check out http://mozvr.com/" );
      }
    }

    checkForVRDisplays.call( this );
  }

  VRInput.AXES = [
    "headX", "headY", "headZ",
    "headVX", "headVY", "headVZ",
    "headAX", "headAY", "headAZ",
    "headRX", "headRY", "headRZ", "headRW",
    "headRVX", "headRVY", "headRVZ",
    "headRAX", "headRAY", "headRAZ"
  ];
  Primrose.Input.ButtonAndAxis.inherit( VRInput );

  VRInput.prototype.submitFrame = function () {
    if ( this.currentDisplay ) {
      this.currentDisplay.submitFrame( this.currentPose );
    }
  };

  VRInput.prototype.update = function ( dt ) {
    if ( this.currentDisplay ) {
      var caps = this.currentDisplay.capabilities,
          pose = this.currentDisplay.getPose();

      this.currentPose = pose;

      if ( caps.hasPosition && pose.position ) {
        this.headX = pose.position[0];
        this.headY = pose.position[1];
        this.headZ = pose.position[2];
      }
      if ( pose.linearVelocity ) {
        this.headVX = pose.linearVelocity[0];
        this.headVY = pose.linearVelocity[1];
        this.headVZ = pose.linearVelocity[2];
      }
      if ( pose.linearAcceleration ) {
        this.headAX = pose.linearAcceleration[0];
        this.headAY = pose.linearAcceleration[1];
        this.headAZ = pose.linearAcceleration[2];
      }

      if ( caps.hasOrientation && pose.orientation ) {
        this.headRX = pose.orientation[0];
        this.headRY = pose.orientation[1];
        this.headRZ = pose.orientation[2];
        this.headRW = pose.orientation[3];
      }
      if ( pose.angularVelocity ) {
        this.headRVX = pose.angularVelocity[0];
        this.headRVY = pose.angularVelocity[1];
        this.headRVZ = pose.angularVelocity[2];
      }
      if ( pose.angularAcceleration ) {
        this.headRAX = pose.angularAcceleration[0];
        this.headRAY = pose.angularAcceleration[1];
        this.headRAZ = pose.angularAcceleration[2];
      }
    }
    Primrose.Input.ButtonAndAxis.prototype.update.call( this, dt );
  };

  VRInput.prototype.getQuaternion = function ( x, y, z, w, value ) {
    value = value || new THREE.Quaternion();
    value.set( this.getValue( x ),
        this.getValue( y ),
        this.getValue( z ),
        this.getValue( w ) );
    return value;
  };

  function fieldOfViewToProjectionMatrix ( fov, zNear, zFar ) {
    var upTan = Math.tan( fov.upDegrees * Math.PI / 180.0 ),
        downTan = Math.tan( fov.downDegrees * Math.PI / 180.0 ),
        leftTan = Math.tan( fov.leftDegrees * Math.PI / 180.0 ),
        rightTan = Math.tan( fov.rightDegrees * Math.PI / 180.0 ),
        xScale = 2.0 / ( leftTan + rightTan ),
        yScale = 2.0 / ( upTan + downTan ),
        matrix = new THREE.Matrix4();
    matrix.elements[0] = xScale;
    matrix.elements[1] = 0.0;
    matrix.elements[2] = 0.0;
    matrix.elements[3] = 0.0;
    matrix.elements[4] = 0.0;
    matrix.elements[5] = yScale;
    matrix.elements[6] = 0.0;
    matrix.elements[7] = 0.0;
    matrix.elements[8] = -( ( leftTan - rightTan ) * xScale * 0.5 );
    matrix.elements[9] = ( ( upTan - downTan ) * yScale * 0.5 );
    matrix.elements[10] = -( zNear + zFar ) / ( zFar - zNear );
    matrix.elements[11] = -1.0;
    matrix.elements[12] = 0.0;
    matrix.elements[13] = 0.0;
    matrix.elements[14] = -( 2.0 * zFar * zNear ) / ( zFar - zNear );
    matrix.elements[15] = 0.0;

    return matrix;
  }

  function makeTransform ( s, eye, near, far ) {
    var t = eye.offset;
    s.translation = new THREE.Matrix4().makeTranslation( t[0], t[1], t[2] );
    s.projection = fieldOfViewToProjectionMatrix( eye.fieldOfView, near, far );
    s.viewport = {
      left: 0,
      top: 0,
      width: eye.renderWidth,
      height: eye.renderHeight
    };
  }

  VRInput.prototype.connect = function ( selectedIndex, near, far ) {
    this.currentDisplay = this.displays[selectedIndex];
    if ( this.currentDisplay ) {
      this.enabled = true;
      var params = {
        left: this.currentDisplay.getEyeParameters( "left" ),
        right: this.currentDisplay.getEyeParameters( "right" )
      };
      this.transforms = [ {}, {} ];
      makeTransform( this.transforms[0], params.left, near, far );
      makeTransform( this.transforms[1], params.right, near, far );
      this.transforms[1].viewport.left = this.transforms[0].viewport.width;
      console.log( "Transforms built", this.transforms );
    }
  };

  return VRInput;
} )();

pliny.issue( "Primrose.Input.VR", {
  name: "document VR",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.VR](#Primrose_Input_VR) class in the input/ directory"
} );
;/* global Primrose, Window, pliny */

Primrose.Output.Audio3D = ( function () {

  // polyfill
  Window.prototype.AudioContext =
      Window.prototype.AudioContext ||
      Window.prototype.webkitAudioContext ||
      function () {
      };

  pliny.class( "Primrose.Output", {
    name: "Audio3D",
    description: "<under construction>"
  } );
  function Audio3D () {

    try {
      this.context = new AudioContext();
      this.sampleRate = this.context.sampleRate;
      this.mainVolume = this.context.createGain();
      this.mainVolume.connect( this.context.destination );

      this.setPosition = this.context.listener.setPosition.bind(
          this.context.listener );
      this.setVelocity = this.context.listener.setVelocity.bind(
          this.context.listener );
      this.setOrientation = this.context.listener.setOrientation.bind(
          this.context.listener );
      this.isAvailable = true;
    }
    catch ( exp ) {
      this.isAvailable = false;
      this.setPosition = function () {
      };
      this.setVelocity = function () {
      };
      this.setOrientation = function () {
      };
      this.error = exp;
      console.error( "AudioContext not available. Reason: ", exp.message );
    }
  }

  Audio3D.prototype.loadBuffer = function ( src, progress, success ) {
    if ( !success ) {
      throw new Error(
          "You need to provide a callback function for when the audio finishes loading" );
    }

    // just overlook the lack of progress indicator
    if ( !progress ) {
      progress = function () {
      };
    }

    var error = function () {
      progress( "error", src );
    };

    if ( this.isAvailable ) {
      progress( "loading", src );
      Primrose.HTTP.get( "arraybuffer", src, function ( evt ) {
        progress( "intermediate", src, evt.loaded );
      }, error, function ( data ) {
        progress( "success", src );
        this.context.decodeAudioData( data, success, error );
      } );
    }
    else {
      error();
    }
  };

  Audio3D.prototype.loadBufferCascadeSrcList = function ( srcs, progress,
      success, index ) {
    index = index || 0;
    if ( index === srcs.length ) {
      if ( progress ) {
        srcs.forEach( function ( s ) {
          progress( "error", s );
        } );
      }
    }
    else {
      var userSuccess = success,
          userProgress = progress;
      success = function ( buffer ) {
        if ( userProgress ) {
          for ( var i = index + 1; i < srcs.length; ++i ) {
            console.log( "Skipping loading alternate file [" + srcs[i] +
                "]. [" + srcs[index] + "] has already loaded." );
            userProgress( "skip", srcs[i], "[" + srcs[index] +
                "] has already loaded." );
          }
        }
        if ( userSuccess ) {
          userSuccess( buffer );
        }
      };
      progress = function ( type, file, data ) {
        if ( userProgress ) {
          userProgress( type, file, data );
        }
        if ( type === "error" ) {
          console.warn( "Failed to decode " + srcs[index] );
          setTimeout( this.loadBufferCascadeSrcList.bind( this, srcs,
              userProgress, userSuccess, index + 1 ), 0 );
        }
      };
      this.loadBuffer( srcs[index], progress, success );
    }
  };

  Audio3D.prototype.createRawSound = function ( pcmData, success ) {
    if ( pcmData.length !== 1 && pcmData.length !== 2 ) {
      throw new Error( "Incorrect number of channels. Expected 1 or 2, got " +
          pcmData.length );
    }

    var frameCount = pcmData[0].length;
    if ( pcmData.length > 1 && pcmData[1].length !== frameCount ) {
      throw new Error(
          "Second channel is not the same length as the first channel. Expected " +
          frameCount + ", but was " + pcmData[1].length );
    }

    var buffer = this.context.createBuffer( pcmData.length, frameCount, this.sampleRate );
    for ( var c = 0; c < pcmData.length; ++c ) {
      var channel = buffer.getChannelData( c );
      for ( var i = 0; i < frameCount; ++i ) {
        channel[i] = pcmData[c][i];
      }
    }
    success( buffer );
  };

  Audio3D.prototype.createSound = function ( loop, success, buffer ) {
    var snd = {
      volume: this.context.createGain(),
      source: this.context.createBufferSource()
    };
    snd.source.buffer = buffer;
    snd.source.loop = loop;
    snd.source.connect( snd.volume );
    success( snd );
  };

  Audio3D.prototype.create3DSound = function ( x, y, z, success, snd ) {
    snd.panner = this.context.createPanner();
    snd.panner.setPosition( x, y, z );
    snd.panner.connect( this.mainVolume );
    snd.volume.connect( snd.panner );
    success( snd );
  };

  Audio3D.prototype.createFixedSound = function ( success, snd ) {
    snd.volume.connect( this.mainVolume );
    success( snd );
  };

  Audio3D.prototype.loadSound = function ( src, loop, progress, success ) {
    this.loadBuffer( src, progress, this.createSound.bind( this, loop,
        success ) );
  };

  Audio3D.prototype.loadSoundCascadeSrcList = function ( srcs, loop, progress, success ) {
    this.loadBufferCascadeSrcList( srcs, progress, this.createSound.bind( this,
        loop, success ) );
  };

  Audio3D.prototype.load3DSound = function ( src, loop, x, y, z, progress, success ) {
    this.loadSound( src, loop, progress, this.create3DSound.bind( this, x, y,
        z, success ) );
  };

  Audio3D.prototype.load3DSoundCascadeSrcList = function ( srcs, loop, x, y, z, progress, success ) {
    this.loadSoundCascadeSrcList()( srcs, loop, progress,
        this.create3DSound.bind( this, x, y, z, success ) );
  };

  Audio3D.prototype.loadFixedSound = function ( src, loop, progress, success ) {
    this.loadSound( src, loop, progress, this.createFixedSound.bind( this,
        success ) );
  };

  Audio3D.prototype.loadFixedSoundCascadeSrcList = function ( srcs, loop, progress, success ) {
    this.loadSoundCascadeSrcList( srcs, loop, progress,
        this.createFixedSound.bind( this, success ) );
  };

  Audio3D.prototype.playBufferImmediate = function ( buffer, volume ) {
    this.createSound( false, this.createFixedSound.bind( this, function (
        snd ) {
      snd.volume.gain.value = volume;
      snd.source.addEventListener( "ended", function ( evt ) {
        snd.volume.disconnect( this.mainVolume );
      }.bind( this ) );
      snd.source.start( 0 );
    } ), buffer );
  };

  return Audio3D;
} )();

pliny.issue( "Primrose.Output.Audio3D", {
  name: "document Audio3D",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Output.Audio3D](#Primrose_Output_Audio3D) class in the output/ directory"
} );

;/* global Primrose, io, Leap, pliny */

Primrose.Output.HapticGlove = ( function () {
  
  pliny.class( "Primrose.Output", {
    name: "HapticGlove",
    description: "<under construction>"
  } );
  function HapticGlove ( options ) {

    options.port = options.port || HapticGlove.DEFAULT_PORT;
    options.addr = options.addr || HapticGlove.DEFAULT_HOST;
    this.tips = [ ];
    this.numJoints = options.hands * options.fingers * options.joints;

    var enabled = false,
        connected = false;

    Leap.loop();

    this.setEnvironment = function ( opts ) {
      options.world = opts.world;
      options.scene = opts.scene;
      options.camera = opts.camera;

      Leap.loopController.on( "frame", readFrame.bind(this) );

    };

    var tipNames = [
      "tipPosition",
      "dipPosition",
      "pipPosition",
      "mcpPosition",
      "carpPosition"
    ];

    function readFrame ( frame ) {
      if ( frame.valid ) {
        enabled = frame.hands.length > 0;
        for ( var h = 0; h < options.hands && h < frame.hands.length; ++h ) {
          var hand = frame.hands[h];
          for ( var f = 0; f < options.fingers; ++f ) {
            var finger = hand.fingers[f];
            for ( var j = 0; j < options.joints; ++j ) {
              var n = h * options.fingers * options.joints + f * options.joints + j;
              if ( n < this.tips.length ) {
                var p = finger[tipNames[j]];
                var t = this.tips[n];
                t.position.set( p[0], p[1], p[2]) ;
              }
            }
          }
        }
      }
    }

    var socket,
        fingerState = 0;

    if ( options.port !== 80 ) {
      options.addr += ":" + options.port;
    }

    socket = io.connect( options.addr, {
      "reconnect": true,
      "reconnection delay": 1000,
      "max reconnection attempts": 5
    } );

    socket.on( "connect", function () {
      connected = true;
      console.log( "Connected!" );
    } );

    socket.on( "disconnect", function () {
      connected = false;
      console.log( "Disconnected!" );
    } );

    this.readContacts = function ( contacts ) {
      var count = 0;
      for ( var c = 0; enabled && count < 2 && c < contacts.length; ++c ) {
        var contact = contacts[c];
        for ( var h = 0; h < options.hands && count < 2; ++h ) {
          for ( var f = 0; f < options.fingers; ++f ) {
            var t = this.tips[f];
            var found = false;
            if ( contact.bi === t ) {
              if ( contact.bj.graphics && contact.bj.graphics.isSolid ) {
                this.setFingerState( f, true );
                found = true;
                ++count;
              }
            }
            if ( !found ) {
              this.setFingerState( f, false );
            }
          }
        }
      }
    };

    this.setFingerState = function ( i, value ) {
      var mask = 0x1 << i;
      if ( value ) {
        fingerState = fingerState | mask;
      }
      else {
        fingerState = fingerState & ~mask & 0x1f;
      }
      if ( connected ) {
        socket.emit( "data", fingerState );
      }
    };
  }

  HapticGlove.DEFAULT_PORT = 8383;
  HapticGlove.DEFAULT_HOST = document.location.hostname;
  return HapticGlove;
} )();

pliny.issue( "Primrose.Output.HapticGlove", {
  name: "document HapticGlove",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Output.HapticGlove](#Primrose_Output_HapticGlove) class in the output/ directory"
} );
;/* global Primrose, Window, pliny */

Primrose.Output.Music = ( function () {

  /* polyfill */
  Window.prototype.AudioContext =
      Window.prototype.AudioContext ||
      Window.prototype.webkitAudioContext ||
      function () {
      };

  var PIANO_BASE = Math.pow( 2, 1 / 12 ),
      MAX_NOTE_COUNT = ( navigator.maxTouchPoints || 10 ) + 1;

  function piano ( n ) {
    return 440 * Math.pow( PIANO_BASE, n - 49 );
  }

  pliny.class( "Primrose.Output", {
    name: "Music",
    description: "<under construction>"
  } );
  function Music ( context, type, numNotes ) {
    this.audio = context || new AudioContext();
    if ( this.audio && this.audio.createGain ) {
      if ( numNotes === undefined ) {
        numNotes = MAX_NOTE_COUNT;
      }
      if ( type === undefined ) {
        type = "sawtooth";
      }
      this.available = true;
      this.mainVolume = this.audio.createGain();
      this.mainVolume.connect( this.audio.destination );
      this.numNotes = numNotes;
      this.oscillators = [ ];

      for ( var i = 0; i < this.numNotes; ++i ) {
        var o = this.audio.createOscillator(),
            g = this.audio.createGain();
        o.type = type;
        o.frequency.value = 0;
        o.connect( g );
        o.start();
        g.connect( this.mainVolume );
        this.oscillators.push( {
          osc: o,
          gn: g,
          timeout: null
        } );
      }
    } else {
      this.available = false;
      IS_IN_GRID = true;
    }
  }

  Music.prototype.noteOn = function ( volume, i, n ) {
    if ( this.available ) {
      if ( n === undefined ) {
        n = 0;
      }
      var o = this.oscillators[n % this.numNotes],
          f = piano( parseFloat( i ) + 1 );
      o.gn.gain.value = volume;
      o.osc.frequency.setValueAtTime( f, 0 );
      return o;
    }
  };

  Music.prototype.noteOff = function ( n ) {
    if ( this.available ) {
      if ( n === undefined ) {
        n = 0;
      }
      var o = this.oscillators[n % this.numNotes];
      o.osc.frequency.setValueAtTime( 0, 0 );
    }
  };

  Music.prototype.play = function ( i, volume, duration, n ) {
    if ( this.available ) {
      if ( typeof n !== "number" ) {
        n = 0;
      }
      var o = this.noteOn( volume, i, n );
      if ( o.timeout ) {
        clearTimeout( o.timeout );
        o.timeout = null;
      }
      o.timeout = setTimeout( ( function ( n, o ) {
        this.noteOff( n );
        o.timeout = null;
      } ).bind( this, n, o ), duration * 1000 );
    }
  };

  return Music;
} )();

pliny.issue( "Primrose.Output.Music", {
  name: "document Music",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Output.Music](#Primrose_Output_Music) class in the output/ directory"
} );
;/* global Primrose, speechSynthesis, pliny */

Primrose.Output.Speech = ( function ( ) {
  function pickRandomOption ( options, key, min, max ) {
    if ( options[key] === undefined ) {
      options[key] = min + ( max - min ) * Math.random( );
    }
    else {
      options[key] = Math.min( max, Math.max( min, options[key] ) );
    }
    return options[key];
  }

  try {
    pliny.class( "Primrose.Output", {
      name: "Speech",
      description: "<under construction>"
    } );
    return function ( options ) {
      options = options || {};
      var voices = speechSynthesis.getVoices( )
          .filter( function ( v ) {
            return v.default || v.localService;
          }.bind( this ) );

      var voice = voices[
          Math.floor( pickRandomOption( options, "voice", 0, voices.length ) )];

      this.speak = function ( txt, callback ) {
        var msg = new SpeechSynthesisUtterance( );
        msg.voice = voice;
        msg.volume = pickRandomOption( options, "volume", 1, 1 );
        msg.rate = pickRandomOption( options, "rate", 0.1, 5 );
        msg.pitch = pickRandomOption( options, "pitch", 0, 2 );
        msg.text = txt;
        msg.onend = callback;
        speechSynthesis.speak( msg );
      };
    };
  }
  catch ( exp ) {

    // in case of error, return a shim that lets us continue unabated
    pliny.class( "Primrose.Output", {
      name: "Speech",
      description: "<under construction>"
    } );
    return function ( ) {
      this.speak = function ( ) {
      };
    };
  }
} )( );

pliny.issue( "Primrose.Output.Speech", {
  name: "document Speech",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Output.Speech](#Primrose_Output_Speech) class in the output/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.CodePage = ( function ( ) {
  "use strict";

  pliny.class( "Primrose.Text", {
    name: "CodePage",
    description: "<under construction>"
  } );
  function CodePage ( name, lang, options ) {
    this.name = name;
    this.language = lang;

    copyObject( this, {
      NORMAL: {
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z"
      },
      SHIFT: {
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z"
      }
    } );

    copyObject( this, options );

    for ( var i = 0; i <= 9; ++i ) {
      var code = Primrose.Keys["NUMPAD" + i];
      this.NORMAL[code] = i.toString();
    }

    this.NORMAL[Primrose.Keys.MULTIPLY] = "*";
    this.NORMAL[Primrose.Keys.ADD] = "+";
    this.NORMAL[Primrose.Keys.SUBTRACT] = "-";
    this.NORMAL[Primrose.Keys.DECIMALPOINT] = ".";
    this.NORMAL[Primrose.Keys.DIVIDE] = "/";
  }

  CodePage.DEAD = function ( key ) {
    return function ( prim ) {
      prim.setDeadKeyState( "DEAD" + key );
    };
  };

  return CodePage;
} ) ();

pliny.issue( "Primrose.Text.CodePage", {
  name: "document CodePage",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CodePage](#Primrose_Text_CodePage) class in the text/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.CommandPack = ( function ( ) {
  "use strict";

  pliny.class( "Primrose.Text", {
    name: "CommandPack",
    description: "<under construction>"
  } );
  function CommandPack ( name, commands ) {
    this.name = name;
    copyObject(this, commands);
  }

  return CommandPack;
} )();

pliny.issue( "Primrose.Text.CommandPack", {
  name: "document CommandPack",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CommandPack](#Primrose_Text_CommandPack) class in the text/ directory"
} );

pliny.issue( "Primrose.Text.CommandPack", {
  name: "Merge controls and command packs",
  type: "open",
  description: "The concept of an individual command pack doesn't make sense outside of the context of any particular control that uses it. The two are fundamentally linked, so they should be a part of the same class."
} );
;/* global qp, Primrose, pliny */

Primrose.Text.Cursor = ( function ( ) {
  "use strict";

  // unicode-aware string reverse
  var reverse = ( function ( ) {
    var combiningMarks =
        /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
        surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

    function reverse ( str ) {
      str = str.replace( combiningMarks, function ( match, capture1,
          capture2 ) {
        return reverse( capture2 ) + capture1;
      } )
          .replace( surrogatePair, "$2$1" );
      var res = "";
      for ( var i = str.length - 1; i >= 0; --i ) {
        res += str[i];
      }
      return res;
    }
    return reverse;
  }
  )( );

  pliny.class( "Primrose.Text", {
    name: "Cursor",
    description: "<under construction>"
  } );
  function Cursor ( i, x, y ) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.moved = true;
  }

  Cursor.min = function ( a, b ) {
    if ( a.i <= b.i ) {
      return a;
    }
    return b;
  };

  Cursor.max = function ( a, b ) {
    if ( a.i > b.i ) {
      return a;
    }
    return b;
  };

  Cursor.prototype.toString = function () {
    return "[i:" + this.i + " x:" + this.x + " y:" + this.y + "]";
  };

  Cursor.prototype.copy = function ( cursor ) {
    this.i = cursor.i;
    this.x = cursor.x;
    this.y = cursor.y;
    this.moved = false;
  };

  Cursor.prototype.fullhome = function ( ) {
    this.i = 0;
    this.x = 0;
    this.y = 0;
    this.moved = true;
  };

  Cursor.prototype.fullend = function ( lines ) {
    this.i = 0;
    var lastLength = 0;
    for ( var y = 0; y < lines.length; ++y ) {
      var line = lines[y];
      lastLength = line.length;
      this.i += lastLength;
    }
    this.y = lines.length - 1;
    this.x = lastLength;
    this.moved = true;
  };

  Cursor.prototype.skipleft = function ( lines ) {
    if ( this.x === 0 ) {
      this.left( lines );
    }
    else {
      var x = this.x - 1;
      var line = lines[this.y];
      var word = reverse( line.substring( 0, x ) );
      var m = word.match( /(\s|\W)+/ );
      var dx = m ? ( m.index + m[0].length + 1 ) : word.length;
      this.i -= dx;
      this.x -= dx;
    }
    this.moved = true;
  };

  Cursor.prototype.left = function ( lines ) {
    if ( this.i > 0 ) {
      --this.i;
      --this.x;
      if ( this.x < 0 ) {
        --this.y;
        var line = lines[this.y];
        this.x = line.length;
      }
      if ( this.reverseFromNewline( lines ) ) {
        ++this.i;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.skipright = function ( lines ) {
    var line = lines[this.y];
    if ( this.x === line.length || line[this.x] === '\n' ) {
      this.right( lines );
    }
    else {
      var x = this.x + 1;
      line = line.substring( x );
      var m = line.match( /(\s|\W)+/ );
      var dx = m ? ( m.index + m[0].length + 1 ) : ( line.length - this.x );
      this.i += dx;
      this.x += dx;
      this.reverseFromNewline( lines );
    }
    this.moved = true;
  };

  Cursor.prototype.fixCursor = function ( lines ) {
    this.x = this.i;
    this.y = 0;
    var total = 0;
    var line = lines[this.y];
    while ( this.x > line.length ) {
      this.x -= line.length;
      total += line.length;
      if ( this.y >= lines.length - 1 ) {
        this.i = total;
        this.x = line.length;
        this.moved = true;
        break;
      }
      ++this.y;
      line = lines[this.y];
    }
    return this.moved;
  };

  Cursor.prototype.right = function ( lines ) {
    this.advanceN( lines, 1 );
  };

  Cursor.prototype.advanceN = function ( lines, n ) {
    var line = lines[this.y];
    if ( this.y < lines.length - 1 || this.x < line.length ) {
      this.i += n;
      this.fixCursor( lines );
      line = lines[this.y];
      if ( this.x > 0 && line[this.x - 1] === '\n' ) {
        ++this.y;
        this.x = 0;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.home = function ( ) {
    this.i -= this.x;
    this.x = 0;
    this.moved = true;
  };

  Cursor.prototype.end = function ( lines ) {
    var line = lines[this.y];
    var dx = line.length - this.x;
    this.i += dx;
    this.x += dx;
    this.reverseFromNewline( lines );
    this.moved = true;
  };

  Cursor.prototype.up = function ( lines ) {
    if ( this.y > 0 ) {
      --this.y;
      var line = lines[this.y];
      var dx = Math.min( 0, line.length - this.x );
      this.x += dx;
      this.i -= line.length - dx;
      this.reverseFromNewline( lines );
    }
    this.moved = true;
  };

  Cursor.prototype.down = function ( lines ) {
    if ( this.y < lines.length - 1 ) {
      ++this.y;
      var line = lines[this.y];
      var pLine = lines[this.y - 1];
      var dx = Math.min( 0, line.length - this.x );
      this.x += dx;
      this.i += pLine.length + dx;
      this.reverseFromNewline( lines );
    }
    this.moved = true;
  };

  Cursor.prototype.incY = function ( dy, lines ) {
    this.y = Math.max( 0, Math.min( lines.length - 1, this.y + dy ) );
    var line = lines[this.y];
    this.x = Math.max( 0, Math.min( line.length, this.x ) );
    this.i = this.x;
    for ( var i = 0; i < this.y; ++i ) {
      this.i += lines[i].length;
    }
    this.reverseFromNewline( lines );
    this.moved = true;
  };

  Cursor.prototype.setXY = function ( x, y, lines ) {
    this.y = Math.max( 0, Math.min( lines.length - 1, y ) );
    var line = lines[this.y];
    this.x = Math.max( 0, Math.min( line.length, x ) );
    this.i = this.x;
    for ( var i = 0; i < this.y; ++i ) {
      this.i += lines[i].length;
    }
    this.reverseFromNewline( lines );
    this.moved = true;
  };

  Cursor.prototype.setI = function ( i, lines ) {
    this.i = i;
    this.fixCursor( lines );
    this.moved = true;
  };

  Cursor.prototype.reverseFromNewline = function ( lines ) {
    var line = lines[this.y];
    if ( this.x > 0 && line[this.x - 1] === '\n' ) {
      --this.x;
      --this.i;
      return true;
    }
    return false;
  };

  return Cursor;
} )();

pliny.issue( "Primrose.Text.Cursor", {
  name: "document Cursor",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Cursor](#Primrose_Text_Cursor) class in the text/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.Grammar = ( function ( ) {
  "use strict";

  pliny.class( "Primrose.Text", {
    name: "Grammar",
    parameters: [
      {name: "name", type: "String", description: "A user-friendly name for the grammar, to be able to include it in an options listing."},
      {name: "rules", type: "Array", description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."}
    ],
    description: "A Grammar is a collection of rules for processing text into tokens. Tokens are special characters that tell us about the structure of the text, things like keywords, curly braces, numbers, etc. After the text is tokenized, the tokens get a rough processing pass that groups them into larger elements that can be rendered in color on the screen.\n\
\n\
As tokens are discovered, they are removed from the text being processed, so order is important. Grammar rules are applied in the order they are specified, and more than one rule can produce the same token type.\n\
\n\
See [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names.",
    examples: [
      {name: "A plain-text \"grammar\".", description: "Plain text does not actually have a grammar that needs to be processed. However, to get the text to work with the rendering system, a basic grammar is necessary to be able to break the text up into lines and prepare it for rendering.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var plainTextGrammar = new Primrose.Text.Grammar(\n\
      // The name is for displaying in options views.\n\
      \"Plain-text\", [\n\
      // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
      [\"newlines\", /(?:\\r\\n|\\r|\\n)/] \n\
    ] );"},
      {name: "A grammar for BASIC", description: "The BASIC programming language is now defunct, but a grammar for it to display in Primrose is quite easy to build.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var basicGrammar = new Primrose.Text.Grammar( \"BASIC\",\n\
      // Grammar rules are applied in the order they are specified.\n\
      [\n\
        // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
        [ \"newlines\", /(?:\\r\\n|\\r|\\n)/ ],\n\
        // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.\n\
        [ \"lineNumbers\", /^\\d+\\s+/ ],\n\
        // Comments were lines that started with the keyword \"REM\" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.\n\
        [ \"startLineComments\", /^REM\\s/ ],\n\
        // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.\n\
        [ \"strings\", /\"(?:\\\\\"|[^\"])*\"/ ],\n\
        [ \"strings\", /'(?:\\\\'|[^'])*'/ ],\n\
        // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).\n\
        [ \"numbers\", /-?(?:(?:\\b\\d*)?\\.)?\\b\\d+\\b/ ],\n\
        // Keywords are really just a list of different words we want to match, surrounded by the \"word boundary\" selector \"\\b\".\n\
        [ \"keywords\",\n\
          /\\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\\b/\n\
        ],\n\
        // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.\n\
        [ \"keywords\", /^DEF FN/ ],\n\
        // These are all treated as mathematical operations.\n\
        [ \"operators\",\n\
          /(?:\\+|;|,|-|\\*\\*|\\*|\\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\\(|\\)|\\[|\\])/\n\
        ],\n\
        // Once everything else has been matched, the left over blocks of words are treated as variable and function names.\n\
        [ \"identifiers\", /\\w+\\$?/ ]\n\
      ] );"}
    ]
  } );
  function Grammar ( name, rules ) {
    pliny.property( {
      name: " name",
      type: "String",
      description: "A user-friendly name for the grammar, to be able to include it in an options listing."
    } );
    this.name = name;

    pliny.property( {
      name: "grammar",
      type: "Array",
      description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
    } );
    // clone the preprocessing grammar to start a new grammar
    this.grammar = rules.map( function ( rule ) {
      return new Primrose.Text.Rule( rule[0], rule[1] );
    } );

    function crudeParsing ( tokens ) {
      var commentDelim = null,
          stringDelim = null,
          line = 0,
          i, t;
      for ( i = 0; i < tokens.length; ++i ) {
        t = tokens[i];
        t.line = line;
        if ( t.type === "newlines" ) {
          ++line;
        }

        if ( stringDelim ) {
          if ( t.type === "stringDelim" && t.value === stringDelim && ( i === 0 || tokens[i - 1].value[tokens[i - 1].value.length - 1] !== "\\" ) ) {
            stringDelim = null;
          }
          if ( t.type !== "newlines" ) {
            t.type = "strings";
          }
        }
        else if ( commentDelim ) {
          if ( commentDelim === "startBlockComments" && t.type === "endBlockComments" ||
              commentDelim === "startLineComments" && t.type === "newlines" ) {
            commentDelim = null;
          }
          if ( t.type !== "newlines" ) {
            t.type = "comments";
          }
        }
        else if ( t.type === "stringDelim" ) {
          stringDelim = t.value;
          t.type = "strings";
        }
        else if ( t.type === "startBlockComments" || t.type === "startLineComments" ) {
          commentDelim = t.type;
          t.type = "comments";
        }
      }

      // recombine like-tokens
      for ( i = tokens.length - 1; i > 0; --i ) {
        var p = tokens[i - 1];
        t = tokens[i];
        if ( p.type === t.type && p.type !== "newlines" ) {
          p.value += t.value;
          tokens.splice( i, 1 );
        }
      }
    }

    pliny.method( {
      name: "tokenize",
      parameters: [ {name: "text", type: "String", description: "The text to tokenize."} ],
      returns: "An array of tokens, ammounting to drawing instructions to the renderer. However, they still need to be layed out to fit the bounds of the text area.",
      description: "Breaks plain text up into a list of tokens that can later be rendered with color.",
      examples: [
        {name: 'Tokenize some JavaScript', description: 'Primrose comes with a grammar for JavaScript built in.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var tokens = new Primrose.Text.Grammars.JavaScript\n\
      .tokenize("var x = 3;\\n\\\n\
    var y = 2;\\n\\\n\
    console.log(x + y);");\n\
    console.log(JSON.stringify(tokens));\n\
\n\
## Result:\n\
\n\
    grammar(\"JavaScript\");\n\
    [ \n\
      { "value": "var", "type": "keywords", "index": 0, "line": 0 },\n\
      { "value": " x = ", "type": "regular", "index": 3, "line": 0 },\n\
      { "value": "3", "type": "numbers", "index": 8, "line": 0 },\n\
      { "value": ";", "type": "regular", "index": 9, "line": 0 },\n\
      { "value": "\\n", "type": "newlines", "index": 10, "line": 0 },\n\
      { "value": " y = ", "type": "regular", "index": 11, "line": 1 },\n\
      { "value": "2", "type": "numbers", "index": 16, "line": 1 },\n\
      { "value": ";", "type": "regular", "index": 17, "line": 1 },\n\
      { "value": "\\n", "type": "newlines", "index": 18, "line": 1 },\n\
      { "value": "console", "type": "members", "index": 19, "line": 2 },\n\
      { "value": ".", "type": "regular", "index": 26, "line": 2 },\n\
      { "value": "log", "type": "functions", "index": 27, "line": 2 },\n\
      { "value": "(x + y);", "type": "regular", "index": 30, "line": 2 }\n\
    ]'}
      ]
    } );
    this.tokenize = function ( text ) {
      // all text starts off as regular text, then gets cut up into tokens of
      // more specific type
      var tokens = [ new Primrose.Text.Token( text, "regular", 0 ) ];
      for ( var i = 0; i < this.grammar.length; ++i ) {
        var rule = this.grammar[i];
        for ( var j = 0; j < tokens.length; ++j ) {
          rule.carveOutMatchedToken( tokens, j );
        }
      }

      crudeParsing( tokens );
      return tokens;
    };
  }

  return Grammar;
} )();

pliny.issue( "Primrose.Text.Grammar", {
  name: "document Grammar",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.Text.Grammar](#Primrose_Text_Grammar) class in the text/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.OperatingSystem = ( function ( ) {
  "use strict";

  function setCursorCommand ( obj, mod, key, func, cur ) {
    var name = mod + "_" + key;
    obj[name] = function ( prim, tokenRows ) {
      prim["cursor" + func]( tokenRows, prim[cur + "Cursor"] );
    };
  }

  function makeCursorCommand ( obj, baseMod, key, func ) {
    setCursorCommand( obj, baseMod || "NORMAL", key, func, "front" );
    setCursorCommand( obj, baseMod + "SHIFT", key, func, "back" );
  }

  pliny.class( "Primrose.Text", {
    name: "OperatingSystem",
    description: "<under construction>"
  } );
  function OperatingSystem ( name, pre1, pre2, redo, pre3, home, end, pre4, fullHome, fullEnd ) {
    this.name = name;

    this[pre1 + "_a"] = function ( prim, tokenRows ) {
      prim.frontCursor.fullhome( tokenRows );
      prim.backCursor.fullend( tokenRows );
    };

    this[redo] = function ( prim, tokenRows ) {
      prim.redo();
      prim.scrollIntoView( prim.frontCursor );
    };

    this[pre1 + "_z"] = function ( prim, tokenRows ) {
      prim.undo();
      prim.scrollIntoView( prim.frontCursor );
    };

    if ( pre1 + "_DOWNARROW" !== pre4 + "_" + fullEnd ) {
      this[pre1 + "_DOWNARROW"] = function ( prim, tokenRows ) {
        if ( prim.scroll.y < tokenRows.length ) {
          ++prim.scroll.y;
        }
      };
    }

    if ( pre1 + "_UPARROW" !== pre4 + "_" + fullHome ) {
      this[pre1 + "_UPARROW"] = function ( prim, tokenRows ) {
        if ( prim.scroll.y > 0 ) {
          --prim.scroll.y;
        }
      };
    }

    this.isClipboardReadingEvent = function ( evt ) {
      return evt[pre1.toLowerCase() + "Key"] && //meta or ctrl
          ( evt.keyCode === 67 || // C
              evt.keyCode === 88 ); // X
    };

    makeCursorCommand( this, "", "LEFTARROW", "Left" );
    makeCursorCommand( this, "", "RIGHTARROW", "Right" );
    makeCursorCommand( this, "", "UPARROW", "Up" );
    makeCursorCommand( this, "", "DOWNARROW", "Down" );
    makeCursorCommand( this, "", "PAGEUP", "PageUp" );
    makeCursorCommand( this, "", "PAGEDOWN", "PageDown" );
    makeCursorCommand( this, pre2, "LEFTARROW", "SkipLeft" );
    makeCursorCommand( this, pre2, "RIGHTARROW", "SkipRight" );
    makeCursorCommand( this, pre3, home, "Home" );
    makeCursorCommand( this, pre3, end, "End" );
    makeCursorCommand( this, pre4, fullHome, "FullHome" );
    makeCursorCommand( this, pre4, fullEnd, "FullEnd" );
  }

  return OperatingSystem;
} )();

pliny.issue( "Primrose.Text.OperatingSystem", {
  name: "document OperatingSystem",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.OperatingSystem](#Primrose_Text_OperatingSystem) class in the text/ directory"
} );
;/* global qp, Primrose, pliny */

Primrose.Text.Point = ( function ( ) {
  "use strict";

  pliny.class( "Primrose.Text", {
    name: "Point",
    description: "<under construction>"
  } );
  function Point ( x, y ) {
    this.set( x || 0, y || 0 );
  }

  Point.prototype.set = function ( x, y ) {
    this.x = x;
    this.y = y;
  };

  Point.prototype.copy = function ( p ) {
    if ( p ) {
      this.x = p.x;
      this.y = p.y;
    }
  };

  Point.prototype.clone = function () {
    return new Point( this.x, this.y );
  };

  Point.prototype.toString = function () {
    return "(x:" + this.x + ", y:" + this.y + ")";
  };

  return Point;
} )();

pliny.issue( "Primrose.Text.Point", {
  name: "document Point",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Point](#Primrose_Text_Point) class in the text/ directory"
} );
;/* global qp, Primrose, pliny */

Primrose.Text.Rectangle = ( function ( ) {
  "use strict";

  pliny.class( "Primrose.Text", {
    name: "Rectangle",
    description: "<under construction>"
  } );
  function Rectangle ( x, y, width, height ) {
    this.point = new Primrose.Text.Point( x, y );
    this.size = new Primrose.Text.Size( width, height );

    Object.defineProperties( this, {
      x: {
        get: function () {
          return this.point.x;
        },
        set: function ( x ) {
          this.point.x = x;
        }
      },
      left: {
        get: function () {
          return this.point.x;
        },
        set: function ( x ) {
          this.point.x = x;
        }
      },
      width: {
        get: function () {
          return this.size.width;
        },
        set: function ( width ) {
          this.size.width = width;
        }
      },
      right: {
        get: function () {
          return this.point.x + this.size.width;
        },
        set: function ( right ) {
          this.point.x = right - this.size.width;
        }
      },
      y: {
        get: function () {
          return this.point.y;
        },
        set: function ( y ) {
          this.point.y = y;
        }
      },
      top: {
        get: function () {
          return this.point.y;
        },
        set: function ( y ) {
          this.point.y = y;
        }
      },
      height: {
        get: function () {
          return this.size.height;
        },
        set: function ( height ) {
          this.size.height = height;
        }
      },
      bottom: {
        get: function () {
          return this.point.y + this.size.height;
        },
        set: function ( bottom ) {
          this.point.y = bottom - this.size.height;
        }
      }
    } );
  }

  Rectangle.prototype.set = function ( x, y, width, height ) {
    this.point.set( x, y );
    this.size.set( width, height );
  };

  Rectangle.prototype.copy = function ( r ) {
    if ( r ) {
      this.point.copy( r.point );
      this.size.copy( r.size );
    }
  };

  Rectangle.prototype.clone = function () {
    return new Rectangle( this.point.x, this.point.y, this.size.width,
        this.size.height );
  };

  Rectangle.prototype.toString = function () {
    return "[" + this.point.toString() + " x " + this.size.toString() + "]";
  };

  return Rectangle;
} )();

pliny.issue( "Primrose.Text.Rectangle", {
  name: "document Rectangle",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Rectangle](#Primrose_Text_Rectangle) class in the text/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.Rule = ( function ( ) {
  "use strict";

  pliny.class( "Primrose.Text", {
    name: "Rule",
    description: "<under construction>"
  } );
  function Rule ( name, test ) {
    this.name = name;
    this.test = test;
  }

  Rule.prototype.carveOutMatchedToken = function ( tokens, j ) {
    var token = tokens[j];
    if ( token.type === "regular" ) {
      var res = this.test.exec( token.value );
      if ( res ) {
        // Only use the last group that matches the regex, to allow for more
        // complex regexes that can match in special contexts, but not make
        // the context part of the token.
        var midx = res[res.length - 1],
            start = res.input.indexOf( midx ),
            end = start + midx.length;
        if ( start === 0 ) {
          // the rule matches the start of the token
          token.type = this.name;
          if ( end < token.value.length ) {
            // but not the end
            var next = token.splitAt( end );
            next.type = "regular";
            tokens.splice( j + 1, 0, next );
          }
        }
        else {
          // the rule matches from the middle of the token
          var mid = token.splitAt( start );
          if ( midx.length < mid.value.length ) {
            // but not the end
            var right = mid.splitAt( midx.length );
            tokens.splice( j + 1, 0, right );
          }
          mid.type = this.name;
          tokens.splice( j + 1, 0, mid );
        }
      }
    }
  };

  return Rule;
} )();

pliny.issue( "Primrose.Text.Rule", {
  name: "document Rule",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Rule](#Primrose_Text_Rule) class in the text/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.Size = (function ( ) {
  "use strict";

  pliny.class( "Primrose.Text", {
    name: "Size",
    description: "<under construction>"
  } );
  function Size ( width, height ) {
    this.set( width || 0, height || 0 );
  }

  Size.prototype.set = function ( width, height ) {
    this.width = width;
    this.height = height;
  };

  Size.prototype.copy = function ( s ) {
    if ( s ) {
      this.width = s.width;
      this.height = s.height;
    }
  };

  Size.prototype.clone = function () {
    return new Size( this.width, this.height );
  };

  Size.prototype.toString = function () {
    return "<w:" + this.width + ", h:" + this.height + ">";
  };

  return Size;
} )();

pliny.issue( "Primrose.Text.Size", {
  name: "document Size",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Size](#Primrose_Text_Size) class in the text/ directory"
} );
;/* global Primrose, isOSX, pliny */


pliny.class( "Primrose.Text", {
  name: "Terminal",
  description: "<under construction>"
} );
Primrose.Text.Terminal = function ( inputEditor, outputEditor ) {
  "use strict";

  outputEditor = outputEditor || inputEditor;

  var inputCallback = null,
      currentProgram = null,
      originalGrammar = null,
      currentEditIndex = 0,
      pageSize = 40,
      outputQueue = [ ],
      buffer = "",
      restoreInput = inputEditor === outputEditor,
      self = this;

  this.running = false;
  this.waitingForInput = false;

  function toEnd ( editor ) {
    editor.selectionStart = editor.selectionEnd = editor.value.length;
    editor.scrollIntoView( editor.frontCursor );
  }

  function done () {
    if ( self.running ) {
      flush( );
      self.running = false;
      if ( restoreInput ) {
        inputEditor.tokenizer = originalGrammar;
        inputEditor.value = currentProgram;
      }
      toEnd( inputEditor );
    }
  }

  function clearScreen () {
    outputEditor.selectionStart = outputEditor.selectionEnd = 0;
    outputEditor.value = "";
    return true;
  }

  function flush () {
    if ( buffer.length > 0 ) {
      var lines = buffer.split( "\n" );
      for ( var i = 0; i < pageSize && lines.length > 0; ++i ) {
        outputQueue.push( lines.shift() );
      }
      if ( lines.length > 0 ) {
        outputQueue.push( " ----- more -----" );
      }
      buffer = lines.join( "\n" );
    }
  }

  function input ( callback ) {
    inputCallback = callback;
    self.waitingForInput = true;
    flush( );
  }

  function stdout ( str ) {
    buffer += str;
  }

  this.sendInput = function ( evt ) {
    if ( buffer.length > 0 ) {
      flush( );
    }
    else {
      outputEditor.keyDown( evt );
      var str = outputEditor.value.substring( currentEditIndex );
      inputCallback( str.trim() );
      inputCallback = null;
      this.waitingForInput = false;
    }
  };

  this.execute = function ( inVR ) {
    pageSize = inVR ? 10 : 40;
    originalGrammar = inputEditor.tokenizer;
    if ( originalGrammar && originalGrammar.interpret ) {
      this.running = true;
      var looper,
          next = function () {
            if ( self.running ) {
              setTimeout( looper, 1 );
            }
          };

      currentProgram = inputEditor.value;
      looper = originalGrammar.interpret( currentProgram, input, stdout,
          stdout, next, clearScreen, this.loadFile.bind( this ), done );
      outputEditor.tokenizer = Primrose.Text.Grammars.PlainText;
      clearScreen();
      next();
    }
  };

  this.loadFile = function ( fileName, callback ) {
    Primrose.HTTP.get( "text", fileName.toLowerCase(), function ( file ) {
      if ( isOSX ) {
        file = file.replace( "CTRL+SHIFT+SPACE", "CMD+OPT+E" );
      }
      inputEditor.value = currentProgram = file;
      if ( callback ) {
        callback();
      }
    } );
  };

  this.update = function () {
    if ( outputQueue.length > 0 ) {
      outputEditor.value += outputQueue.shift() + "\n";
      toEnd( outputEditor );
      currentEditIndex = outputEditor.selectionStart;
    }
  };
};

pliny.issue( "Primrose.Text.Terminal", {
  name: "document Terminal",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Terminal](#Primrose_Text_Terminal) class in the text/ directory"
} );

pliny.issue( "Primrose.Text.Terminal", {
  name: "Move Terminal to Controls namespace",
  type: "open",
  description: "Terminal should be a type of control, like TextArea and Button."
} );
;/* global Primrose, pliny */

Primrose.Text.Token = ( function () {
  "use strict";

  pliny.class( "Primrose.Text", {
    name: "Token",
    description: "<under construction>"
  } );
  function Token ( value, type, index, line ) {
    this.value = value;
    this.type = type;
    this.index = index;
    this.line = line;
  }

  Token.prototype.clone = function () {
    return new Token( this.value, this.type, this.index, this.line );
  };

  Token.prototype.splitAt = function ( i ) {
    var next = this.value.substring( i );
    this.value = this.value.substring( 0, i );
    return new Token( next, this.type, this.index + i, this.line );
  };

  Token.prototype.toString = function () {
    return "[" + this.type + ": " + this.value + "]";
  };

  return Token;
} )();

pliny.issue( "Primrose.Text.Token", {
  name: "document Token",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Token](#Primrose_Text_Token) class in the text/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.CodePages.DE_QWERTZ = (function () {
  "use strict";
  var CodePage = Primrose.Text.CodePage;
  
  pliny.record( "Primrose.Text.CodePages", {
    name: "DE_QWERTZ",
    description: "<under construction>"
  } );
  return new CodePage("Deutsch: QWERTZ", "de", {
    deadKeys: [220, 221, 160, 192],
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "60": "<",
      "63": "ß",
      "160": CodePage.DEAD(3),
      "163": "#",
      "171": "+",
      "173": "-",
      "186": "ü",
      "187": "+",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "#",
      "192": CodePage.DEAD(4),
      "219": "ß",
      "220": CodePage.DEAD(1),
      "221": CodePage.DEAD(2),
      "222": "ä",
      "226": "<"
    },
    DEAD1NORMAL: {
      "65": "â",
      "69": "ê",
      "73": "î",
      "79": "ô",
      "85": "û",
      "190": "."
    },
    DEAD2NORMAL: {
      "65": "á",
      "69": "é",
      "73": "í",
      "79": "ó",
      "83": "s",
      "85": "ú",
      "89": "ý"
    },
    SHIFT: {
      "48": "=",
      "49": "!",
      "50": "\"",
      "51": "§",
      "52": "$",
      "53": "%",
      "54": "&",
      "55": "/",
      "56": "(",
      "57": ")",
      "60": ">",
      "63": "?",
      "163": "'",
      "171": "*",
      "173": "_",
      "186": "Ü",
      "187": "*",
      "188": ";",
      "189": "_",
      "190": ":",
      "191": "'",
      "192": "Ö",
      "219": "?",
      "222": "Ä",
      "226": ">"
    },
    CTRLALT: {
      "48": "}",
      "50": "²",
      "51": "³",
      "55": "{",
      "56": "[",
      "57": "]",
      "60": "|",
      "63": "\\",
      "69": "€",
      "77": "µ",
      "81": "@",
      "171": "~",
      "187": "~",
      "219": "\\",
      "226": "|"
    },
    CTRLALTSHIFT: {
      "63": "ẞ",
      "219": "ẞ"
    },
    DEAD3NORMAL: {
      "65": "a",
      "69": "e",
      "73": "i",
      "79": "o",
      "85": "u",
      "190": "."
    },
    DEAD4NORMAL: {
      "65": "a",
      "69": "e",
      "73": "i",
      "79": "o",
      "83": "s",
      "85": "u",
      "89": "y"
    }
  });
})();

pliny.issue( "Primrose.Text.CodePages.DE_QWERTZ", {
  name: "document DE_QWERTZ",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CodePages.DE_QWERTZ](#Primrose_Text_CodePages_DE_QWERTZ) class in the code_pages/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.CodePages.EN_UKX = (function () {
  "use strict";
  var CodePage = Primrose.Text.CodePage;
  
  pliny.record( "Primrose.Text.CodePages", {
    name: "EN_UKX",
    description: "<under construction>"
  } );
  return new CodePage("English: UK Extended", "en-GB", {
    CTRLALT: {
      "52": "€",
      "65": "á",
      "69": "é",
      "73": "í",
      "79": "ó",
      "85": "ú",
      "163": "\\",
      "192": "¦",
      "222": "\\",
      "223": "¦"
    },
    CTRLALTSHIFT: {
      "65": "Á",
      "69": "É",
      "73": "Í",
      "79": "Ó",
      "85": "Ú",
      "222": "|"
    },
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "59": ";",
      "61": "=",
      "163": "#",
      "173": "-",
      "186": ";",
      "187": "=",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "/",
      "192": "'",
      "219": "[",
      "220": "\\",
      "221": "]",
      "222": "#",
      "223": "`"
    }, SHIFT: {
      "48": ")",
      "49": "!",
      "50": "\"",
      "51": "£",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "59": ":",
      "61": "+",
      "163": "~",
      "173": "_",
      "186": ":",
      "187": "+",
      "188": "<",
      "189": "_",
      "190": ">",
      "191": "?",
      "192": "@",
      "219": "{",
      "220": "|",
      "221": "}",
      "222": "~",
      "223": "¬"
    }
  });
})();

pliny.issue( "Primrose.Text.CodePages.EN_UKX", {
  name: "document EN_UKX",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CodePages.EN_UKX](#Primrose_Text_CodePages_EN_UKX) class in the code_pages/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.CodePages.EN_US = (function () {
  "use strict";
  var CodePage = Primrose.Text.CodePage;
  
  pliny.record( "Primrose.Text.CodePages", {
    name: "EN_US",
    description: "<under construction>"
  } );
  return new CodePage("English: USA", "en-US", {
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "59": ";",
      "61": "=",
      "173": "-",
      "186": ";",
      "187": "=",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "/",
      "219": "[",
      "220": "\\",
      "221": "]",
      "222": "'"
    },
    SHIFT: {
      "48": ")",
      "49": "!",
      "50": "@",
      "51": "#",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "59": ":",
      "61": "+",
      "173": "_",
      "186": ":",
      "187": "+",
      "188": "<",
      "189": "_",
      "190": ">",
      "191": "?",
      "219": "{",
      "220": "|",
      "221": "}",
      "222": "\""
    }
  });
})();

pliny.issue( "Primrose.Text.CodePages.EN_US", {
  name: "document EN_US",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CodePages.EN_US](#Primrose_Text_CodePages_EN_US) class in the code_pages/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.CodePages.FR_AZERTY = ( function () {
  "use strict";
  var CodePage = Primrose.Text.CodePage;
  
  pliny.record( "Primrose.Text.CodePages", {
    name: "FR_AZERTY",
    description: "<under construction>"
  } );
  return new CodePage( "Français: AZERTY", "fr", {
    deadKeys: [ 221, 50, 55 ],
    NORMAL: {
      "48": "à",
      "49": "&",
      "50": "é",
      "51": "\"",
      "52": "'",
      "53": "(",
      "54": "-",
      "55": "è",
      "56": "_",
      "57": "ç",
      "186": "$",
      "187": "=",
      "188": ",",
      "190": ";",
      "191": ":",
      "192": "ù",
      "219": ")",
      "220": "*",
      "221": CodePage.DEAD( 1 ),
      "222": "²",
      "223": "!",
      "226": "<"
    },
    SHIFT: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "186": "£",
      "187": "+",
      "188": "?",
      "190": ".",
      "191": "/",
      "192": "%",
      "219": "°",
      "220": "µ",
      "223": "§",
      "226": ">"
    },
    CTRLALT: {
      "48": "@",
      "50": CodePage.DEAD( 2 ),
      "51": "#",
      "52": "{",
      "53": "[",
      "54": "|",
      "55": CodePage.DEAD( 3 ),
      "56": "\\",
      "57": "^",
      "69": "€",
      "186": "¤",
      "187": "}",
      "219": "]"
    },
    DEAD1NORMAL: {
      "65": "â",
      "69": "ê",
      "73": "î",
      "79": "ô",
      "85": "û"
    },
    DEAD2NORMAL: {
      "65": "ã",
      "78": "ñ",
      "79": "õ"
    },
    DEAD3NORMAL: {
      "48": "à",
      "50": "é",
      "55": "è",
      "65": "à",
      "69": "è",
      "73": "ì",
      "79": "ò",
      "85": "ù"
    }
  } );
} )();

pliny.issue( "Primrose.Text.CodePages.FR_AZERTY", {
  name: "document FR_AZERTY",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CodePages.FR_AZERTY](#Primrose_Text_CodePages_FR_AZERTY) class in the code_pages/ directory"
} );
;/* global Primrose, pliny */

////
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
///
Primrose.Text.CommandPacks.TestViewer = ( function () {
  "use strict";

  pliny.record( "Primrose.Text.CommandPacks", {
    name: "TestViewer",
    description: "<under construction>"
  } );
  return {
    name: "Basic commands",
    NORMAL_SPACE: " ",
    SHIFT_SPACE: " ",
    NORMAL_BACKSPACE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.frontCursor.left( tokenRows );
      }
      prim.selectedText = "";
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_ENTER: function ( prim, tokenRows, currentToken ) {
      var indent = "";
      var tokenRow = tokenRows[prim.frontCursor.y];
      if ( tokenRow.length > 0 && tokenRow[0].type === "whitespace" ) {
        indent = tokenRow[0].value;
      }
      prim.selectedText = "\n" + indent;
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_DELETE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.backCursor.right( tokenRows );
      }
      prim.selectedText = "";
      prim.scrollIntoView( prim.frontCursor );
    },
    SHIFT_DELETE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.frontCursor.home( tokenRows );
        prim.backCursor.end( tokenRows );
      }
      prim.selectedText = "";
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_TAB: function ( prim, tokenRows ) {
      prim.selectedText = prim.getTabString();
    }
  };
} )();

pliny.issue( "Primrose.Text.CommandPacks.TestViewer", {
  name: "document TestViewer",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CommandPacks.TestViewer](#Primrose_Text_CommandPacks_TestViewer) class in the command_packs/ directory"
} );
;/* global Primrose, pliny */
 
//// 
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.TextEditor = ( function () {
  "use strict";

  pliny.record( "Primrose.Text.CommandPacks", {
    name: "TextEditor",
    description: "<under construction>"
  } );
  function TextEditor ( operatingSystem, codePage, editor ) {
    var commands = {
      NORMAL_SPACE: " ",
      SHIFT_SPACE: " ",
      NORMAL_BACKSPACE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.left( tokenRows );
        }
        prim.selectedText = "";
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_ENTER: function ( prim, tokenRows, currentToken ) {
        var indent = "";
        var tokenRow = tokenRows[prim.frontCursor.y];
        if ( tokenRow.length > 0 && tokenRow[0].type === "whitespace" ) {
          indent = tokenRow[0].value;
        }
        prim.selectedText = "\n" + indent;
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.backCursor.right( tokenRows );
        }
        prim.selectedText = "";
        prim.scrollIntoView( prim.frontCursor );
      },
      SHIFT_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.home( tokenRows );
          prim.backCursor.end( tokenRows );
        }
        prim.selectedText = "";
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_TAB: function ( prim, tokenRows ) {
        var ts = prim.getTabString();
        prim.selectedText = prim.getTabString();
      }
    };

    var allCommands = {};

    copyObject( allCommands, codePage );
    copyObject( allCommands, operatingSystem );
    copyObject( allCommands, commands );
    function overwriteText ( ed, txt ) {
      ed.selectedText = txt;
    }
    for ( var key in allCommands ) {
      if ( allCommands.hasOwnProperty( key ) ) {
        var func = allCommands[key];
        if ( typeof func !== "function" ) {
          func = overwriteText.bind( null, editor, func );
        }
        allCommands[key] = func;
      }
    }

    Primrose.Text.CommandPack.call( this, "Text editor commands", allCommands );
  }
  inherit( TextEditor, Primrose.Text.CommandPack );
  return TextEditor;
} )();

pliny.issue( "Primrose.Text.CommandPacks.TextEditor", {
  name: "document TextEditor",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.CommandPacks.TextEditor](#Primrose_Text_CommandPacks_TextEditor) class in the command_packs/ directory"
} );
;/* global Primrose, THREE, pliny */

Primrose.Text.Controls.PlainText = ( function () {

  pliny.class( "Primrose.Text.Controls", {
    name: "PlainText",
    description: "<under construction>"
  } );
  function PlainText ( text, size, fgcolor, bgcolor, x, y, z, hAlign ) {
    text = text.replace( /\r\n/g, "\n" );
    var lines = text.split( "\n" );
    hAlign = hAlign || "center";
    var lineHeight = ( size * 1000 );
    var boxHeight = lineHeight * lines.length;

    var textCanvas = document.createElement( "canvas" );
    var textContext = textCanvas.getContext( "2d" );
    textContext.font = lineHeight + "px Arial";
    var width = textContext.measureText( text ).width;

    textCanvas.width = width;
    textCanvas.height = boxHeight;
    textContext.font = lineHeight * 0.8 + "px Arial";
    if ( bgcolor !== "transparent" ) {
      textContext.fillStyle = bgcolor;
      textContext.fillRect( 0, 0, textCanvas.width, textCanvas.height );
    }
    textContext.fillStyle = fgcolor;
    textContext.textBaseline = "top";

    for ( var i = 0; i < lines.length; ++i ) {
      textContext.fillText( lines[i], 0, i * lineHeight );
    }

    var texture = new THREE.Texture( textCanvas );
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial( {
      map: texture,
      transparent: bgcolor === "transparent",
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: THREE.FlatShading
    } );

    var textGeometry = new THREE.PlaneGeometry( size * width / lineHeight,
        size * lines.length );
    textGeometry.computeBoundingBox();
    textGeometry.computeVertexNormals();

    var textMesh = new THREE.Mesh( textGeometry, material );
    if ( hAlign === "left" ) {
      x -= textGeometry.boundingBox.min.x;
    }
    else if ( hAlign === "right" ) {
      x += textGeometry.boundingBox.min.x;
    }
    textMesh.position.set( x, y, z );
    return textMesh;
  }

  return PlainText;
} )();

pliny.issue( "Primrose.Text.Controls.PlainText", {
  name: "document PlainText",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Controls.PlainText](#Primrose_Text_Controls_PlainText) class in the controls/ directory"
} );

pliny.issue( "Primrose.Text.Controls.PlainText", {
  name: "rename PlainText",
  type: "open",
  description: "The purpose of this control is to be an easier-to-use, simpler text area that doesn't support syntax highlighting or complex layout flows. It will probably be used most often in the single-line form."
} );
;/* global qp, Primrose, isOSX, isIE, isOpera, isChrome, isFirefox, isSafari, devicePixelRatio, HTMLCanvasElement, pliny */

Primrose.Text.Controls.TextBox = ( function ( ) {
  "use strict";

  var SCROLL_SCALE = isFirefox ? 3 : 100;

  pliny.class( "Primrose.Text.Controls", {
    name: "TextBox",
    description: "Syntax highlighting textbox control.",
    parameters: [
      {name: "renderToElementOrID", type: "String or Element", description: "Junk"},
      {name: "options", type: "Object", description: "More junk."}
    ]
  } );
  function TextBox ( renderToElementOrID, options ) {
    var self = this;
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || {};
    if ( typeof options === "string" ) {
      options = {file: options};
    }

    Primrose.BaseControl.call( this );

    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////
    var Renderer = options.renderer || Primrose.Text.Renderers.Canvas,
        codePage,
        operatingSystem,
        browser,
        CommandSystem,
        keyboardSystem,
        commandPack,
        tokenizer,
        tokens,
        tokenRows,
        tokenHashes,
        lines,
        theme,
        pointer = new Primrose.Text.Point(),
        lastPointer = new Primrose.Text.Point(),
        tabWidth,
        tabString,
        currentTouchID,
        deadKeyState = "",
        keyNames = [ ],
        history = [ ],
        historyFrame = -1,
        gridBounds = new Primrose.Text.Rectangle(),
        topLeftGutter = new Primrose.Text.Size(),
        bottomRightGutter = new Primrose.Text.Size(),
        dragging = false,
        scrolling = false,
        showLineNumbers = true,
        showScrollBars = true,
        wordWrap = false,
        wheelScrollSpeed = 4,
        padding = 1,
        renderer = new Renderer( renderToElementOrID, options ),
        surrogate = null,
        surrogateContainer = null;

    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    this.frontCursor = new Primrose.Text.Cursor();
    this.backCursor = new Primrose.Text.Cursor();
    this.scroll = new Primrose.Text.Point();


    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function refreshTokens () {
      tokens = tokenizer.tokenize( self.value );
      self.update();
    }

    function clampScroll () {
      if ( self.scroll.y < 0 ) {
        self.scroll.y = 0;
      }
      else {
        while ( 0 < self.scroll.y &&
            self.scroll.y > lines.length - gridBounds.height ) {
          --self.scroll.y;
        }
      }
    }

    function setCursorXY ( cursor, x, y ) {
      pointer.set( x, y );
      renderer.pixel2cell( pointer, self.scroll, gridBounds );
      var gx = pointer.x - self.scroll.x;
      var gy = pointer.y - self.scroll.y;
      var onBottom = gy >= gridBounds.height;
      var onLeft = gx < 0;
      var onRight = pointer.x >= gridBounds.width;
      if ( !scrolling && !onBottom && !onLeft && !onRight ) {
        cursor.setXY( pointer.x, pointer.y, lines );
        self.backCursor.copy( cursor );
      }
      else if ( scrolling || onRight && !onBottom ) {
        scrolling = true;
        var scrollHeight = lines.length - gridBounds.height;
        if ( gy >= 0 && scrollHeight >= 0 ) {
          var sy = gy * scrollHeight / gridBounds.height;
          self.scroll.y = Math.floor( sy );
        }
      }
      else if ( onBottom && !onLeft ) {
        var maxWidth = 0;
        for ( var dy = 0; dy < lines.length; ++dy ) {
          maxWidth = Math.max( maxWidth, lines[dy].length );
        }
        var scrollWidth = maxWidth - gridBounds.width;
        if ( gx >= 0 && scrollWidth >= 0 ) {
          var sx = gx * scrollWidth / gridBounds.width;
          self.scroll.x = Math.floor( sx );
        }
      }
      else if ( onLeft && !onBottom ) {
        // clicked in number-line gutter
      }
      else {
        // clicked in the lower-left corner
      }
      lastPointer.copy( pointer );
    }

    function fixCursor () {
      var moved = self.frontCursor.fixCursor( lines ) ||
          self.backCursor.fixCursor( lines );
      if ( moved ) {
        self.render();
      }
    }

    function pointerStart ( x, y ) {
      if ( options.pointerEventSource ) {
        self.focus();
        var bounds = options.pointerEventSource.getBoundingClientRect();
        self.startPointer( x - bounds.left, y - bounds.top );
      }
    }

    function pointerMove ( x, y ) {
      if ( options.pointerEventSource ) {
        var bounds = options.pointerEventSource.getBoundingClientRect();
        self.movePointer( x - bounds.left, y - bounds.top );
      }
    }

    function mouseButtonDown ( evt ) {
      if ( evt.button === 0 ) {
        pointerStart( evt.clientX, evt.clientY );
        evt.preventDefault();
      }
    }

    function mouseMove ( evt ) {
      if ( self.focused ) {
        pointerMove( evt.clientX, evt.clientY );
      }
    }

    function mouseButtonUp ( evt ) {
      if ( self.focused && evt.button === 0 ) {
        self.endPointer();
      }
    }

    function touchStart ( evt ) {
      if ( self.focused && evt.touches.length > 0 && !dragging ) {
        var t = evt.touches[0];
        pointerStart( t.clientX, t.clientY );
        currentTouchID = t.identifier;
      }
    }

    function touchMove ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          pointerMove( t.clientX, t.clientY );
          break;
        }
      }
    }

    function touchEnd ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          self.endPointer();
        }
      }
    }

    function refreshCommandPack () {
      if ( keyboardSystem && operatingSystem && CommandSystem ) {
        commandPack = new CommandSystem( operatingSystem, keyboardSystem,
            self );
      }
    }

    function makeCursorCommand ( name ) {
      var method = name.toLowerCase();
      self["cursor" + name] = function ( lines, cursor ) {
        cursor[method]( lines );
        self.scrollIntoView( cursor );
      };
    }

    function setGutter () {
      if ( showLineNumbers ) {
        topLeftGutter.width = 1;
      }
      else {
        topLeftGutter.width = 0;
      }

      if ( !showScrollBars ) {
        bottomRightGutter.set( 0, 0 );
      }
      else if ( wordWrap ) {
        bottomRightGutter.set( renderer.VSCROLL_WIDTH, 0 );
      }
      else {
        bottomRightGutter.set( renderer.VSCROLL_WIDTH, 1 );
      }
    }

    function refreshGridBounds () {
      var lineCountWidth = 0;
      if ( showLineNumbers ) {
        lineCountWidth = Math.max( 1, Math.ceil( Math.log( history[historyFrame].length ) / Math.LN10 ) );
      }

      var x = Math.floor( topLeftGutter.width + lineCountWidth + padding / renderer.character.width ),
          y = Math.floor( padding / renderer.character.height ),
          w = Math.floor( ( self.width - 2 * padding ) / renderer.character.width ) - x - bottomRightGutter.width,
          h = Math.floor( ( self.height - 2 * padding ) / renderer.character.height ) - y - bottomRightGutter.height;
      gridBounds.set( x, y, w, h );
      gridBounds.lineCountWidth = lineCountWidth;
    }

    function performLayout () {

      // group the tokens into rows
      tokenRows = [ [ ] ];
      tokenHashes = [ "" ];
      lines = [ "" ];
      var currentRowWidth = 0;
      var tokenQueue = tokens.slice();
      for ( var i = 0; i < tokenQueue.length; ++i ) {
        var t = tokenQueue[i].clone();
        var widthLeft = gridBounds.width - currentRowWidth;
        var wrap = wordWrap && t.type !== "newlines" && t.value.length > widthLeft;
        var breakLine = t.type === "newlines" || wrap;
        if ( wrap ) {
          var split = t.value.length > gridBounds.width ? widthLeft : 0;
          tokenQueue.splice( i + 1, 0, t.splitAt( split ) );
        }

        if ( t.value.length > 0 ) {
          tokenRows[tokenRows.length - 1].push( t );
          tokenHashes[tokenHashes.length - 1] += JSON.stringify( t );
          lines[lines.length - 1] += t.value;
          currentRowWidth += t.value.length;
        }

        if ( breakLine ) {
          tokenRows.push( [ ] );
          tokenHashes.push( "" );
          lines.push( "" );
          currentRowWidth = 0;
        }
      }
    }

    function setFalse ( evt ) {
      evt.returnValue = false;
    }

    function minDelta ( v, minV, maxV ) {
      var dvMinV = v - minV,
          dvMaxV = v - maxV + 5,
          dv = 0;
      if ( dvMinV < 0 || dvMaxV >= 0 ) {
        // compare the absolute values, so we get the smallest change
        // regardless of direction.
        dv = Math.abs( dvMinV ) < Math.abs( dvMaxV ) ? dvMinV : dvMaxV;
      }

      return dv;
    }

    function makeToggler ( id, value, lblTxt, funcName ) {
      var span = document.createElement( "span" );

      var check = document.createElement( "input" );
      check.type = "checkbox";
      check.checked = value;
      check.id = id;
      span.appendChild( check );

      var lbl = document.createElement( "label" );
      lbl.innerHTML = lblTxt + " ";
      lbl.for = id;
      span.appendChild( lbl );

      check.addEventListener( "change", function () {
        self[funcName]( check.checked );
      } );
      return span;
    }

    function makeSelectorFromObj ( id, obj, def, target, prop, lbl, filter ) {
      var elem = Primrose.DOM.cascadeElement( id, "select", window.HTMLSelectElement );
      var items = [ ];
      for ( var key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
          var val = obj[key];
          if ( !filter || val instanceof filter ) {
            val = val.name || key;
            var opt = document.createElement( "option" );
            opt.innerHTML = val;
            items.push( obj[key] );
            if ( val === def ) {
              opt.selected = "selected";
            }
            elem.appendChild( opt );
          }
        }
      }

      if ( typeof target[prop] === "function" ) {
        elem.addEventListener( "change", function () {
          target[prop]( items[elem.selectedIndex] );
        } );
      }
      else {
        elem.addEventListener( "change", function () {
          target[prop] = items[elem.selectedIndex];
        } );
      }

      var container = Primrose.DOM.cascadeElement( "container -" + id, "div", window.HTMLDivElement ),
          label = Primrose.DOM.cascadeElement( "label-" + id, "span", window.HTMLSpanElement );
      label.innerHTML = lbl + ": ";
      label.for = elem;
      elem.title = lbl;
      elem.alt = lbl;
      container.appendChild( label );
      container.appendChild( elem );
      return container;
    }


    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////
    [ "Left", "Right",
      "SkipLeft", "SkipRight",
      "Up", "Down",
      "Home", "End",
      "FullHome", "FullEnd" ].map( makeCursorCommand.bind( this ) );

    this.addEventListener = function ( event, thunk ) {
      if ( event === "keydown" ) {
        options.keyEventSource.addEventListener( event, thunk );
      }
      else {
        Primrose.BaseControl.prototype.addEventListener.call( this, event, thunk );
      }
    };

    this.cursorPageUp = function ( lines, cursor ) {
      cursor.incY( -gridBounds.height, lines );
      this.scrollIntoView( cursor );
    };

    this.cursorPageDown = function ( lines, cursor ) {
      cursor.incY( gridBounds.height, lines );
      this.scrollIntoView( cursor );
    };

    this.setDeadKeyState = function ( st ) {
      deadKeyState = st || "";
    };

    this.setSize = function ( w, h ) {
      renderer.setSize( w, h );
    };

    Object.defineProperties( this, {
      value: {
        get: function () {
          return history[historyFrame].join( "\n" );
        },
        set: function ( txt ) {
          txt = txt || "";
          txt = txt.replace( /\r\n/g, "\n" );
          var lines = txt.split( "\n" );
          this.pushUndo( lines );
          this.update();
        }
      },
      width: {
        get: function () {
          return renderer.width;
        }
      },
      height: {
        get: function () {
          return renderer.height;
        }
      },
      padding: {
        get: function () {
          return padding;
        },
        set: function ( v ) {
          padding = v;
          refreshGridBounds();
          self.render();
        }
      },
      wordWrap: {
        set: function ( v ) {
          wordWrap = v || false;
          setGutter();
        },
        get: function () {
          return wordWrap;
        }
      },
      showLineNumbers: {
        set: function ( v ) {
          showLineNumbers = v;
          setGutter();
        },
        get: function () {
          return showLineNumbers;
        }
      },
      showScrollBars: {
        set: function ( v ) {
          showScrollBars = v;
          setGutter();
        },
        get: function () {
          return showScrollBars;
        }
      },
      theme: {
        set: function ( t ) {
          theme = t || Primrose.Text.Themes.Default;
          renderer.theme = theme;
          this.update();
        },
        get: function () {
          return theme;
        }
      },
      operatingSystem: {
        set: function ( os ) {
          operatingSystem = os || ( isOSX ? Primrose.Text.OperatingSystems.OSX :
              Primrose.Text.OperatingSystems.Windows );
          refreshCommandPack();
        },
        get: function () {
          return operatingSystem;
        }
      },
      commandSystem: {
        set: function ( cmd ) {
          CommandSystem = cmd || Primrose.Text.CommandPacks.TextEditor;
          refreshCommandPack();
        }
      },
      renderer: {
        get: function () {
          return renderer;
        }
      },
      DOMElement: {
        get: function () {
          return renderer.DOMElement;
        }
      },
      selectionStart: {
        get: function () {
          return this.frontCursor.i;
        },
        set: function ( i ) {
          this.frontCursor.setI( i, lines );
        }
      },
      selectionEnd: {
        get: function () {
          return this.backCursor.i;
        },
        set: function ( i ) {
          this.backCursor.setI( i, lines );
        }
      },
      selectionDirection: {
        get: function () {
          return this.frontCursor.i <= this.backCursor.i ? "forward"
              : "backward";
        }
      },
      tokenizer: {
        get: function () {
          return tokenizer;
        },
        set: function ( tk ) {
          tokenizer = tk || Primrose.Text.Grammars.JavaScript;
          if ( history && history.length > 0 ) {
            refreshTokens();
            this.update();
          }
        }
      },
      codePage: {
        get: function(){
          return codePage;
        },
        set: function ( cp ) {
          var key,
              code,
              char,
              name;
          codePage = cp;
          if ( !codePage ) {
            var lang = ( navigator.languages && navigator.languages[0] ) ||
                navigator.language ||
                navigator.userLanguage ||
                navigator.browserLanguage;

            if ( !lang || lang === "en" ) {
              lang = "en-US";
            }

            for ( key in Primrose.Text.CodePages ) {
              cp = Primrose.Text.CodePages[key];
              if ( cp.language === lang ) {
                codePage = cp;
                break;
              }
            }

            if ( !codePage ) {
              codePage = Primrose.Text.CodePages.EN_US;
            }
          }

          keyNames = [ ];
          for ( key in Primrose.Keys ) {
            code = Primrose.Keys[key];
            if ( !isNaN( code ) ) {
              keyNames[code] = key;
            }
          }

          keyboardSystem = {};
          for ( var type in codePage ) {
            var codes = codePage[type];
            if ( typeof ( codes ) === "object" ) {
              for ( code in codes ) {
                if ( code.indexOf( "_" ) > -1 ) {
                  var parts = code.split( ' ' ),
                      browser = parts[0];
                  code = parts[1];
                  char = codePage.NORMAL[code];
                  name = browser + "_" + type + " " + char;
                }
                else {
                  char = codePage.NORMAL[code];
                  name = type + "_" + char;
                }
                keyNames[code] = char;
                keyboardSystem[name] = codes[code];
              }
            }
          }

          refreshCommandPack();
        }
      },
      tabWidth: {
        set: function ( tw ) {
          tabWidth = tw || 4;
          tabString = "";
          for ( var i = 0; i < tabWidth; ++i ) {
            tabString += " ";
          }
        },
        get: function () {
          return tabWidth;
        }
      },
      fontSize: {
        get: function () {
          return theme.fontSize;
        },
        set: function ( v ) {
          if ( 0 < v ) {
            theme.fontSize = v;
            renderer.resize();
            this.render();
          }
        }
      },
      selectedText: {
        set: function ( str ) {
          str = str || "";
          str = str.replace( /\r\n/g, "\n" );

          if ( this.frontCursor.i !== this.backCursor.i || str.length > 0 ) {
            var minCursor = Primrose.Text.Cursor.min( this.frontCursor,
                this.backCursor ),
                maxCursor = Primrose.Text.Cursor.max( this.frontCursor,
                    this.backCursor ),
                // TODO: don't recalc the string first.
                text = this.value,
                left = text.substring( 0, minCursor.i ),
                right = text.substring( maxCursor.i );
            this.value = left + str + right;
            refreshTokens();
            refreshGridBounds();
            performLayout();
            minCursor.advanceN( lines, Math.max( 0, str.length ) );
            this.scrollIntoView( maxCursor );
            clampScroll();
            maxCursor.copy( minCursor );
            this.render();
          }
        }
      },
      position: {
        get: function () {
          return this.mesh.position;
        }
      },
      quaternion: {
        get: function () {
          return this.mesh.quaternion;
        }
      }
    } );

    this.copyElement = function ( elem ) {
      Primrose.BaseControl.prototype.copyElement.call( this, elem );
      this.value = elem.value || elem.innerHTML;
    };

    this.pushUndo = function ( lines ) {
      if ( historyFrame < history.length - 1 ) {
        history.splice( historyFrame + 1 );
      }
      history.push( lines );
      historyFrame = history.length - 1;
      refreshTokens();
    };

    this.redo = function () {
      if ( historyFrame < history.length - 1 ) {
        ++historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.undo = function () {
      if ( historyFrame > 0 ) {
        --historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.getTabString = function () {
      return tabString;
    };

    this.scrollIntoView = function ( currentCursor ) {
      this.scroll.y += minDelta( currentCursor.y, this.scroll.y,
          this.scroll.y + gridBounds.height );
      if ( !wordWrap ) {
        this.scroll.x += minDelta( currentCursor.x, this.scroll.x,
            this.scroll.x + gridBounds.width );
      }
      clampScroll();
    };

    this.readWheel = function ( evt ) {

      if ( this.focused ) {
        if ( evt.shiftKey || isChrome ) {
          this.fontSize += evt.deltaX / SCROLL_SCALE;
        }
        if ( !evt.shiftKey || isChrome ) {
          this.scroll.y += Math.floor( evt.deltaY * wheelScrollSpeed / SCROLL_SCALE );
        }
        clampScroll();
        evt.preventDefault();
      }
    };

    this.startPointer = function ( x, y ) {
      setCursorXY( this.frontCursor, x, y );
      dragging = true;
      this.update();
    };

    this.startUV = function ( point ) {
      if ( point ) {
        var p = renderer.mapUV( point );
        this.startPointer( p.x, p.y );
      }
    };

    this.movePointer = function ( x, y ) {
      if ( dragging ) {
        setCursorXY( this.backCursor, x, y );
        this.update();
      }
    };

    this.moveUV = function ( point ) {
      if ( point ) {
        var p = renderer.mapUV( point );
        this.movePointer( p.x, p.y );
      }
    };

    this.endPointer = function () {
      dragging = false;
      scrolling = false;
    };

    this.bindEvents = function ( k, p, w, enableClipboard ) {

      if ( p ) {
        if ( !w ) {
          p.addEventListener( "wheel", this.readWheel.bind( this ), false );
        }
        p.addEventListener( "mousedown", mouseButtonDown, false );
        p.addEventListener( "mousemove", mouseMove, false );
        p.addEventListener( "mouseup", mouseButtonUp, false );
        p.addEventListener( "touchstart", touchStart, false );
        p.addEventListener( "touchmove", touchMove, false );
        p.addEventListener( "touchend", touchEnd, false );
      }

      if ( w ) {
        w.addEventListener( "wheel", this.readWheel.bind( this ), false );
      }

      if ( k ) {

        if ( k instanceof HTMLCanvasElement && !k.tabindex ) {
          k.tabindex = 0;
        }

        if ( enableClipboard ) {
          //
          // the `surrogate` textarea makes clipboard events possible
          surrogate = Primrose.DOM.cascadeElement( "primrose-surrogate-textarea-" + renderer.id, "textarea", window.HTMLTextAreaElement );
          surrogateContainer = Primrose.DOM.makeHidingContainer( "primrose-surrogate-textarea-container-" + renderer.id, surrogate );
          surrogateContainer.style.position = "absolute";
          surrogateContainer.style.overflow = "hidden";
          surrogateContainer.style.width = 0;
          surrogateContainer.style.height = 0;
          document.body.insertBefore( surrogateContainer, document.body.children[0] );

          k.addEventListener( "beforepaste", setFalse, false );
          k.addEventListener( "paste", this.readClipboard.bind( this ), false );
          k.addEventListener( "keydown", function ( evt ) {
            if ( self.focused && operatingSystem.isClipboardReadingEvent( evt ) ) {
              surrogate.style.display = "block";
              surrogate.focus();
            }
          }, true );
          surrogate.addEventListener( "beforecopy", setFalse, false );
          surrogate.addEventListener( "copy", this.copySelectedText.bind( this ), false );
          surrogate.addEventListener( "beforecut", setFalse, false );
          surrogate.addEventListener( "cut", this.cutSelectedText.bind( this ), false );
        }

        k.addEventListener( "keydown", this.keyDown.bind( this ), false );
      }
    };

    this.getSelectedText = function () {
      var minCursor = Primrose.Text.Cursor.min( this.frontCursor, this.backCursor ),
          maxCursor = Primrose.Text.Cursor.max( this.frontCursor, this.backCursor );
      return this.value.substring( minCursor.i, maxCursor.i );
    };

    this.copySelectedText = function ( evt ) {
      if ( this.focused ) {
        evt.returnValue = false;
        if ( this.frontCursor.i !== this.backCursor.i ) {
          var clipboard = evt.clipboardData || window.clipboardData;
          clipboard.setData(
              window.clipboardData ? "Text" : "text/plain",
              this.getSelectedText() );
        }
        evt.preventDefault();
        surrogate.style.display = "none";
        options.keyEventSource.focus();
      }
    };

    this.cutSelectedText = function ( evt ) {
      if ( this.focused ) {
        this.copySelectedText( evt );
        if ( !this.readOnly ) {
          this.selectedText = "";
          this.update();
        }
      }
    };

    this.readClipboard = function ( evt ) {
      if ( this.focused && !this.readOnly ) {
        evt.returnValue = false;
        var clipboard = evt.clipboardData || window.clipboardData,
            str = clipboard.getData( window.clipboardData ? "Text" : "text/plain" );
        if ( str ) {
          this.selectedText = str;
        }
      }
    };

    this.keyDown = function ( evt ) {
      if ( this.focused ) {
        evt = evt || event;

        var key = evt.keyCode;
        if ( key !== Primrose.Keys.CTRL &&
            key !== Primrose.Keys.ALT &&
            key !== Primrose.Keys.META_L &&
            key !== Primrose.Keys.META_R &&
            key !== Primrose.Keys.SHIFT &&
            ( !this.readOnly ||
                key === Primrose.Keys.UPARROW ||
                key === Primrose.Keys.DOWNARROW ||
                key === Primrose.Keys.LEFTARROW ||
                key === Primrose.Keys.RIGHTARROW ||
                key === Primrose.Keys.PAGEUP ||
                key === Primrose.Keys.PAGEDOWN ||
                key === Primrose.Keys.END ||
                key === Primrose.Keys.HOME ) ) {
          var oldDeadKeyState = deadKeyState;

          var commandName = deadKeyState;

          if ( evt.ctrlKey ) {
            commandName += "CTRL";
          }
          if ( evt.altKey ) {
            commandName += "ALT";
          }
          if ( evt.metaKey ) {
            commandName += "META";
          }
          if ( evt.shiftKey ) {
            commandName += "SHIFT";
          }
          if ( commandName === deadKeyState ) {
            commandName += "NORMAL";
          }

          commandName += "_" + keyNames[key];

          var func = commandPack[browser + "_" + commandName] ||
              commandPack[commandName];
          if ( func ) {
            this.frontCursor.moved = false;
            this.backCursor.moved = false;
            func( self, lines );
            if ( this.frontCursor.moved && !this.backCursor.moved ) {
              this.backCursor.copy( this.frontCursor );
            }
            clampScroll();
            evt.preventDefault();
          }

          if ( deadKeyState === oldDeadKeyState ) {
            deadKeyState = "";
          }
        }
        this.update();
      }
    };

    this.update = function () {
      if ( renderer.resized ) {
        renderer.resize();
      }
    };

    var lastText,
        lastCharacterWidth,
        lastCharacterHeight,
        lastWidth,
        lastHeight,
        lastGridBounds,
        lastPadding;

    this.render = function () {
      if ( tokens ) {
        refreshGridBounds();
        var boundsChanged = gridBounds.toString() !== lastGridBounds,
            textChanged = lastText !== this.value,
            characterWidthChanged = renderer.character.width !== lastCharacterWidth,
            characterHeightChanged = renderer.character.height !== lastCharacterHeight,
            paddingChanged = padding !== lastPadding,
            layoutChanged = boundsChanged || textChanged || characterWidthChanged || characterHeightChanged || renderer.resized || paddingChanged;

        lastGridBounds = gridBounds.toString();
        lastText = this.value;
        lastCharacterWidth = renderer.character.width;
        lastCharacterHeight = renderer.character.height;
        lastWidth = this.width;
        lastHeight = this.height;
        lastPadding = padding;

        if ( layoutChanged ) {
          performLayout( gridBounds );
        }

        renderer.render(
            tokenRows,
            tokenHashes,
            this.frontCursor,
            this.backCursor,
            gridBounds,
            this.scroll,
            this.focused,
            showLineNumbers,
            showScrollBars,
            wordWrap,
            gridBounds.lineCountWidth,
            padding,
            layoutChanged );
      }
    };

    this.appendControls = function ( elem ) {
      elem.appendChild( this.lineNumberToggler );
      elem.appendChild( this.wordWrapToggler );
      elem.appendChild( this.scrollBarToggler );
      elem.appendChild( this.operatingSystemSelect );
      elem.appendChild( this.keyboardSelect );
      elem.appendChild( this.commandSystemSelect );
      elem.appendChild( this.tokenizerSelect );
      elem.appendChild( this.themeSelect );
    };

    //////////////////////////////////////////////////////////////////////////
    // initialization
    /////////////////////////////////////////////////////////////////////////

    //
    // different browsers have different sets of keycodes for less-frequently
    // used keys like.
    browser = isChrome ? "CHROMIUM" : ( isFirefox ? "FIREFOX" : ( isIE ? "IE" : ( isOpera ? "OPERA" : ( isSafari ? "SAFARI" : "UNKNOWN" ) ) ) );

    this.readOnly = !!options.readOnly;

    if ( options.autoBindEvents || renderer.autoBindEvents ) {
      if ( !options.readOnly && options.keyEventSource === undefined ) {
        options.keyEventSource = this.DOMElement;
      }
      if ( options.pointerEventSource === undefined ) {
        options.pointerEventSource = this.DOMElement;
      }
      if ( options.wheelEventSource === undefined ) {
        options.wheelEventSource = this.DOMElement;
      }
    }

    this.wordWrap = !options.disableWordWrap;
    this.showLineNumbers = !options.hideLineNumbers;
    this.showScrollBars = !options.hideScrollBars;
    this.tabWidth = options.tabWidth;
    this.theme = options.theme;
    this.fontSize = options.fontSize || 16 * devicePixelRatio;
    this.tokenizer = options.tokenizer;
    this.codePage = options.codePage;
    this.operatingSystem = options.os;
    this.commandSystem = options.commands;
    this.value = options.file;
    this.padding = options.padding || 1;
    this.bindEvents(
        options.keyEventSource,
        options.pointerEventSource,
        options.wheelEventSource,
        !options.disableClipboard );

    this.lineNumberToggler = makeToggler( "primrose-line-number-toggler-" +
        renderer.id, !options.hideLineNumbers, "Line numbers",
        "showLineNumbers" );
    this.wordWrapToggler = makeToggler( "primrose-word-wrap-toggler-" +
        renderer.id, !options.disableWordWrap, "Line wrap", "wordWrap" );
    this.scrollBarToggler = makeToggler( "primrose-scrollbar-toggler-" +
        renderer.id, !options.hideScrollBars, "Scroll bars",
        "showScrollBars" );
    this.themeSelect = makeSelectorFromObj( "primrose-theme-selector-" +
        renderer.id, Primrose.Text.Themes, this.theme.name, self, "theme", "theme" );
    this.commandSystemSelect = makeSelectorFromObj(
        "primrose-command-system-selector-" + renderer.id, Primrose.Text.Commands,
        CommandSystem.name, self, "commandSystem",
        "Command system" );
    this.tokenizerSelect = makeSelectorFromObj(
        "primrose-tokenizer-selector-" +
        renderer.id, Primrose.Text.Grammars, this.tokenizer.name, self, "tokenizer",
        "Language syntax", Primrose.Text.Grammar );
    this.keyboardSelect = makeSelectorFromObj(
        "primrose-keyboard-selector-" +
        renderer.id, Primrose.Text.CodePages, this.codePage.name, self, "codePage",
        "Localization", Primrose.Text.CodePage );
    this.operatingSystemSelect = makeSelectorFromObj(
        "primrose-operating-system-selector-" + renderer.id,
        Primrose.Text.OperatingSystems, this.operatingSystem.name, self,
        "operatingSystem",
        "Shortcut style", Primrose.Text.OperatingSystem );
  }

  inherit( TextBox, Primrose.BaseControl );

  return TextBox;
} )();

pliny.issue( "Primrose.Text.Controls.TextBox", {
  name: "document TextBox",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Controls.TextBox](#Primrose_Text_Controls_TextBox)\n\
class in the controls/ directory."
} );

pliny.issue( "Primrose.Text.Controls.TextBox", {
  name: "TextBox does not render blank lines",
  type: "open",
  description: "If a line contains only a newline character, the line doesn't get\n\
rendered at all. The next line gets rendered instead, with the line number it *would*\n\
have had, had the blank line been rendered. Adding whitespace to the line causes\n\
it to render. This seems to only happen for text that is loaded into the textbox,\n\
not text that is entered by the keyboard."
} );

pliny.issue( "Primrose.Text.Controls.TextBox", {
  name: "TextBox should re-render only on updates, not require an animation loop.",
  type: "open",
  description: "Currently, the TextBox knows quite a bit about when it needs to\n\
update, but it doesn't use this information to actually kick off a render. It first\n\
requires us to ask it to render, and then it decides if it's time to render. Instead,\n\
the invalidation that causes it to decide to render should just kick off a render."
} );;/* global Primrose, pliny */

Primrose.Text.Grammars.Basic = ( function ( ) {

  pliny.value( "Primrose.Text.Grammars", {
    name: "Basic",
    description: "<under construction>"
  } );
  var basicGrammar = new Primrose.Text.Grammar( "BASIC",
      // Grammar rules are applied in the order they are specified.
          [
            // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.
            [ "newlines", /(?:\r\n|\r|\n)/ ],
            // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
            [ "lineNumbers", /^\d+\s+/ ],
            // Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
            [ "startLineComments", /^REM\s/ ],
            // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
            [ "strings", /"(?:\\"|[^"])*"/ ],
            [ "strings", /'(?:\\'|[^'])*'/ ],
            // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
            [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
            // Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
            [ "keywords",
              /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
            ],
            // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
            [ "keywords", /^DEF FN/ ],
            // These are all treated as mathematical operations.
            [ "operators",
              /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
            ],
            // Once everything else has been matched, the left over blocks of words are treated as variable and function names.
            [ "identifiers", /\w+\$?/ ]
          ] );

      var oldTokenize = basicGrammar.tokenize;
      basicGrammar.tokenize = function ( code ) {
        return oldTokenize.call( this, code.toUpperCase( ) );
      };

      basicGrammar.interpret = function ( sourceCode, input, output, errorOut, next,
          clearScreen, loadFile, done ) {
        var tokens = this.tokenize( sourceCode ),
            EQUAL_SIGN = new Primrose.Text.Token( "=", "operators" ),
            counter = 0,
            isDone = false,
            program = {},
            lineNumbers = [ ],
            currentLine = [ ],
            lines = [ currentLine ],
            data = [ ],
            returnStack = [ ],
            forLoopCounters = {},
            dataCounter = 0,
            state = {
              INT: function ( v ) {
                return v | 0;
              },
              RND: function ( ) {
                return Math.random( );
              },
              CLK: function ( ) {
                return Date.now( ) / 3600000;
              },
              LEN: function ( id ) {
                return id.length;
              },
              LINE: function ( ) {
                return lineNumbers[counter];
              },
              TAB: function ( v ) {
                var str = "";
                for ( var i = 0; i < v; ++i ) {
                  str += " ";
                }
                return str;
              },
              POW: function ( a, b ) {
                return Math.pow( a, b );
              }
            };

        function toNum ( ln ) {
          return new Primrose.Text.Token( ln.toString(), "numbers" );
        }

        function toStr ( str ) {
          return new Primrose.Text.Token( "\"" + str.replace( "\n", "\\n" )
              .replace( "\"", "\\\"" ) + "\"", "strings" );
        }

        var tokenMap = {
          "OR": "||",
          "AND": "&&",
          "NOT": "!",
          "MOD": "%",
          "<>": "!="
        };

        while ( tokens.length > 0 ) {
          var token = tokens.shift( );
          if ( token.type === "newlines" ) {
            currentLine = [ ];
            lines.push( currentLine );
          }
          else if ( token.type !== "regular" && token.type !== "comments" ) {
            token.value = tokenMap[token.value] || token.value;
            currentLine.push( token );
          }
        }

        for ( var i = 0; i < lines.length; ++i ) {
          var line = lines[i];
          if ( line.length > 0 ) {
            var lastLine = lineNumbers[lineNumbers.length - 1];
            var lineNumber = line.shift( );

            if ( lineNumber.type !== "lineNumbers" ) {
              line.unshift( lineNumber );

              if ( lastLine === undefined ) {
                lastLine = -1;
              }

              lineNumber = toNum( lastLine + 1 );
            }

            lineNumber = parseFloat( lineNumber.value );
            if ( lastLine && lineNumber <= lastLine ) {
              throw new Error( "expected line number greater than " + lastLine +
                  ", but received " + lineNumber + "." );
            }
            else if ( line.length > 0 ) {
              lineNumbers.push( lineNumber );
              program[lineNumber] = line;
            }
          }
        }


        function process ( line ) {
          if ( line && line.length > 0 ) {
            var op = line.shift( );
            if ( op ) {
              if ( commands.hasOwnProperty( op.value ) ) {
                return commands[op.value]( line );
              }
              else if ( !isNaN( op.value ) ) {
                return setProgramCounter( [ op ] );
              }
              else if ( state[op.value] ||
                  ( line.length > 0 && line[0].type === "operators" &&
                      line[0].value === "=" ) ) {
                line.unshift( op );
                return translate( line );
              }
              else {
                error( "Unknown command. >>> " + op.value );
              }
            }
          }
          return pauseBeforeComplete();
        }

        function error ( msg ) {
          errorOut( "At line " + lineNumbers[counter] + ": " + msg );
        }

        function getLine ( i ) {
          var lineNumber = lineNumbers[i];
          var line = program[lineNumber];
          return line && line.slice( );
        }

        function evaluate ( line ) {
          var script = "";
          for ( var i = 0; i < line.length; ++i ) {
            var t = line[i];
            var nest = 0;
            if ( t.type === "identifiers" &&
                typeof state[t.value] !== "function" &&
                i < line.length - 1 &&
                line[i + 1].value === "(" ) {
              for ( var j = i + 1; j < line.length; ++j ) {
                var t2 = line[j];
                if ( t2.value === "(" ) {
                  if ( nest === 0 ) {
                    t2.value = "[";
                  }
                  ++nest;
                }
                else if ( t2.value === ")" ) {
                  --nest;
                  if ( nest === 0 ) {
                    t2.value = "]";
                  }
                }
                else if ( t2.value === "," && nest === 1 ) {
                  t2.value = "][";
                }

                if ( nest === 0 ) {
                  break;
                }
              }
            }
            script += t.value;
          }
          with ( state ) { // jshint ignore:line
            try {
              return eval( script ); // jshint ignore:line
            }
            catch ( exp ) {
              console.debug( line.join( ", " ) );
              console.error( exp );
              console.error( script );
              error( exp.message + ": " + script );
            }
          }
        }

        function declareVariable ( line ) {
          var decl = [ ],
              decls = [ decl ],
              nest = 0,
              i;
          for ( i = 0; i < line.length; ++i ) {
            var t = line[i];
            if ( t.value === "(" ) {
              ++nest;
            }
            else if ( t.value === ")" ) {
              --nest;
            }
            if ( nest === 0 && t.value === "," ) {
              decl = [ ];
              decls.push( decl );
            }
            else {
              decl.push( t );
            }
          }
          for ( i = 0; i < decls.length; ++i ) {
            decl = decls[i];
            var id = decl.shift( );
            if ( id.type !== "identifiers" ) {
              error( "Identifier expected: " + id.value );
            }
            else {
              var val = null,
                  j;
              id = id.value;
              if ( decl[0].value === "(" && decl[decl.length - 1].value === ")" ) {
                var sizes = [ ];
                for ( j = 1; j < decl.length - 1; ++j ) {
                  if ( decl[j].type === "numbers" ) {
                    sizes.push( decl[j].value | 0 );
                  }
                }
                if ( sizes.length === 0 ) {
                  val = [ ];
                }
                else {
                  val = new Array( sizes[0] );
                  var queue = [ val ];
                  for ( j = 1; j < sizes.length; ++j ) {
                    var size = sizes[j];
                    for ( var k = 0,
                        l = queue.length; k < l; ++k ) {
                      var arr = queue.shift();
                      for ( var m = 0; m < arr.length; ++m ) {
                        arr[m] = new Array( size );
                        if ( j < sizes.length - 1 ) {
                          queue.push( arr[m] );
                        }
                      }
                    }
                  }
                }
              }
              state[id] = val;
              return true;
            }
          }
        }

        function print ( line ) {
          var endLine = "\n";
          var nest = 0;
          line = line.map( function ( t, i ) {
            t = t.clone();
            if ( t.type === "operators" ) {
              if ( t.value === "," ) {
                if ( nest === 0 ) {
                  t.value = "+ \", \" + ";
                }
              }
              else if ( t.value === ";" ) {
                t.value = "+ \" \"";
                if ( i < line.length - 1 ) {
                  t.value += " + ";
                }
                else {
                  endLine = "";
                }
              }
              else if ( t.value === "(" ) {
                ++nest;
              }
              else if ( t.value === ")" ) {
                --nest;
              }
            }
            return t;
          } );
          var txt = evaluate( line );
          if ( txt === undefined ) {
            txt = "";
          }
          output( txt + endLine );
          return true;
        }

        function setProgramCounter ( line ) {
          var lineNumber = parseFloat( evaluate( line ) );
          counter = -1;
          while ( counter < lineNumbers.length - 1 &&
              lineNumbers[counter + 1] < lineNumber ) {
            ++counter;
          }

          return true;
        }

        function checkConditional ( line ) {
          var thenIndex = -1,
              elseIndex = -1,
              i;
          for ( i = 0; i < line.length; ++i ) {
            if ( line[i].type === "keywords" && line[i].value === "THEN" ) {
              thenIndex = i;
            }
            else if ( line[i].type === "keywords" && line[i].value === "ELSE" ) {
              elseIndex = i;
            }
          }
          if ( thenIndex === -1 ) {
            error( "Expected THEN clause." );
          }
          else {
            var condition = line.slice( 0, thenIndex );
            for ( i = 0; i < condition.length; ++i ) {
              var t = condition[i];
              if ( t.type === "operators" && t.value === "=" ) {
                t.value = "==";
              }
            }
            var thenClause,
                elseClause;
            if ( elseIndex === -1 ) {
              thenClause = line.slice( thenIndex + 1 );
            }
            else {
              thenClause = line.slice( thenIndex + 1, elseIndex );
              elseClause = line.slice( elseIndex + 1 );
            }
            if ( evaluate( condition ) ) {
              return process( thenClause );
            }
            else if ( elseClause ) {
              return process( elseClause );
            }
          }

          return true;
        }

        function pauseBeforeComplete () {
          output( "PROGRAM COMPLETE - PRESS RETURN TO FINISH." );
          input( function ( ) {
            isDone = true;
            if ( done ) {
              done( );
            }
          } );
          return false;
        }

        function labelLine ( line ) {
          line.push( EQUAL_SIGN );
          line.push( toNum( lineNumbers[counter] ) );
          return translate( line );
        }

        function waitForInput ( line ) {
          var toVar = line.pop();
          if ( line.length > 0 ) {
            print( line );
          }
          input( function ( str ) {
            str = str.toUpperCase();
            var valueToken = null;
            if ( !isNaN( str ) ) {
              valueToken = toNum( str );
            }
            else {
              valueToken = toStr( str );
            }
            evaluate( [ toVar, EQUAL_SIGN, valueToken ] );
            if ( next ) {
              next( );
            }
          } );
          return false;
        }

        function onStatement ( line ) {
          var idxExpr = [ ],
              idx = null,
              targets = [ ];
          try {
            while ( line.length > 0 &&
                ( line[0].type !== "keywords" ||
                    line[0].value !== "GOTO" ) ) {
              idxExpr.push( line.shift( ) );
            }

            if ( line.length > 0 ) {
              line.shift( ); // burn the goto;

              for ( var i = 0; i < line.length; ++i ) {
                var t = line[i];
                if ( t.type !== "operators" ||
                    t.value !== "," ) {
                  targets.push( t );
                }
              }

              idx = evaluate( idxExpr ) - 1;

              if ( 0 <= idx && idx < targets.length ) {
                return setProgramCounter( [ targets[idx] ] );
              }
            }
          }
          catch ( exp ) {
            console.error( exp );
          }
          return true;
        }

        function gotoSubroutine ( line ) {
          returnStack.push( toNum( lineNumbers[counter + 1] ) );
          return setProgramCounter( line );
        }

        function setRepeat ( ) {
          returnStack.push( toNum( lineNumbers[counter] ) );
          return true;
        }

        function conditionalReturn ( cond ) {
          var ret = true;
          var val = returnStack.pop();
          if ( val && cond ) {
            ret = setProgramCounter( [ val ] );
          }
          return ret;
        }

        function untilLoop ( line ) {
          var cond = !evaluate( line );
          return conditionalReturn( cond );
        }

        function findNext ( str ) {
          for ( i = counter + 1; i < lineNumbers.length; ++i ) {
            var l = getLine( i );
            if ( l[0].value === str ) {
              return i;
            }
          }
          return lineNumbers.length;
        }

        function whileLoop ( line ) {
          var cond = evaluate( line );
          if ( !cond ) {
            counter = findNext( "WEND" );
          }
          else {
            returnStack.push( toNum( lineNumbers[counter] ) );
          }
          return true;
        }

        var FOR_LOOP_DELIMS = [ "=", "TO", "STEP" ];

        function forLoop ( line ) {
          var n = lineNumbers[counter];
          var varExpr = [ ];
          var fromExpr = [ ];
          var toExpr = [ ];
          var skipExpr = [ ];
          var arrs = [ varExpr, fromExpr, toExpr, skipExpr ];
          var a = 0;
          var i = 0;
          for ( i = 0; i < line.length; ++i ) {
            var t = line[i];
            if ( t.value === FOR_LOOP_DELIMS[a] ) {
              if ( a === 0 ) {
                varExpr.push( t );
              }
              ++a;
            }
            else {
              arrs[a].push( t );
            }
          }

          var skip = 1;
          if ( skipExpr.length > 0 ) {
            skip = evaluate( skipExpr );
          }

          if ( forLoopCounters[n] === undefined ) {
            forLoopCounters[n] = evaluate( fromExpr );
          }

          var end = evaluate( toExpr );
          var cond = forLoopCounters[n] <= end;
          if ( !cond ) {
            delete forLoopCounters[n];
            counter = findNext( "NEXT" );
          }
          else {
            varExpr.push( toNum( forLoopCounters[n] ) );
            process( varExpr );
            forLoopCounters[n] += skip;
            returnStack.push( toNum( lineNumbers[counter] ) );
          }
          return true;
        }

        function stackReturn ( ) {
          return conditionalReturn( true );
        }

        function loadCodeFile ( line ) {
          loadFile( evaluate( line ), function ( ) {
            if ( next ) {
              next( );
            }
          } );
          return false;
        }

        function noop ( ) {
          return true;
        }

        function loadData ( line ) {
          while ( line.length > 0 ) {
            var t = line.shift();
            if ( t.type !== "operators" ) {
              data.push( t.value );
            }
          }
          return true;
        }

        function readData ( line ) {
          if ( data.length === 0 ) {
            var dataLine = findNext( "DATA" );
            process( getLine( dataLine ) );
          }
          var value = data[dataCounter];
          ++dataCounter;
          line.push( EQUAL_SIGN );
          line.push( toNum( value ) );
          return translate( line );
        }

        function restoreData () {
          dataCounter = 0;
          return true;
        }

        function defineFunction ( line ) {
          var name = line.shift().value;
          var signature = "";
          var body = "";
          var fillSig = true;
          for ( var i = 0; i < line.length; ++i ) {
            var t = line[i];
            if ( t.type === "operators" && t.value === "=" ) {
              fillSig = false;
            }
            else if ( fillSig ) {
              signature += t.value;
            }
            else {
              body += t.value;
            }
          }
          name = "FN" + name;
          var script = "(function " + name + signature + "{ return " + body +
              "; })";
          state[name] = eval( script ); // jshint ignore:line
          return true;
        }

        function translate ( line ) {
          evaluate( line );
          return true;
        }

        var commands = {
          DIM: declareVariable,
          LET: translate,
          PRINT: print,
          GOTO: setProgramCounter,
          IF: checkConditional,
          INPUT: waitForInput,
          END: pauseBeforeComplete,
          STOP: pauseBeforeComplete,
          REM: noop,
          "'": noop,
          CLS: clearScreen,
          ON: onStatement,
          GOSUB: gotoSubroutine,
          RETURN: stackReturn,
          LOAD: loadCodeFile,
          DATA: loadData,
          READ: readData,
          RESTORE: restoreData,
          REPEAT: setRepeat,
          UNTIL: untilLoop,
          "DEF FN": defineFunction,
          WHILE: whileLoop,
          WEND: stackReturn,
          FOR: forLoop,
          NEXT: stackReturn,
          LABEL: labelLine
        };

        return function ( ) {
          if ( !isDone ) {
            var goNext = true;
            while ( goNext ) {
              var line = getLine( counter );
              goNext = process( line );
              ++counter;
            }
          }
        };
      };
      return basicGrammar;
    } )( );

pliny.issue( "Primrose.Text.Grammars.Basic", {
  name: "document Basic",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Grammars.Basic](#Primrose_Text_Grammars_Basic) class in the grammars/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.Grammars.JavaScript = ( function () {
  "use strict";

  pliny.value( "Primrose.Text.Grammars", {
    name: "JavaScript",
    description: "<under construction>"
  } );
  return new Primrose.Text.Grammar( "JavaScript", [
    [ "newlines", /(?:\r\n|\r|\n)/ ],
    [ "startBlockComments", /\/\*/ ],
    [ "endBlockComments", /\*\// ],
    [ "regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/ ],
    [ "stringDelim", /("|')/ ],
    [ "startLineComments", /\/\/.*$/m ],
    [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
    [ "keywords",
      /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
    ],
    [ "functions", /(\w+)(?:\s*\()/ ],
    [ "members", /(\w+)\./ ],
    [ "members", /((\w+\.)+)(\w+)/ ]
  ] );
} )();

pliny.issue( "Primrose.Text.Grammars.JavaScript", {
  name: "document JavaScript",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Grammars.JavaScript](#Primrose_Text_Grammars_JavaScript) class in the grammars/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.Grammars.PlainText = (function () {
  "use strict";

  pliny.value( "Primrose.Text.Grammars", {
    name: "PlainText",
    description: "<under construction>"
  } );
  return new Primrose.Text.Grammar("PlainText", [
    ["newlines", /(?:\r\n|\r|\n)/]
  ]);
})();

pliny.issue( "Primrose.Text.Grammars.PlainText", {
  name: "document PlainText",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Grammars.PlainText](#Primrose_Text_Grammars_PlainText) class in the grammars/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.Grammars.TestResults = (function () {
  "use strict";

  pliny.value( "Primrose.Text.Grammars", {
    name: "TestResults",
    description: "<under construction>"
  } );
  return new Primrose.Text.Grammar("TestResults", [
    ["newlines", /(?:\r\n|\r|\n)/, true],
    ["numbers", /(\[)(o+)/, true],
    ["numbers", /(\d+ succeeded), 0 failed/, true],
    ["numbers", /^    Successes:/, true],
    ["functions", /(x+)\]/, true],
    ["functions", /[1-9]\d* failed/, true],
    ["functions", /^    Failures:/, true],
    ["comments", /(\d+ms:)(.*)/, true],
    ["keywords", /(Test results for )(\w+):/, true],
    ["strings", /        \w+/, true]
  ]);
})();

pliny.issue( "Primrose.Text.Grammars.TestResults", {
  name: "document TestResults",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Grammars.TestResults](#Primrose_Text_Grammars_TestResults) class in the grammars/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.OperatingSystems.OSX = ( function () {
  "use strict";

  pliny.value( "Primrose.Text.OperatingSystems", {
    name: "OSX",
    description: "<under construction>"
  } );
  return new Primrose.Text.OperatingSystem(
      "OS X", "META", "ALT", "METASHIFT_z",
      "META", "LEFTARROW", "RIGHTARROW",
      "META", "UPARROW", "DOWNARROW" );
} )();

pliny.issue( "Primrose.Text.OperatingSystems.OSX", {
  name: "document OSX",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.OperatingSystems.OSX](#Primrose_Text_OperatingSystems_OSX) class in the operating_systems/ directory"
} );
;/* global Primrose, pliny */

////
// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
///
Primrose.Text.OperatingSystems.Windows = (function () {
  "use strict";

  pliny.value( "Primrose.Text.OperatingSystems", {
    name: "OSX",
    description: "<under construction>"
  } );
  return new Primrose.Text.OperatingSystem(
      "Windows", "CTRL", "CTRL", "CTRL_y",
      "", "HOME", "END",
      "CTRL", "HOME", "END");
})();

pliny.issue( "Primrose.Text.OperatingSystems.Windows", {
  name: "document Windows",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.OperatingSystems.Windows](#Primrose_Text_OperatingSystems_Windows) class in the operating_systems/ directory"
} );
;/*global THREE, qp, Primrose,  devicePixelRatio, HTMLCanvasElement, pliny */

Primrose.Text.Renderers.Canvas = ( function ( ) {
  "use strict";

  pliny.class( "Primrose.Text.Renderers", {
    name: "Canvas",
    description: "<under construction>"
  } );
  function Canvas ( canvasElementOrID, options ) {
    var self = this,
        canvas = Primrose.DOM.cascadeElement( canvasElementOrID, "canvas", HTMLCanvasElement ),
        bgCanvas = Primrose.DOM.cascadeElement( canvas.id + "-back", "canvas", HTMLCanvasElement ),
        fgCanvas = Primrose.DOM.cascadeElement( canvas.id + "-front", "canvas", HTMLCanvasElement ),
        trimCanvas = Primrose.DOM.cascadeElement( canvas.id + "-trim", "canvas", HTMLCanvasElement ),
        gfx = canvas.getContext( "2d" ),
        fgfx = fgCanvas.getContext( "2d" ),
        bgfx = bgCanvas.getContext( "2d" ),
        tgfx = trimCanvas.getContext( "2d" ),
        theme = null,
        txt = null,
        strictSize = options.size,
        rowCache = {},
        lastFocused = false,
        lastFrontCursorI = -1,
        lastBackCursorI = -1,
        lastWidth = -1,
        lastHeight = -1,
        lastScrollX = -1,
        lastScrollY = -1,
        lastFont = null;

    canvas.style.imageRendering =
        bgCanvas.style.imageRendering =
        fgCanvas.style.imageRendering =
        trimCanvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";

    gfx.imageSmoothingEnabled =
        tgfx.imageSmoothingEnabled =
        bgfx.imageSmoothingEnabled =
        tgfx.imageSmoothingEnabled = false;

    this.VSCROLL_WIDTH = 2;

    this.character = new Primrose.Text.Size();
    this.id = canvas.id;
    this.autoBindEvents = true;

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      var x = point.x * canvas.width / canvas.clientWidth;
      var y = point.y * canvas.height / canvas.clientHeight;
      point.set(
          Math.round( x / this.character.width ) + scroll.x - gridBounds.x,
          Math.floor( ( y / this.character.height ) - 0.25 ) + scroll.y );
    };

    this.resize = function () {
      if ( theme ) {
        this.character.height = theme.fontSize;
        gfx.font = this.character.height + "px " + theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;

        if ( ( lastWidth !== this.elementWidth || lastHeight !== this.elementHeight ) && this.elementWidth > 0 && this.elementHeight > 0 ) {
          lastWidth =
              bgCanvas.width =
              fgCanvas.width =
              trimCanvas.width =
              canvas.width = this.elementWidth;
          lastHeight =
              bgCanvas.height =
              fgCanvas.height =
              trimCanvas.height =
              canvas.height = this.elementHeight;
        }
      }
    };

    this.setSize = function ( w, h ) {
      canvas.style.width = Math.round(w) + "px";
      canvas.style.height = Math.round(h) + "px";
      return this.resize();
    };

    Object.defineProperties( this, {
      elementWidth: {
        get: function () {
          return ( strictSize && strictSize.width ) || ( canvas.clientWidth * devicePixelRatio );
        }
      },
      elementHeight: {
        get: function () {
          return ( strictSize && strictSize.height ) || ( canvas.clientHeight * devicePixelRatio );
        }
      },
      width: {
        get: function () {
          return canvas.width;
        }
      },
      height: {
        get: function () {
          return canvas.height;
        }
      },
      resized: {
        get: function () {
          return this.width !== this.elementWidth || this.height !== this.elementHeight;
        }
      },
      theme: {
        set: function ( t ) {
          theme = t;
          this.resize();
        }
      },
      DOMElement: {
        get: function () {
          return canvas;
        }
      },
      texture: {
        get: function (  ) {
          if ( typeof window.THREE !== "undefined" && !txt ) {
            txt = new THREE.Texture( canvas );
            txt.needsUpdate = true;
          }
          return txt;
        }
      }
    } );

    this.mapUV = function ( point ) {
      if ( point ) {
        return {
          x: Math.floor( canvas.width * point[0] ),
          y: Math.floor( canvas.height * ( 1 - point[1] ) )
        };
      }
    };

    function fillRect ( gfx, fill, x, y, w, h ) {
      gfx.fillStyle = fill;
      gfx.fillRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function strokeRect ( gfx, stroke, x, y, w, h ) {
      gfx.strokeStyle = stroke;
      gfx.strokeRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function renderCanvasBackground ( tokenRows, gridBounds, padding, scroll, frontCursor, backCursor, focused ) {
      var minCursor = Primrose.Text.Cursor.min( frontCursor, backCursor ),
          maxCursor = Primrose.Text.Cursor.max( frontCursor, backCursor ),
          tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";

      if ( theme.regular.backColor ) {
        bgfx.fillStyle = theme.regular.backColor;
      }

      bgfx[clearFunc]( 0, 0, canvas.width, canvas.height );
      bgfx.save();
      bgfx.translate(
          ( gridBounds.x - scroll.x ) * self.character.width + padding,
          -scroll.y * self.character.height + padding );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            Primrose.Text.Themes.Default.regular.currentRowBackColor,
            0, minCursor.y,
            gridBounds.width,
            maxCursor.y - minCursor.y + 1 );
      }

      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];

        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i <
                maxCursor.i;
            if ( inSelection ) {
              var selectionFront = Primrose.Text.Cursor.max( minCursor,
                  tokenFront );
              var selectionBack = Primrose.Text.Cursor.min( maxCursor, tokenBack );
              var cw = selectionBack.i - selectionFront.i;
              fillRect( bgfx, theme.regular.selectedBackColor ||
                  Primrose.Text.Themes.Default.regular.selectedBackColor,
                  selectionFront.x, selectionFront.y,
                  cw, 1 );
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }

      // draw the cursor caret
      if ( focused ) {
        var cc = theme.cursorColor || "black";
        var w = 1 / self.character.width;
        fillRect( bgfx, cc, minCursor.x, minCursor.y, w, 1 );
        fillRect( bgfx, cc, maxCursor.x, maxCursor.y, w, 1 );
      }
      bgfx.restore();
    }

    function renderCanvasForeground ( tokenRows, gridBounds, padding, scroll, lines ) {
      var tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          lineOffsetY = Math.ceil( self.character.height * 0.2 ),
          i;

      fgfx.clearRect( 0, 0, canvas.width, canvas.height );
      fgfx.save();
      fgfx.translate(
          ( gridBounds.x - scroll.x ) * self.character.width + padding,
          padding );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var line = lines[y] + padding,
            row = tokenRows[y],
            drawn = false,
            textY = ( y + 0.8 - scroll.y ) * self.character.height,
            imageY = ( y - scroll.y - 0.2 ) * self.character.height + lineOffsetY;

        for ( i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {

            // draw the text
            if ( rowCache[line] !== undefined ) {
              if ( i === 0 ) {
                fgfx.putImageData( rowCache[line], padding, imageY + padding );
              }
            }
            else {
              var style = theme[t.type] || {};
              var font = ( style.fontWeight || theme.regular.fontWeight || "" ) +
                  " " + ( style.fontStyle || theme.regular.fontStyle || "" ) +
                  " " + self.character.height + "px " + theme.fontFamily;
              fgfx.font = font.trim();
              fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
              fgfx.fillText(
                  t.value,
                  tokenFront.x * self.character.width,
                  textY );
              drawn = true;
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
        if ( drawn && rowCache[line] === undefined ) {
          rowCache[line] = fgfx.getImageData(
              padding,
              imageY + padding,
              fgCanvas.width - 2 * padding,
              self.character.height );
        }
      }
      fgfx.restore();
    }

    function renderCanvasTrim ( tokenRows, gridBounds, padding, scroll, showLineNumbers, showScrollBars, wordWrap, lineCountWidth, focused ) {

      var tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          maxLineWidth = 0,
          i;

      tgfx.clearRect( 0, 0, canvas.width, canvas.height );
      tgfx.save();
      tgfx.translate( padding, padding );
      tgfx.save();
      tgfx.lineWidth = 2;
      tgfx.translate( 0, -scroll.y * self.character.height );
      for ( var y = 0, lastLine = -1; y < tokenRows.length; ++y ) {
        var row = tokenRows[y];

        for ( i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;
          tokenFront.copy( tokenBack );
        }

        maxLineWidth = Math.max( maxLineWidth, tokenBack.x );
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );

        if ( showLineNumbers && scroll.y <= y && y < scroll.y + gridBounds.height ) {
          // draw the tokens on this row
          // be able to draw brand-new rows that don't have any tokens yet
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while ( lineNumber.length < lineCountWidth ) {
            lineNumber = " " + lineNumber;
          }
          fillRect( tgfx,
              theme.regular.selectedBackColor ||
              Primrose.Text.Themes.Default.regular.selectedBackColor,
              0, y,
              gridBounds.x, 1 );
          tgfx.font = "bold " + self.character.height + "px " +
              theme.fontFamily;

          if ( currentLine > lastLine ) {
            tgfx.fillStyle = theme.regular.foreColor;
            tgfx.fillText(
                lineNumber,
                0, ( y + 0.8 ) * self.character.height );
          }
          lastLine = currentLine;
        }
      }

      tgfx.restore();

      if ( showLineNumbers ) {
        strokeRect( tgfx,
            theme.regular.foreColor ||
            Primrose.Text.Themes.Default.regular.foreColor,
            0, 0,
            gridBounds.x, gridBounds.height );
      }

      // draw the scrollbars
      if ( showScrollBars ) {
        var drawWidth = gridBounds.width * self.character.width - padding,
            drawHeight = gridBounds.height * self.character.height,
            scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x * self.character.width,
            scrollY = ( scroll.y * drawHeight ) / tokenRows.length;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            Primrose.Text.Themes.Default.regular.selectedBackColor;
        // horizontal
        var bw;
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth ),
              by = gridBounds.height * self.character.height;
          bw = Math.max( self.character.width, scrollBarWidth );
          tgfx.fillRect( scrollX, by, bw, self.character.height );
          tgfx.strokeRect( scrollX, by, bw, self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height / tokenRows.length ),
              bx = canvas.width - self.VSCROLL_WIDTH * self.character.width - 2 * padding,
              bh = Math.max( self.character.height, scrollBarHeight );
          bw = self.VSCROLL_WIDTH * self.character.width;
          tgfx.fillRect( bx, scrollY, bw, bh );
          tgfx.strokeRect( bx, scrollY, bw, bh );
        }
      }

      strokeRect( tgfx,
          theme.regular.foreColor ||
          Primrose.Text.Themes.Default.regular.foreColor,
          gridBounds.x,
          0,
          gridBounds.width,
          gridBounds.height );
      tgfx.strokeRect( 0, 0, canvas.width - 2 * padding, canvas.height - 2 * padding );
      tgfx.restore();
      if ( !focused ) {
        tgfx.fillStyle = theme.regular.unfocused || Primrose.Text.Themes.Default.regular.unfocused;
        tgfx.fillRect( 0, 0, canvas.width, canvas.height );
      }
    }

    this.render = function ( tokenRows, lines,
        frontCursor, backCursor,
        gridBounds,
        scroll,
        focused, showLineNumbers, showScrollBars, wordWrap,
        lineCountWidth,
        padding,
        layoutChanged ) {
      if ( theme ) {
        var cursorChanged = frontCursor.i !== lastFrontCursorI || lastBackCursorI !== backCursor.i,
            scrollChanged = scroll.x !== lastScrollX || scroll.y !== lastScrollY,
            fontChanged = gfx.font !== lastFont,
            focusChanged = focused !== lastFocused;

        lastFrontCursorI = frontCursor.i;
        lastBackCursorI = backCursor.i;
        lastFocused = focused;
        lastFont = gfx.font;
        lastScrollX = scroll.x;
        lastScrollY = scroll.y;

        if ( layoutChanged ) {
          rowCache = {};
          if ( this.resized ) {
            this.resize();
          }
        }

        var foregroundChanged = layoutChanged || fontChanged || scrollChanged,
            backgroundChanged = foregroundChanged || focusChanged || cursorChanged;

        if ( foregroundChanged || backgroundChanged ) {
          renderCanvasBackground( tokenRows, gridBounds, padding, scroll, frontCursor, backCursor, focused );

          if ( foregroundChanged || focusChanged ) {
            if ( foregroundChanged ) {
              renderCanvasForeground( tokenRows, gridBounds, padding, scroll, lines );
            }
            renderCanvasTrim( tokenRows, gridBounds, padding, scroll, showLineNumbers, showScrollBars, wordWrap, lineCountWidth, focused );
          }

          gfx.clearRect( 0, 0, canvas.width, canvas.height );
          gfx.drawImage( bgCanvas, 0, 0 );
          gfx.drawImage( fgCanvas, 0, 0 );
          gfx.drawImage( trimCanvas, 0, 0 );

          if ( txt ) {
            txt.needsUpdate = true;
          }
        }
      }
    };

    if ( !( canvasElementOrID instanceof window.HTMLCanvasElement ) && strictSize ) {
      canvas.style.position = "absolute";
      canvas.style.width = strictSize.width;
      canvas.style.height = strictSize.height;
    }

    if ( !canvas.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( Primrose.DOM.makeHidingContainer(
          "primrose-container-" +
          canvas.id, canvas ) );
    }
  }

  return Canvas;
} )();

pliny.issue( "Primrose.Text.Renderers.Canvas", {
  name: "document Canvas",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Renderers.Canvas](#Primrose_Text_Renderers_Canvas) class in the renderers/ directory"
} );
;/*global THREE, qp, Primrose, HTMLDivElement, pliny */

Primrose.Text.Renderers.DOM = ( function ( ) {
  "use strict";

  var Size = Primrose.Text.Size,
      Cursor = Primrose.Text.Cursor,
      defaultTheme = Primrose.Text.Themes.Default;

  function FakeContext ( target ) {
    var self = this;
    this.font = null;
    this.fillStyle = null;
    var translate = [ new Point() ];

    function setFont ( elem ) {
      elem.style.font = self.font;
      elem.style.lineHeight = px( parseInt( self.font, 10 ) );
      elem.style.padding = "0";
      elem.style.margin = "0";
    }

    this.measureText = function ( txt ) {
      var tester = document.createElement( "div" );
      setFont( tester );
      tester.style.position = "absolute";
      tester.style.visibility = "hidden";
      tester.innerHTML = txt;
      document.body.appendChild( tester );
      var size = new Size( tester.clientWidth, tester.clientHeight );
      document.body.removeChild( tester );
      return size;
    };

    this.clearRect = function () {
      target.innerHTML = "";
    };

    this.drawImage = function ( img, x, y ) {
      var top = translate[translate.length - 1];
      img.style.position = "absolute";
      img.style.left = px( x + top.x );
      img.style.top = px( y + top.y );
      target.appendChild( img );
    };

    this.fillRect = function ( x, y, w, h ) {
      var top = translate[translate.length - 1];
      var box = document.createElement( "div" );
      box.style.position = "absolute";
      box.style.left = px( x + top.x );
      box.style.top = px( y + top.y );
      box.style.width = px( w );
      box.style.height = px( h );
      box.style.backgroundColor = this.fillStyle;
      target.appendChild( box );
    };

    this.fillText = function ( str, x, y ) {
      var top = translate[translate.length - 1];
      var box = document.createElement( "span" );
      box.style.position = "absolute";
      box.style.left = px( x + top.x );
      box.style.top = px( y + top.y );
      box.style.whiteSpace = "pre";
      setFont( box );
      box.style.color = this.fillStyle;
      box.appendChild( document.createTextNode( str ) );
      target.appendChild( box );
    };

    this.save = function () {
      var top = translate[translate.length - 1];
      translate.push( top.clone() );
    };

    this.restore = function () {
      translate.pop();
    };

    this.translate = function ( x, y ) {
      var top = translate[translate.length - 1];
      top.x += x;
      top.y += y;
    };
  }

  window.HTMLDivElement.prototype.getContext = function ( type ) {
    if ( type !== "2d" ) {
      throw new Exception( "type parameter needs to be '2d'." );
    }
    this.style.width = pct( 100 );
    this.style.height = pct( 100 );
    return new FakeContext( this );
  };

  pliny.class( "Primrose.Text.Renderers", {
    name: "DOM",
    description: "<under construction>"
  } );
  return function ( domElementOrID, options ) {
    var self = this,
        div = Primrose.DOM.cascadeElement( domElementOrID, "div", HTMLDivElement ),
        bgDiv = Primrose.DOM.cascadeElement( div.id + "-back", "div", HTMLDivElement ),
        fgDiv = Primrose.DOM.cascadeElement( div.id + "-front", "div", HTMLDivElement ),
        trimDiv = Primrose.DOM.cascadeElement( div.id + "-trim", "div", HTMLDivElement ),
        gfx = div.getContext( "2d" ),
        fgfx = fgDiv.getContext( "2d" ),
        bgfx = bgDiv.getContext( "2d" ),
        tgfx = trimDiv.getContext( "2d" ),
        theme = null,
        oldWidth = null,
        oldHeight = null;

    this.VSCROLL_WIDTH = 2;

    this.character = new Size();
    this.id = div.id;
    this.autoBindEvents = true;

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      point.set(
          Math.round( point.x / this.character.width ) + scroll.x -
          gridBounds.x,
          Math.floor( ( point.y / this.character.height ) - 0.25 ) +
          scroll.y );
    };

    this.resize = function () {
      var changed = false;
      if ( theme ) {
        var oldCharacterWidth = this.character.width,
            oldCharacterHeight = this.character.height,
            newWidth = div.clientWidth,
            newHeight = div.clientHeight,
            oldFont = gfx.font;
        this.character.height = theme.fontSize;
        gfx.font = px( this.character.height ) + " " + theme.fontFamily;

        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;
        changed = oldCharacterWidth !== this.character.width ||
            oldCharacterHeight !== this.character.height ||
            oldFont !== gfx.font;

        if ( newWidth > 0 && newHeight > 0 ) {
          bgDiv.width =
              fgDiv.width =
              trimDiv.width = newWidth;
          bgDiv.height =
              fgDiv.height =
              trimDiv.height = newHeight;

          changed = changed ||
              oldWidth !== newWidth ||
              oldHeight !== newWidth;

          oldWidth = newWidth;
          oldHeight = newHeight;
        }
      }
      return changed;
    };

    this.setSize = function ( w, h ) {
      div.style.width = px( w );
      div.style.height = px( h );
      return this.resize();
    };

    Object.defineProperties( {
      width: {
        get: function () {
          return oldWidth;
        }
      },
      height: {
        get: function () {
          return oldHeight;
        }
      },
      resized: {
        get: function () {
          var newWidth = div.clientWidth,
              newHeight = div.clientHeight;
          return oldWidth !== newWidth || oldHeight !== newHeight;
        }
      },
      theme: {
        set: function ( t ) {
          theme = t;
          this.resize();
        }
      },
      DOMElement: {
        get: function () {
          return div;
        }
      }
    } );

    function fillRect ( gfx, fill, x, y, w, h ) {
      gfx.fillStyle = fill;
      gfx.fillRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function renderCanvasBackground ( tokenRows, frontCursor, backCursor,
        gridBounds, scroll, focused ) {
      var minCursor = Cursor.min( frontCursor, backCursor ),
          maxCursor = Cursor.max( frontCursor, backCursor ),
          tokenFront = new Cursor(),
          tokenBack = new Cursor();

      if ( theme.regular.backColor ) {
        bgfx.fillStyle = theme.regular.backColor;
        bgDiv.style.backgroundColor = theme.regular.backColor;
      }

      bgfx.clearRect( 0, 0, oldWidth, oldHeight );
      bgfx.save();
      bgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            defaultTheme.regular.currentRowBackColor,
            0, minCursor.y + 0.2,
            gridBounds.width, maxCursor.y - minCursor.y + 1 );
      }

      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];

        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i <
                maxCursor.i;
            if ( inSelection ) {
              var selectionFront = Cursor.max( minCursor, tokenFront );
              var selectionBack = Cursor.min( maxCursor, tokenBack );
              var cw = selectionBack.i - selectionFront.i;
              fillRect( bgfx, theme.regular.selectedBackColor ||
                  defaultTheme.regular.selectedBackColor,
                  selectionFront.x, selectionFront.y + 0.2,
                  cw, 1 );
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }

      // draw the cursor caret
      if ( focused ) {
        var cc = theme.cursorColor || "black";
        var w = 1 / self.character.width;
        fillRect( bgfx, cc, minCursor.x, minCursor.y, w, 1 );
        fillRect( bgfx, cc, maxCursor.x, maxCursor.y, w, 1 );
      }
      bgfx.restore();
    }

    function renderCanvasForeground ( tokenRows, gridBounds, scroll ) {
      var tokenFront = new Cursor(),
          tokenBack = new Cursor(),
          maxLineWidth = 0;

      fgfx.clearRect( 0, 0, oldWidth, oldHeight );
      fgfx.save();
      fgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];
        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {

            // draw the text
            var style = theme[t.type] || {};
            var font = ( style.fontWeight || theme.regular.fontWeight || "" ) +
                " " + ( style.fontStyle || theme.regular.fontStyle || "" ) +
                " " + self.character.height + "px " + theme.fontFamily;
            fgfx.font = font.trim();
            fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
            fgfx.fillText(
                t.value,
                tokenFront.x * self.character.width,
                y * self.character.height );
          }

          tokenFront.copy( tokenBack );
        }

        maxLineWidth = Math.max( maxLineWidth, tokenBack.x );
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }
      fgfx.restore();
      return maxLineWidth;
    }

    function renderCanvasTrim ( tokenRows, gridBounds, scroll, showLineNumbers,
        showScrollBars, wordWrap, lineCountWidth, maxLineWidth ) {
      tgfx.clearRect( 0, 0, oldWidth, oldHeight );
      tgfx.save();
      tgfx.translate( 0, -scroll.y * self.character.height );
      if ( showLineNumbers ) {
        for ( var y = scroll.y,
            lastLine = -1; y < scroll.y + gridBounds.height && y <
            tokenRows.length; ++y ) {
          // draw the tokens on this row
          var row = tokenRows[y];
          // be able to draw brand-new rows that don't have any tokens yet
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while ( lineNumber.length < lineCountWidth ) {
            lineNumber = " " + lineNumber;
          }
          fillRect( tgfx,
              theme.regular.selectedBackColor ||
              defaultTheme.regular.selectedBackColor,
              0, y + 0.2,
              gridBounds.x, 1 );
          tgfx.font = "bold " + self.character.height + "px " +
              theme.fontFamily;

          if ( currentLine > lastLine ) {
            tgfx.fillStyle = theme.regular.foreColor;
            tgfx.fillText(
                lineNumber,
                0, y * self.character.height );
          }
          lastLine = currentLine;
        }
      }

      tgfx.restore();

      // draw the scrollbars
      if ( showScrollBars ) {
        var drawWidth = gridBounds.width * self.character.width;
        var drawHeight = gridBounds.height * self.character.height;
        var scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x *
            self.character.width;
        var scrollY = ( scroll.y * drawHeight ) / tokenRows.length +
            gridBounds.y * self.character.height;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            defaultTheme.regular.selectedBackColor;
        // horizontal
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth );
          tgfx.fillRect(
              scrollX,
              ( gridBounds.height + 0.25 ) * self.character.height,
              Math.max( self.character.width, scrollBarWidth ),
              self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height /
              tokenRows.length );
          tgfx.fillRect(
              oldWidth - self.VSCROLL_WIDTH * self.character.width,
              scrollY,
              self.VSCROLL_WIDTH * self.character.width,
              Math.max( self.character.height, scrollBarHeight ) );
        }
      }
    }

    this.render = function ( tokenRows, lines,
        frontCursor, backCursor,
        gridBounds,
        scroll,
        focused, showLineNumbers, showScrollBars, wordWrap,
        lineCountWidth ) {
      var maxLineWidth = 0;

      renderCanvasBackground( tokenRows, frontCursor, backCursor, gridBounds,
          scroll, focused );
      maxLineWidth = renderCanvasForeground( tokenRows, gridBounds, scroll );
      renderCanvasTrim( tokenRows, gridBounds, scroll, showLineNumbers,
          showScrollBars, wordWrap, lineCountWidth, maxLineWidth );

      gfx.clearRect( 0, 0, oldWidth, oldHeight );
      gfx.drawImage( bgDiv, 0, 0 );
      gfx.drawImage( fgDiv, 0, 0 );
      gfx.drawImage( trimDiv, 0, 0 );
    };

    if ( !( domElementOrID instanceof window.HTMLDivElement ) &&
        options.width && options.height ) {
      div.style.position = "absolute";
      div.style.width = options.width;
      div.style.height = options.height;
    }

    if ( !div.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( Primrose.DOM.makeHidingContainer(
          "primrose-container-" +
          div.id, div ) );
    }
  };
} );

pliny.issue( "Primrose.Text.Renderers.DOM", {
  name: "document DOM",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Renderers.DOM](#Primrose_Text_Renderers_DOM) class in the renderers/ directory"
} );

pliny.issue( "Primrose.Text.Renderers.DOM", {
  name: "fix DOM renderer",
  type: "open",
  description: "Trying to use this renderer causes an infinite loop somewhere that completely degrades system performance."
} );
;/* global Primrose, pliny */

Primrose.Text.Themes.Dark = ( function ( ) {
  "use strict";
  
  pliny.record( "Primrose.Text.Themes", {
    name: "Dark",
    description: "<under construction>"
  } );
  return {
    name: "Dark",
    fontFamily: "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace",
    cursorColor: "white",
    fontSize: 16,
    lineNumbers: {
      foreColor: "white"
    },
    regular: {
      backColor: "black",
      foreColor: "#c0c0c0",
      currentRowBackColor: "#202020",
      selectedBackColor: "#404040",
      unfocused: "rgba(0, 0, 255, 0.25)"
    },
    strings: {
      foreColor: "#aa9900",
      fontStyle: "italic"
    },
    regexes: {
      foreColor: "#aa0099",
      fontStyle: "italic"
    },
    numbers: {
      foreColor: "green"
    },
    comments: {
      foreColor: "yellow",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "cyan"
    },
    functions: {
      foreColor: "brown",
      fontWeight: "bold"
    },
    members: {
      foreColor: "green"
    },
    error: {
      foreColor: "red",
      fontStyle: "underline italic"
    }
  };
} )();

pliny.issue( "Primrose.Text.Themes.Dark", {
  name: "document Dark",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Themes.Dark](#Primrose_Text_Themes_Dark) class in the themes/ directory"
} );
;/* global Primrose, pliny */

Primrose.Text.Themes.Default = ( function ( ) {
  "use strict";
  
  pliny.record( "Primrose.Text.Themes", {
    name: "Default",
    description: "<under construction>"
  } );
  return {
    name: "Light",
    fontFamily: "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace",
    cursorColor: "black",
    fontSize: 16,
    lineNumbers: {
      foreColor: "black"
    },
    regular: {
      backColor: "white",
      foreColor: "black",
      currentRowBackColor: "#f0f0f0",
      selectedBackColor: "#c0c0c0",
      unfocused: "rgba(0, 0, 255, 0.25)"
    },
    strings: {
      foreColor: "#aa9900",
      fontStyle: "italic"
    },
    regexes: {
      foreColor: "#aa0099",
      fontStyle: "italic"
    },
    numbers: {
      foreColor: "green"
    },
    comments: {
      foreColor: "grey",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "blue"
    },
    functions: {
      foreColor: "brown",
      fontWeight: "bold"
    },
    members: {
      foreColor: "green"
    },
    error: {
      foreColor: "red",
      fontStyle: "underline italic"
    }
  };
} )();

pliny.issue( "Primrose.Text.Themes.Default", {
  name: "document Default",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Themes.Default](#Primrose_Text_Themes_Default) class in the themes/ directory"
} );
Primrose.VERSION = "v0.21.1";
console.log("Using Primrose v0.21.1. Find out more at http://www.primrosevr.com");