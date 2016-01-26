/* global pliny */

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
      description: "``// Round a number to an integer.\n\
console.assert(sigfig(12.345, 0) === \"12\");\n\
 \n\
// sigfig respects rounding rules.\n\
console.assert(sigfig(123.4567, 2) === \"123.46\");\n\
 \n\
// sigfig will pad extra zeroes.\n\
console.assert(sigfig(123.4, 3) === \"123.400\");``"}
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

////
// Replace template place holders in a string with a positional value.
// Template place holders start with a dollar sign ($) and are followed
// by a digit that references the parameter position of the value to
// use in the text replacement. Note that the first position, position 0,
// is the template itself. However, you cannot reference the first position,
// as zero digit characters are used to indicate the width of number to
// pad values out to.
// 
// Numerical precision padding is indicated with a period and trailing
// zeros.
// 
// examples:
// fmt("a: $1, b: $2", 123, "Sean") => "a: 123, b: Sean"
// fmt("$001, $002, $003", 1, 23, 456) => "001, 023, 456"
// fmt("$1.00 + $2.00 = $3.00", Math.sqrt(2), Math.PI, 9001)
// => "1.41 + 3.14 = 9001.00"
// fmt("$001.000", Math.PI) => 003.142
///
var fmt = ( function () {

  function addMillis ( val, txt ) {
    return txt.replace( /( AM| PM|$)/, function ( match, g1 ) {
      return ( val.getMilliseconds() / 1000 ).toString()
          .substring( 1 ) + g1;
    } );
  }

  function fmt ( template ) {
    // - match a dollar sign ($) literally,
    // - (optional) then zero or more zero digit (0) characters, greedily
    // - then one or more digits (the previous rule would necessitate that
    //      the first of these digits be at least one).
    // - (optional) then a period (.) literally
    // -            then one or more zero digit (0) characters
    var paramRegex = /\$(0*)(\d+)(?:\.(0+))?/g;
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
                val = val.getYear();
                break;
              case 2:
                val = ( val.getMonth() + 1 ) + "/" + val.getYear();
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
              var paddingRegex = new RegExp( "^\\d{" + ( pad.length + 1 ) +
                  "}(\\.\\d+)?" );
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

var px = fmt.bind( this, "$1px" ),
    pct = fmt.bind( this, "$1%" ),
    ems = fmt.bind( this, "$1em" ),
    rgb = fmt.bind( this, "rgb($1, $2, $3)" ),
    rgba = fmt.bind( this, "rgba($1, $2, $3, $4)" ),
    hsl = fmt.bind( this, "hsl($1, $2, $3)" ),
    hsla = fmt.bind( this, "hsla($1, $2, $3, $4)" );

pliny.issue( "", {
  name: "document helpers/fmt",
  type: "open",
  description: "Finish writing the documentation for the [fmt](#fmt) class in the helpers/ directory"
} );


pliny.issue( "", {
  name: "document sigfig function",
  type: "open",
  description: "Finish writing the documentation for the [sigfig](#sigfig) function in the helpers/fmt.js file."
} );

pliny.issue( "", {
  name: "document fmt function",
  type: "open",
  description: "Finish writing the documentation for the [fmt](#fmt) function in the helpers/fmt.js file."
} );

pliny.issue( "", {
  name: "document px function",
  type: "open",
  description: "Finish writing the documentation for the [px](#px) function in the helpers/fmt.js file."
} );

pliny.issue( "", {
  name: "document pct function",
  type: "open",
  description: "Finish writing the documentation for the [pct](#pct) function in the helpers/fmt.js file."
} );

pliny.issue( "", {
  name: "document ems function",
  type: "open",
  description: "Finish writing the documentation for the [ems](#ems) function in the helpers/fmt.js file."
} );

pliny.issue( "", {
  name: "document rgb function",
  type: "open",
  description: "Finish writing the documentation for the [rgb](#rgb) function in the helpers/fmt.js file."
} );

pliny.issue( "", {
  name: "document rgba function",
  type: "open",
  description: "Finish writing the documentation for the [rgba](#rgba) function in the helpers/fmt.js file."
} );

pliny.issue( "", {
  name: "document hsl function",
  type: "open",
  description: "Finish writing the documentation for the [hsl](#hsl) function in the helpers/fmt.js file."
} );

pliny.issue( "", {
  name: "document hsla function",
  type: "open",
  description: "Finish writing the documentation for the [hsla](#hsla) function in the helpers/fmt.js file."
} );