pliny.function({
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

pliny.function({
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



pliny.function({
  name: "px",
  description: "Appends the string \"px\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS pixel-unit value."} ],
  returns: "The number as a string, plus the text \"px\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(px(100.5) === \"100.5px\");"} ]
} );
var px = fmt.bind( this, "$1px" );

pliny.function({
  name: "pct",
  description: "Appends the string \"%\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS percentage-unit value."} ],
  returns: "The number as a string, plus the text \"%\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(pct(100.5) === \"100.5%\");"} ]
} );
var pct = fmt.bind( this, "$1%" );

pliny.function({
  name: "ems",
  description: "Appends the string \"em\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS em-unit value."} ],
  returns: "The number as a string, plus the text \"em\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(ems(100.5) === \"100.5em\");"} ]
} );
var ems = fmt.bind( this, "$1em" );

pliny.function({
  name: "rems",
  description: "Appends the string \"rem\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS rem-unit value."} ],
  returns: "The number as a string, plus the text \"em\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(rems(100.5) === \"100.5rem\");"} ]
} );
var rems = fmt.bind( this, "$1rem" );

pliny.function({
  name: "vws",
  description: "Appends the string \"vw\" to the end of a number. Useful for specifying CSS units.",
  parameters: [ {name: "value", type: "Number", description: "The number to make into a CSS view-width-unit value."} ],
  returns: "The number as a string, plus the text \"vw\", with no intermediate whitespace.",
  examples: [ {name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(vws(100.5) === \"100.5vw\");"} ]
} );
var vws = fmt.bind( this, "$1vw" );

pliny.function({
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

pliny.function({
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

pliny.function({
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

pliny.function({
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
var hsla = fmt.bind( this, "hsla($1, $2%, $3%, $4)" );