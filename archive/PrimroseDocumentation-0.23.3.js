pliny.namespace({
    name: "Primrose",
    description: "Primrose helps you make VR applications for web browsers as easy as making other types of interactive web pages.\n\nThis top-level namespace contains classes for manipulating and viewing 3D environments."
  });
  pliny.namespace({
    parent: "Primrose",
    name: "DOM",
    description: "A few functions for manipulating DOM."
  });
  pliny.namespace({
    parent: "Primrose",
    name: "HTTP",
    description: "A collection of basic XMLHttpRequest wrappers."
  });
  pliny.namespace({
    parent: "Primrose",
    name: "Input",
    description: "The Input namespace contains classes that handle user input, for use in navigating the 3D environment."
  });
  pliny.namespace({
    parent: "Primrose",
    name: "Network",
    description: "The Network namespace contains classes for communicating events between entities in a graph relationship across different types of communication boundaries: in-thread, cross-thread, cross-WAN, and cross-LAN."
  });
  pliny.namespace({
    parent: "Primrose",
    name: "Output",
    description: "The Output namespace contains classes that handle output to devices other than the screen (e.g. Audio, Music, etc.)."
  });
  pliny.namespace({
    parent: "Primrose",
    name: "Random",
    description: "Functions for handling random numbers of different criteria, or selecting random elements of arrays."
  });
  pliny.namespace({
    parent: "Primrose",
    name: "Text",
    description: "The Text namespace contains classes everything regarding the Primrose source code editor."
  });
  pliny.namespace({
    parent: "Text",
    name: "CodePages",
    description: "The CodePages namespace contains international keyboard parameters."
  });
  pliny.namespace({
    parent: "Text",
    name: "CommandPacks",
    description: "The CommandPacks namespace contains sets of keyboard shortcuts for different types of text-oriented controls."
  });
  pliny.namespace({
    parent: "Text",
    name: "Controls",
    description: "The Controls namespace contains different types of text-oriented controls."
  });
  pliny.namespace({
    parent: "Text",
    name: "Grammars",
    description: "The Grammars namespace contains grammar parsers for different types of programming languages, to enable syntax highlighting."
  });
  pliny.namespace({
    parent: "Text",
    name: "OperatingSystems",
    description: "The OperatingSystems namespace contains sets of keyboard shortcuts for different operating systems."
  });
  pliny.namespace({
    parent: "Text",
    name: "Renderers",
    description: "The Renderers namespace contains different renderers for using the general Text Editor logic in different output systems. Current, Canvas2D is the only system that works. A system for DOM elements exists, but it is broken and not likely to be fixed any time soon."
  });
  pliny.namespace({
    parent: "Text",
    name: "Themes",
    description: "The Themes namespace contains color themes for text-oriented controls, for use when coupled with a parsing grammar."
  });
  pliny.namespace({
    parent: "Primrose",
    name: "X",
    description: "Extensions and components that combine other Primrose elements."
  });
  pliny.value({
    parent: "Primrose",
    name: "SYS_FONTS",
    type: "String",
    description: "A selection of fonts that will match whatever the user's operating system normally uses."
  });
  pliny.value({
    parent: "Primrose",
    name: "SKINS",
    type: "Array of String",
    description: "A selection of color values that closely match skin colors of people."
  });
  pliny.value({
    parent: "Primrose",
    name: "SKIN_VALUES",
    type: "Array of Number",
    description: "A selection of color values that closely match skin colors of people."
  });
  pliny.value({
    name: "isHomeScreen",
    type: "Boolean",
    description: "Flag indicating the script is currently running in an IFRAME or not."
  });
  pliny.value({
    name: "isMobile",
    type: "Boolean",
    description: "Flag indicating the current system is a recognized \"mobile\"\n\
device, usually possessing a motion sensor."
  });
  pliny.value({
    name: "isGearVR",
    type: "Boolean",
    description: "Flag indicating the application is running on the Samsung Gear VR in the Samsung Internet app."
  });
  pliny.value({
    name: "isiOS",
    type: "Boolean",
    description: "Flag indicating the current system is a device running the Apple\n\
iOS operating system: iPad, iPod Touch, iPhone. Useful for invoking optional code\n\
paths necessary to deal with deficiencies in Apple's implementation of web standards." });
  pliny.value({
    name: "isOSX",
    type: "Boolean",
    description: "Flag indicating the current system is a computer running the Apple\n\
OSX operating system. Useful for changing keyboard shortcuts to support Apple's\n\
idiosynchratic, concensus-defying keyboard shortcuts."
  });
  pliny.value({
    name: "isWindows",
    type: "Boolean",
    description: "Flag indicating the current system is a computer running one of\n\
the Microsoft Windows operating systems. We have not yet found a use for this flag."
  });
  pliny.value({
    name: "isOpera",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Opera.\n\
Opera is a substandard browser that lags adoption of cutting edge web technologies,\n\
so you are not likely to need this flag if you are using Primrose, other than to\n\
cajole users into downloading a more advanced browser such as Mozilla Firefox or\n\
Google Chrome."
  });
  pliny.value({
    name: "isSafari",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Safari.\n\
Safari is an overly opinionated browser that thinks users should be protected from\n\
themselves in such a way as to prevent users from gaining access to the latest in\n\
cutting-edge web technologies. Essentially, it was replaced Microsoft Internet\n\
Explorer as the Internet Explorer of the web."
  });
  pliny.value({
    name: "isChrome",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Chrome\n\
or Chromium. Chromium was one of the first browsers to implement virtual reality\n\
features directly in the browser, thanks to the work of Brandon \"Toji\" Jones."
  });
  pliny.value({
    name: "isFirefox",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Firefox.\n\
Firefox was one of the first browsers to implement virtual reality features directly\n\
in the browser, thanks to the work of the MozVR team."
  });
  pliny.value({
    name: "isWebKit",
    type: "Boolean",
    description: "Flag indicating the browser is one of Chrome, Safari, or Opera.\n\
WebKit browsers have certain issues in common that can be treated together, like\n\
a common basis for orientation events."
  });
  pliny.value({
    name: "isIE",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Internet\n\
Explorer. Once the bane of every web developer's existence, it has since passed\n\
the torch on to Safari in all of its many useless incarnations."
  });
  pliny.value({
    parent: "Primrose",
    name: "RESOLUTION_SCALES",
    description: "Scaling factors for changing the resolution of the display when the render quality level changes."
  });
  pliny.enumeration({
    parent: "Primrose",
    name: "Quality",
    description: "Graphics quality settings."
  });
  pliny.function({
  name: "axis",
  description: "Creates a set of reference axes, with X as red, Y as green, and Z as blue.",
  returns: "THREE.Object3D",
  parameters: [{ name: "length", type: "Number", description: "The length each axis should be in its own axis." }, { name: "width", type: "Number", description: "The size each axis should be in the other axes." }],
  examples: [{
    name: "Basic usage", description: "To create a fixed point of reference in the scene, use the `axis()` function.:\n\
\n\
    grammar(\"JavaScript\");\n\
    var scene = new THREE.Scene()\n\
    // This set of axis bars will each be 1 meter long and 5cm wide.\n\
    // They'll be centered on each other, so the individual halves\n\
    // of the bars will only extend half a meter.\n\
    scene.add(axis(1, 0.05));\n\
\n\
The result should appear as:\n\
\n\
![screenshot](images/axis.png)" }]
});
pliny.function({
  name: "box",
  returns: "THREE.BoxGeometry",
  description: "A shortcut function for the THREE.BoxGeometry class. Creates a \"rectilinear prism\", i.e. the general class of rectangular objects that includes cubes.",
  parameters: [{ name: "width", type: "Number", description: "The size of the box in the X dimension." }, { name: "height", type: "Number", description: "(optional) The size of the box in the Y dimension. If height is not provided, it will be set to the width parameter." }, { name: "length", type: "Number", description: "(optional) The size of the box in the Z dimension. If length is not provided, it will be set to the width parameter." }]
});
pliny.function({
  name: "brick",
  returns: "THREE.Mesh",
  description: "Creates a textured box. See [`box()`](#box) and [`textured()`](#textured). The texture will be repeated across the box.",
  parameters: [{ name: "txt", type: "Texture description", description: "The texture to apply to the box." }, { name: "width", type: "Number", description: "(optional) The size of the box in the X dimension. If width is not provided, it will be set to 1." }, { name: "height", type: "Number", description: "(optional) The size of the box in the Y dimension. If height is not provided, it will be set to 1." }, { name: "length", type: "Number", description: "(optional) The size of the box in the Z dimension. If length is not provided, it will be set to 1." }]
});
pliny.function({
  name: "clone",
  parameters: [{ name: "obj", type: "Object", description: "The object-literal to clone" }],
  description: "Creates a copy of a JavaScript object literal.",
  examples: [{
    name: "Create a copy of an object.", description: "To create a copy of an object that can be modified without modifying the original object, use the `clone()` function:\n\
\n\
    grammar(\"JavaScript\");\n\
    var objA = { x: 1, y: 2 },\n\
        objB = clone(objA);\n\
    console.assert(objA !== objB);\n\
    console.assert(objA.x === objB.x);\n\
    console.assert(objA.y === objB.y);\n\
    objB.x = 3;\n\
    console.assert(objA.x !== objB.x);"
  }]
});
pliny.function({
  name: "cloud",
  description: "| [under construction]"
});
pliny.function({
  name: "cylinder",
  description: "| [under construction]"
});
pliny.function({
  name: "sigfig",
  description: "Formats a decimal number to a certain length of decimal points.",
  parameters: [{ name: "x", type: "Number", description: "The number to format." }, { name: "y", type: "Number", description: "The number of digits after the decimal point to show." }],
  returns: "String",
  examples: [{
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
    console.assert(sigfig(123.4, 3) === \"123.400\");" }]
});
pliny.function({
  name: "fmt",
  parameters: [{ name: "template", type: "String", description: "The template string containing dollar-sign delimited value references." }, { name: "varargs...", type: "Any", description: "The values to replace into the template. Generally speaking, the `toString()` method of the object will be called. However, dates have special handling. The precision count indicates the fields of the date to print.\n\
* $1.0 - prints just the 4-digit year.\n\
* $1.00 - prints the 2-digit month/4-digit year.\n\
* $1.000 - prints the result of calling `toLocaleDateString()` on the date value.\n\
* $1.0000 - prints the result of calling `toLocaleTimeString()` on the date value, plus additional milliseconds value.\n\
* $1.00000 - same as...\n\
* $1.000000 - prints the result of calling `toLocaleString()` on the date value.\n\
* $1.0000000 - prints the result of calling `toLocaleString()` on the date value, plus additional milliseconds value." }],
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
  examples: [{ name: "Basic examples",
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
    console.assert(fmt(\"The current date and time is $1.0000000.\", new Date() ) === \"The current date and time is 1/25/2016, 10:06:55.667 PM.\");" }]
});
pliny.function({
  name: "px",
  description: "Appends the string \"px\" to the end of a number. Useful for specifying CSS units.",
  parameters: [{ name: "value", type: "Number", description: "The number to make into a CSS pixel-unit value." }],
  returns: "The number as a string, plus the text \"px\", with no intermediate whitespace.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(px(100.5) === \"100.5px\");" }]
});
pliny.function({
  name: "pct",
  description: "Appends the string \"%\" to the end of a number. Useful for specifying CSS units.",
  parameters: [{ name: "value", type: "Number", description: "The number to make into a CSS percentage-unit value." }],
  returns: "The number as a string, plus the text \"%\", with no intermediate whitespace.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(pct(100.5) === \"100.5%\");" }]
});
pliny.function({
  name: "ems",
  description: "Appends the string \"em\" to the end of a number. Useful for specifying CSS units.",
  parameters: [{ name: "value", type: "Number", description: "The number to make into a CSS em-unit value." }],
  returns: "The number as a string, plus the text \"em\", with no intermediate whitespace.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(ems(100.5) === \"100.5em\");" }]
});
pliny.function({
  name: "rems",
  description: "Appends the string \"rem\" to the end of a number. Useful for specifying CSS units.",
  parameters: [{ name: "value", type: "Number", description: "The number to make into a CSS rem-unit value." }],
  returns: "The number as a string, plus the text \"em\", with no intermediate whitespace.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(rems(100.5) === \"100.5rem\");" }]
});
pliny.function({
  name: "vws",
  description: "Appends the string \"vw\" to the end of a number. Useful for specifying CSS units.",
  parameters: [{ name: "value", type: "Number", description: "The number to make into a CSS view-width-unit value." }],
  returns: "The number as a string, plus the text \"vw\", with no intermediate whitespace.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(vws(100.5) === \"100.5vw\");" }]
});
pliny.function({
  name: "rgb",
  description: "Builds a CSS `rbg()` color-value string from three parameters.",
  parameters: [{ name: "red", type: "Number", description: "The red component, on the range [0, 255]." }, { name: "green", type: "Number", description: "The green component, on the range [0, 255]." }, { name: "blue", type: "Number", description: "The blue component, on the range [0, 255]." }],
  returns: "The color-value string, e.g. `rgb(120, 230, 64)`.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(rgb(120, 230, 64) === \"rgb(120, 230, 64)\");" }]
});
pliny.function({
  name: "rgba",
  description: "Builds a CSS `rbga()` color-value string from three parameters.",
  parameters: [{ name: "red", type: "Number", description: "The red component, on the range [0, 255]." }, { name: "green", type: "Number", description: "The green component, on the range [0, 255]." }, { name: "blue", type: "Number", description: "The blue component, on the range [0, 255]." }, { name: "alpha", type: "Number", description: "The alpha component, on the range [0, 1]." }],
  returns: "The color-value string, e.g. `rgba(120, 230, 64, 0.75)`.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(rgba(120, 230, 64, 0.75) === \"rgba(120, 230, 64, 0.75)\");" }]
});
pliny.function({
  name: "hsl",
  description: "Builds a CSS `hsl()` color-value string from three parameters.",
  parameters: [{ name: "hue", type: "Number", description: "The hue angle, on the range [0, 360]. By definition, 0 = 360. Values also wrap-around, so -120 = 240." }, { name: "saturation", type: "Number", description: "The saturation percentage, on the range [0, 100]." }, { name: "lightness", type: "Number", description: "The lightness percentage, on the range [0, 100]." }],
  returns: "The color-value string, e.g. `hsl(120, 100, 50)`.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(hsl(120, 100, 50) === \"hsl(120, 100%, 50%)\");" }]
});
pliny.function({
  name: "hsla",
  description: "Builds a CSS `hsla()` color-value string from three parameters.",
  parameters: [{ name: "hue", type: "Number", description: "The hue angle, on the range [0, 360]. By definition, 0 = 360. Values also wrap-around, so -120 = 240." }, { name: "saturation", type: "Number", description: "The saturation percentage, on the range [0, 100]." }, { name: "lightness", type: "Number", description: "The lightness percentage, on the range [0, 100]." }, { name: "alpha", type: "Number", description: "The alpha component, on the range [0, 1]." }],
  returns: "The color-value string, e.g. `hsla(120, 100, 50, 0.25)`.",
  examples: [{ name: "Basic usage", description: "\
    grammar(\"JavaScript\");\n\
    console.assert(hsla(120, 100, 50) === \"hsla(120, 100%, 50%, 0.25)\");" }]
});
pliny.function({
  name: "getSetting",
  parameters: [{ name: " name", type: "string", description: "The name of the setting to read." }, { name: "defValue", type: "Object", description: "The default value to return, if the setting is not present in `localStorage`." }],
  returns: "The Object stored in `localStorage` for the given name, or the default value provided if the setting doesn't exist in `localStorage`.",
  description: "Retrieves named values out of `localStorage`. The values should\n\
be valid for passing to `JSON.parse()`. A default value can be specified in the\n\
function call that should be returned if the value does not exist, or causes an\n\
error in parsing. Typically, you'd call this function at page-load time after having\n\
called the [`setSetting()`](#setSetting) function during a previous page session.",
  examples: [{ name: "Basic usage",
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
    }, false);" }]
});
pliny.function({
  name: "setSetting",
  parameters: [{ name: " name", type: "string", description: "The name of the setting to set." }, { name: "val", type: "Object", description: "The value to write. It should be useable as a parameter to `JSON.stringify()`." }],
  description: "Writes named values to `localStorage`. The values should be valid\n\
for passing to `JSON.stringify()`. Typically, you'd call this function at page-unload\n\
time, then call the [`getSetting()`](#getSetting) function during a subsequent page load.",
  examples: [{ name: "Basic usage",
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
    }, false);" }]
});
pliny.function({
  name: "deleteSetting",
  parameters: [{ name: " name", type: "string", description: "The name of the setting to delete." }],
  description: "Removes an object from localStorage",
  examples: [{
    name: "Basic usage",
    description: "\
\n\
    grammar(\"JavaScript\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"default-A\");\n\
    setSetting(\"A\", \"modified-A\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"modified-A\");\n\
    deleteSetting(\"A\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"default-A\");"
  }]
});
pliny.function({
  name: "readForm",
  parameters: [{ name: "ctrls", type: "Hash of Elements", description: "An array of HTML form elements, aka INPUT, TEXTAREA, SELECT, etc." }],
  returns: "Object",
  description: "Scans through an array of input elements and builds a state object that contains the values the input elements represent. Elements that do not have an ID attribute set, or have an attribute `data-skipcache` set, will not be included.",
  examples: [{
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
  }]
});
pliny.function({
  name: "writeForm",
  parameters: [{ name: "ctrls", type: "Hash of Elements", description: "A hash-collection of HTML input elements that will have their values set." }, { name: "state", type: "Hash object", description: "The values that will be set on the form. Hash keys should match IDs of the elements in the `ctrls` parameter." }],
  description: "Writes out a full set of state values to an HTML input form, wherever keys in the `ctrls` parameter match keys in the `state` parameter.",
  examples: [{
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
  }]
});
pliny.function({
  name: "hub",
  description: "Calling `hub()` is a short-hand for creating a new `THREE.Object3D`. This is useful in live-coding examples to keep code terse and easy to write.",
  examples: [{
    name: "Basic usage",
    description: "\n\
    //these two lines of code perform the same task.\n\
    var base1 = new THREE.Object3D();\n\
    var base2 = hub();" }]
});
pliny.class({
  name: "InsideSphereGeometry",
  parameters: [{ name: "radius", type: "Number", description: "How far the sphere should extend away from a center point." }, { name: "widthSegments", type: "Number", description: "The number of faces wide in which to slice the geometry." }, { name: "heightSegments", type: "Number", description: "The number of faces tall in which to slice the geometry." }, { name: "phiStart", type: "Number", description: "The angle in radians around the Y-axis at which the sphere starts." }, { name: "phiLength", type: "Number", description: "The change of angle in radians around the Y-axis to which the sphere ends." }, { name: "thetaStart", type: "Number", description: "The angle in radians around the Z-axis at which the sphere starts." }, { name: "thetaLength", type: "Number", description: "The change of angle in radians around the Z-axis to which the sphere ends." }],
  description: "The InsideSphereGeometry is basically an inside-out Sphere. Or\n\
more accurately, it's a Sphere where the face winding order is reversed, so that\n\
textures appear on the inside of the sphere, rather than the outside. I know, that's\n\
note exactly helpful.\n\
\n\
Say you want a to model the sky as a sphere, or the inside of a helmet. You don't\n\
care anything about the outside of this sphere, only the inside. You would use\n\
InsideSphereGeometry in this case. Or its alias, [`shell()`](#shell)."
});
pliny.function({
  name: "light",
  description: "| [under construction]"
});
pliny.function({
  name: "copyObject",
  description: "| [under construction]"
});
pliny.function({
  name: "range",
  description: "| [under construction]"
});
pliny.function({
  name: "emit",
  description: "| [under construction]"
});
pliny.function({
  name: "patch",
  parameters: [{ name: "obj1", type: "Object", description: "The object to which to copy values that don't yet exist in the object." }, { name: "obj2", type: "Object", description: "The object from which to copy values to obj1, if obj1 does not already have a value in place." }],
  returns: "Object - the obj1 parameter, with the values copied from obj2",
  description: "Copies values into Object A from Object B, skipping any value names that already exist in Object A.",
  examples: [{
    name: "Set default values.", description: "The `patch` function is intended to copy default values onto a user-supplied 'options' object, without clobbering the values they have provided.\n\
    var obj1 = {\n\
      a: 1,\n\
      b: 2,\n\
      c: 3\n\
    },\n\
      obj2 = {\n\
      c: 4,\n\
      d: 5,\n\
      e: 6\n\
    },\n\
      obj3 = patch(obj1, obj2);\n\
    console.assert(obj1 === obj3); // the returned object is exactly the same object as the first parameter.\n\
    console.assert(obj3.a === 1); // the `a` property did not exist in obj2\n\
    console.assert(obj3.b === 2); // the `b` property did not exist in obj2\n\
    console.assert(obj3.c === 3); // the `c` property existed in obj2, but it already existed in obj1, so it doesn't get overwritten\n\
    console.assert(obj3.d === 5); // the `d` property did not exist in obj1\n\
    console.assert(obj3.e === 6); // the `e` property did not exist in obj1"
  }]
});
pliny.function({
  name: "put",
  description: "| [under construction]"
});
pliny.function({
  name: "quad",
  description: "| [under construction]"
});
pliny.function({
  name: "shell",
  parameters: [{ name: "radius", type: "Number", description: "How far the sphere should extend away from a center point." }, { name: "widthSegments", type: "Number", description: "The number of faces wide in which to slice the geometry." }, { name: "heightSegments", type: "Number", description: "The number of faces tall in which to slice the geometry." }, { name: "phi", type: "Number", description: "(Optional) The angle in radians around the Y-axis of the sphere. Defaults to 80 degrees." }, { name: "thetaStart", type: "Number", description: "(Optional) The angle in radians around the Z-axis of the sphere. Defaults to 48 degrees." }],
  description: "The shell is basically an inside-out sphere. Say you want a to model\n\
the sky as a sphere, or the inside of a helmet. You don't care anything about the\n\
outside of this sphere, only the inside. You would use InsideSphereGeometry in this\n\
case. It is mostly an alias for [`InsideSphereGeometry`](#InsideSphereGeometry).",
  examples: [{
    name: "Create a sky sphere", description: "To create a sphere that hovers around the user at a\n\
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
          // The number of rings defines how smooth the sphere will be in the\n\
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
      {unshaded: true} );" }]
});
pliny.function({
  name: "sphere",
  description: "| [under construction]"
});
pliny.function({
  name: "textured",
  description: "| [under construction]"
});
pliny.function({
  name: "v3",
  description: "| [under construction]"
});
pliny.class({
    parent: "Primrose",
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
    parameters: [{ name: "initialAngleInDegrees", type: "Number", description: "(Required) Specifies the initial context of the angle. Zero is not always the correct value." }],
    examples: [{
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
    }]
  });

  pliny.property({
      parent: "Primrose.Angle",
      name: "degrees",
      type: "Number",
      description: "Get/set the current value of the angle in degrees."
    });
    pliny.property({
    parent: "Primrose.Angle",
    name: "radians",
    type: "Number",
    description: "Get/set the current value of the angle in radians."
  });
  pliny.class({
    parent: "Primrose",
    name: "BaseControl",
    description: "The BaseControl class is the parent class for all 3D controls.\n\
It manages a unique ID for every new control, the focus state of the control, and\n\
performs basic conversions from DOM elements to the internal Control format."
  });

  pliny.method({
    parent: "Primrose.BaseControl",
    name: "addEventListener",
    description: "Adding an event listener registers a function as being ready to receive events.",
    parameters: [{ name: "evt", type: "String", description: "The name of the event for which we are listening." }, { name: "thunk", type: "Function", description: "The callback to fire when the event occurs." }],
    examples: [{
      name: "Add an event listener.",
      description: "The `addEventListener()` method operates nearly identically\n\
to the method of the same name on DOM elements.\n\
\n\
    grammar(\"JavaScript\");\n\
    var txt = new Primrose.Text.Controls.TextBox();\n\
    txt.addEventListener(\"mousemove\", console.log.bind(console, \"mouse move\"));\n\
    txt.addEventListener(\"keydown\", console.log.bind(console, \"key down\"));"
    }]
  });

  pliny.method({
    parent: "Primrose.BaseControl",
    name: "focus",
    description: "Sets the focus property of the control, does not change the focus property of any other control.",
    examples: [{
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
    }]
  });

  pliny.method({
    parent: "Primrose.BaseControl",
    name: "blur",
    description: "Unsets the focus property of the control, does not change the focus property of any other control.",
    examples: [{
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
    }]
  });

  pliny.method({
    parent: "Primrose.BaseControl",
    name: "copyElement",
    description: "Copies properties from a DOM element that the control is supposed to match.",
    parameters: [{ name: "elem", type: "Element", description: "The element--e.g. a button or textarea--to copy." }],
    examples: [{
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
    }]
  });

  pliny.property({
        name: "controlID",
        type: "Number",
        description: "Automatically incrementing counter for controls, to make sure there is a distinct differentiator between them all."
      });
      pliny.property({
        name: "focused",
        type: "Boolean",
        description: "Flag indicating this control has received focus. You should theoretically only read it."
      });
      pliny.property({
        name: "listeners",
        type: "Object",
        description: "A bag of arrays that hold the callback functions for each event. The child class of BaseControl may add such arrays to this object. By default, includes listeners for focus and blur events."
      });
      pliny.class({
    parent: "Primrose",
    name: "BrowserEnvironment",
    description: "Make a Virtual Reality app in your web browser!"
  });

  pliny.class({
    parent: "Primrose",
    name: "Button",
    baseClass: "Primrose.BaseControl",
    parameters: [{ name: "model", type: "THREE.Object3D", description: "A 3D model to use as the graphics for this button." }, { name: "name", type: "String", description: "A name for the button, to make it distinct from other buttons." }, { name: "options", type: "Object", description: "A hash of options:\n\t\t\tmaxThrow - The limit for how far the button can be depressed.\n\t\t\tminDeflection - The minimum distance the button must be depressed before it is activated.\n\t\t\tcolorPressed - The color to change the button cap to when the button is activated.\n\t\t\tcolorUnpressed - The color to change the button cap to when the button is deactivated.\n\t\t\ttoggle - True if deactivating the button should require a second click. False if the button should deactivate when it is released." }],
    description: "A 3D button control, with a separate cap from a stand that it sits on. You click and depress the cap on top of the stand to actuate."
  });

  pliny.event({
        name: "click",
        description: "Occurs when the button is activated."
      });
      pliny.event({
        name: "release",
        description: "Occurs when the button is deactivated."
      });
      pliny.property({
        name: "base",
        type: "THREE.Object3D",
        description: "The stand the button cap sits on."
      });
      pliny.property({
        name: "base",
        type: "THREE.Object3D",
        description: "The moveable part of the button, that triggers the click event."
      });
      pliny.property({
        name: "container",
        type: "THREE.Object3D",
        description: "A grouping collection for the base and cap."
      });
      pliny.property({
        name: "color",
        type: "Number",
        description: "The current color of the button cap."
      });
      pliny.record({
    parent: "Primrose.Button",
    name: "DEFAULTS",
    description: "Default option values that override undefined options passed to the Button class."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "maxThrow",
    type: "Number",
    description: "The limit for how far the button can be depressed."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "minDeflection",
    type: "Number",
    description: "The minimum distance the button must be depressed before it is activated."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "colorUnpressed",
    type: "Number",
    description: "The color to change the button cap to when the button is deactivated."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "colorPressed",
    type: "Number",
    description: "The color to change the button cap to when the button is activated."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "toggle",
    type: "Boolean",
    description: "True if deactivating the button should require a second click. False if the button should deactivate when it is released."
  });
  pliny.property({
    parent: "Primrose.Button",
    name: "position",
    type: "THREE.Vector3",
    description: "The location of the button."
  });
  pliny.class({
    parent: "Primrose",
    name: "ButtonFactory",
    description: "Loads a model file and holds the data, creating clones of the data whenever a new button is desired.",
    parameters: [{ name: "template", type: "THREE.Object3D", description: "A THREE.Object3D that specifies a 3D model for a button, to be used as a template." }, { name: "options", type: "Object", description: "The options to apply to all buttons that get created by the factory." }, { name: "complete", type: "Function", description: "A callback function to indicate when the loading process has completed, if `templateFile` was a String path." }]
  });
  pliny.property({
      name: "options",
      type: "Object",
      description: "The options that the user provided, so that we might change them after the factory has been created, if we so choose."
    });
    pliny.property({
      name: "template",
      type: "THREE.Object3D",
      description: "The 3D model for the button, that will be cloned every time a new button is created."
    });
    pliny.method({
    parent: "Primrose.ButtonFactory",
    name: "create",
    description: "Clones all of the geometry, materials, etc. in a 3D model to create a new copy of it. This really should be done with instanced objects, but I just don't have the time to deal with it right now.",
    parameters: [{ name: "toggle", type: "Boolean", description: "True if the new button should be a toggle button (requiring additional clicks to deactivate) or a regular button (deactivating when the button is released, aka \"momentary\"." }],
    return: "The cloned button that which we so desired."
  });
  pliny.class({
  parent: "Primrose",
  name: "Entity",
  description: "An object that receives user input events and network messages to perform actions."
});
pliny.class({
    parent: "Primrose",
    name: "Entity",
    description: "The Entity class is the parent class for all 3D controls.\n\
It manages a unique ID for every new control, the focus state of the control, and\n\
performs basic conversions from DOM elements to the internal Control format."
  });

  pliny.method({
    parent: "Primrose.Entity",
    name: "addEventListener",
    description: "Adding an event listener registers a function as being ready to receive events.",
    parameters: [
      { name: "evt", type: "String", description: "The name of the event for which we are listening." },
      { name: "thunk", type: "Function", description: "The callback to fire when the event occurs." }
    ],
    examples: [{
      name: "Add an event listener.",
      description: "The `addEventListener()` method operates nearly identically\n\
    to the method of the same name on DOM elements.\n\
    \n\
    grammar(\"JavaScript\");\n\
    var txt = new Primrose.Text.Controls.TextBox();\n\
    txt.addEventListener(\"mousemove\", console.log.bind(console, \"mouse move\"));\n\
    txt.addEventListener(\"keydown\", console.log.bind(console, \"key down\"));"
    }]
    });
    pliny.method({
      parent: "Primrose.Entity",
      name: "removeEventListener",
        description: "Removing an event listener so that it no longer receives events from this object. Note that it must be the same function instance that was used when the event listener was added.",
          parameters: [
            { name: "evt", type: "String", description: "The name of the event from which we are removing." },
            { name: "thunk", type: "Function", description: "The callback to remove." }
          ],
            examples: [{
              name: "Remove an event listener.",
              description: "The `removeEventListener()` method operates nearly identically\n\
      to the method of the same name on DOM elements.\n\
      \n\
      grammar(\"JavaScript\");\n\
      var txt = new Primrose.Text.Controls.TextBox(),\n\
        func = console.log.bind(console, \"mouse move\");\n\
      txt.addEventListener(\"mousemove\", func);\n\
      txt.removeEventListener(\"mousemove\", func);"
            }]
      });pliny.method({
      parent: "Primrose.Entity",
      name: "focus",
      description: "Sets the focus property of the control, does not change the focus property of any other control.",
      examples: [{
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
      }]
      });
      pliny.method({
      parent: "Primrose.Entity",
      name: "blur",
        description: "Unsets the focus property of the control, does not change the focus property of any other control.",
          examples: [{
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
          }]
      });
      pliny.method({
      parent: "Primrose.Entity",
      name: "appendChild",
        description: "Adds an Entity as a child entity of this entity.",
        parameters: [
          {name: "child", type: "Primrose.Entity", description: "The object to add. Will only succeed if `child.parent` is not set to a value." }
        ],
          examples: [{
            name: "Add an entity to another entity",
            description: "Entities can be arranged in parent-child relationships.\n\
      \n\
      grammar(\"JavaScript\");\n\
      var a = new Primrose.Entity(),\n\
        b = new Primrose.Entity();\n\
      a.appendChild(b);\n\
      console.assert(a.children.length === 1);\n\
      console.assert(a.children[0] === b);\n\
      console.assert(b.parent === a);"
          }]
      });
      pliny.method({
      parent: "Primrose.Entity",
      name: "removeChild",
      description: "Removes an Entity from another Entity of this entity.",
      parameters: [
        { name: "child", type: "Primrose.Entity", description: "The object to remove. Will only succeed if `child.parent` is this object." }
      ],
      examples: [{
        name: "Remove an entity from another entity",
        description: "Entities can be arranged in parent-child relationships.\n\
      \n\
      grammar(\"JavaScript\");\n\
      var a = new Primrose.Entity(),\n\
        b = new Primrose.Entity();\n\
      a.appendChild(b);\n\
      console.assert(a.children.length === 1);\n\
      console.assert(a.children[0] === b);\n\
      console.assert(b.parent === a);\n\
      a.removeChild(b);\n\
      console.assert(a.children.length === 0)\n\
      console.assert(b.parent === null);"
          }]
      });
      pliny.class({
    parent: "Primrose",
    name: "InputProcessor",
    description: "| [under construction]"
  });

  pliny.enumeration({
    parent: "Primrose",
    name: "Keys",
    description: "Keycode values for system keys that are the same across all international standards"
  });
  pliny.class({
    parent: "Primrose",
    name: "ModelLoader",
    description: "Creates an interface for cloning 3D models loaded from files, to instance those objects.\n\
\n\
> NOTE: You don't instantiate this class directly. Call `ModelLoader.loadModel`.",
    parameters: [{ name: "template", type: "THREE.Object3D", description: "The 3D model to make clonable." }],
    examples: [{
      name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var scene = new THREE.Scene(),\n\
     \n\
    // Load up the file, optionally \"check it out\"\n\
      modelFactory = new Primrose.loadModel(\"path/to/model.json\", console.log.bind(console, \"Progress:\"))\n\
      .then(function(model){\n\
        model.template.traverse(function(child){\n\
          // Do whatever you want to the individual child objects of the scene.\n\
        });\n\
     \n\
      // Add copies of the model to the scene every time the user hits the ENTER key.\n\
      window.addEventListener(\"keyup\", function(evt){\n\
        // If the template object exists, then the model loaded successfully.\n\
        if(evt.keyCode === 10){\n\
          scene.add(model.clone());\n\
        }\n\
      });\n\
    })\n\
    .catch(console.error.bind(console));" }]
  });
  pliny.property({
      name: "template",
      type: "THREE.Object3D",
      description: "When a model is loaded, stores a reference to the model so it can be cloned in the future."
    });
    pliny.method({
    parent: "Primrose.ModelLoader",
    name: "clone",
    description: "Creates a copy of the stored template model.",
    returns: "A THREE.Object3D that is a copy of the stored template.",
    examples: [{
      name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
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
    });" }]
  });
  pliny.function({
    parent: "Primrose.ModelLoader",
    name: "loadObject",
    description: "Asynchronously loads a JSON, OBJ, or MTL file as a Three.js object. It processes the scene for attributes, creates new properties on the scene to give us\n\
faster access to some of the elements within it. It uses callbacks to tell you when loading progresses. It uses a Promise to tell you when it's complete, or when an error occurred.\n\
Useful for one-time use models.\n\
\n\
> NOTE: ModelLoader uses the same Cross-Origin Request policy as THREE.ImageUtils,\n\
> meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin\n\
> policy that Primrose uses for requests.",
    returns: "Promise",
    parameters: [{ name: "src", type: "String", description: "The file from which to load." }, { name: "type", type: "String", description: "(Optional) The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension." }, { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }],
    examples: [{
      name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
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
      null,\n\
      console.log.bind(console, \"Progress:\"))\n\
      .then(scene.add.bind(scene))\n\
      .catch(console.error.bind(console));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      renderer.render(scene, camera);\n\
    }\n\
     \n\
    requestAnimationFrame(paint);" }]
  });
  pliny.function({
    parent: "Primrose.ModelLoader",
    name: "loadObjects",
    description: "Asynchronously loads an array of JSON, OBJ, or MTL file as a Three.js object. It processes the objects for attributes, creating new properties on each object to give us\n\
faster access to some of the elements within it. It uses callbacks to tell you when loading progresses. It uses a Promise to tell you when it's complete, or when an error occurred.\n\
Useful for static models.\n\
\n\
See [`Primrose.ModelLoader.loadObject()`](#Primrose_ModelLoader_loadObject) for more details on how individual models are loaded.",
    returns: "Promise",
    parameters: [{ name: "arr", type: "Array", description: "The files from which to load." }, { name: "type", type: "String", description: "(Optional) The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension." }, { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }],
    examples: [{
      name: "Load some models.", description: "When Blender exports models, they are frequently treated as full scenes, essentially making them scene-graph sub-trees.\n\
We can load a bunch of models in one go using the following code.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var renderer = new THREE.WebGLRenderer(),\n\
        currentScene = new THREE.Scene(),\n\
        camera = new THREE.PerspectiveCamera(),\n\
        allModels = null;\n\
     \n\
    // Load up the file\n\
    Primrose.ModelLoader.loadObjects(\n\
      [\"path/to/model1.json\",\n\
        \"path/to/model2.obj\",\n\
        \"path/to/model3.obj\",\n\
        \"path/to/model4.fbx\"],\n\
      console.log.bind(console, \"Progress:\"))\n\
      .then(function(models){\n\
        allModels = models;\n\
        models.forEach(function(model){\n\
          scene.add(model);\n\
        });\n\
      })\n\
      .catch(console.error.bind(console));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      \n\
      if(allModels){\n\
        // do whatever updating you want on the models\n\
      }\n\
      \n\
      renderer.render(scene, camera);\n\
    }\n\
    \n\
    requestAnimationFrame(paint);" }]
  });
  pliny.class({
    parent: "Primrose",
    name: "Projector",
    description: "| [under construction]"
  });
  pliny.class({
  parent: "Primrose",
  name: "Surface",
  description: "Cascades through a number of options to eventually return a CanvasRenderingContext2D object on which one will perform drawing operations.",
  baseClass: "Primrose.Entity",
  parameters: [{ name: "options.id", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options.bounds", type: "Primrose.Text.Rectangle", description: "The size and location of the surface to create." }]
});
pliny.error({ name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation." });
        pliny.class({
    parent: "Primrose",
    name: "WebRTCSocket",
    description: "[under construction]"
  });
  pliny.class({
    parent: "Primrose",
    name: "Workerize",
    description: "Builds a WebWorker thread out of a JavaScript class's source code, and attempts to create a message interface that matches the message-passing interface that the class already uses.\n\
\n\
Automatically workerized classes should have methods that take a single array for any parameters and return no values. All return results should come through an Event that the class emits.",
    parameters: [{ name: "func", type: "Function", description: "The class function to workerize" }],
    examples: [{
      name: "Create a basic workerized class.",
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
    requestAnimationFrame(paint);" }]
  });
  pliny.property({
      name: "worker",
      type: "WebWorker",
      description: "The worker thread containing our class."
    });
    pliny.property({
      name: "args",
      type: "Array",
      description: "Static allocation of an array to save on memory usage when piping commands to a worker."
    });
    pliny.property({
      name: "listeners",
      type: "Object",
      description: "A bag of arrays of callbacks for each of the class' events."
    });
    pliny.property({
      name: "&lt;mappings for each method in the original class&gt;",
      type: "Function",
      description: "Each mapped function causes a message to be posted to the worker thread with its arguments packed into an array."
    });
    pliny.method({
    parent: "Primrose.Workerize",
    name: "methodShim",
    description: "Posts messages to the worker thread by packing arguments into an array. The worker will receive the array and interpret the first value as the name of the method to invoke and the second value as another array of parameters.",
    parameters: [{ name: "methodName", type: "String", description: "The method inside the worker context that we want to invoke." }, { name: "args", type: "Array", description: "The arguments that we want to pass to the method that we are calling in the worker context." }]
  });
  pliny.method({
    parent: "Primrose.Workerize",
    name: "addEventListener",
    description: "Adding an event listener just registers a function as being ready to receive events, it doesn't do anything with the worker thread yet.",
    parameters: [{ name: "evt", type: "String", description: "The name of the event for which we are listening." }, { name: "thunk", type: "Function", description: "The callback to fire when the event occurs." }]
  });
  pliny.function({
    parent: "Primrose.Workerize",
    name: "createWorker",
    description: "A static function that loads Plain Ol' JavaScript Functions into a WebWorker.",
    parameters: [{ name: "script", type: "(String|Function)", description: "A String defining a script, or a Function that can be toString()'d to get it's script." }, { name: "stripFunc", type: "Boolean", description: "Set to true if you want the function to strip the surround function block scope from the script." }],
    returns: "The WebWorker object."
  });
  pliny.class({
    parent: "Primrose.X",
    name: "LoginForm",
    description: "| [Under Construction]",
    baseClass: "Primrose.Entity"
  });

  pliny.class({
    parent: "Primrose.X",
    name: "SignupForm",
    description: "| [Under Construction]",
    baseClass: "Primrose.Entity"
  });

  pliny.class({
    parent: "Primrose.Controls",
    name: "Label",
    description: "A simple label of text to put on a Surface.",
    baseClass: "Primrose.Surface",
    parameters: [{ name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options", type: "Object", description: "Named parameters for creating the Button." }]
  });

  pliny.class({
    parent: "Primrose.Controls",
    name: "Button2D",
    description: "A simple button to put on a Surface.",
    baseClass: "Primrose.Controls.Label",
    parameters: [{ name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options", type: "Object", description: "Named parameters for creating the Button." }]
  });

  pliny.class({
    parent: "Primrose.Controls",
    name: "Image",
    description: "A simple 2D image to put on a Surface.",
    baseClass: "Primrose.Surface",
    parameters: [{ name: "options", type: "Object", description: "Named parameters for creating the Button." }]
  });

  pliny.function({
  parent: "Primrose.DOM",
  name: "cascadeElement",
  description: "* If `id` is a string, tries to find the DOM element that has said ID\n\
  * If it exists, and it matches the expected tag type, returns the element, or throws an error if validation fails.\n\
  * If it doesn't exist, creates it and sets its ID to the provided id, then returns the new DOM element, not yet placed in the document anywhere.\n\
* If `id` is a DOM element, validates that it is of the expected type,\n\
  * returning the DOM element back if it's good,\n\
  * or throwing an error if it is not\n\
* If `id` is null, creates the DOM element to match the expected type.",
  parameters: [{ name: "id", type: "(String|Element)", description: "A vague reference to the element. Either a String id where the element can be had, a String id to give a newly created element if it does not exist, or an Element to manipulate and validate" }, { name: "tag", type: "String", description: "The HTML tag name of the element we are finding/creating/validating." }, { name: "DOMClass", type: "Class", description: "The class Function that is the type of element that we are frobnicating." }],
  returns: "DOM element",
  examples: [{
    name: "Get an element by ID that already exists.", description: "Assuming the following HTML snippet:\n\
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
    console.assert(elem.textContent === \"Second element\");" }, {
    name: "Validate the tag type.", description: "Assuming the following HTML snippet:\n\
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
    Primrose.DOM.cascadeElement(\"img1\", \"section\", HTMLElement);" }, {
    name: "Create an element.", description: "Assuming the following HTML snippet:\n\
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
    console.assert(elem.parentElement === document.body);" }]
});
pliny.error({ name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation." });
    pliny.function({
  parent: "Primrose.DOM",
  name: "findEverything",
  description: "Searches an element for all sub elements that have a named ID,\n\
using that ID as the name of a field in a hashmap to store a reference to the element.\n\
Basically, a quick way to get at all the named elements in a page.\n\
\n\
> NOTE: You may name your IDs pretty much anything you want, but for ease of use,\n\
> you should name them in a camalCase fashion. See [CamelCase - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/CamelCase).",
  parameters: [{ name: "elem", type: "Element", description: "(Optional) the root element from which to search. Defaults to `document`." }, { name: "obj", type: "Object", description: "(Optional) the object in which to store the element references. If no object is provided, one will be created." }],
  returns: "An object full of element references, with fields named by the ID of the elements that were found.",
  examples: [{
    name: "Get all child elements.", description: "Assuming the following HTML snippet:\n\
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
> img.png" }]
});
pliny.function({
  parent: "Primrose.DOM",
  name: "makeHidingContainer",
  description: "Takes an element and shoves it into a containing element that\n\
is 0x0 pixels in size, with the overflow hidden. Sometimes, we need an element\n\
like a TextArea in the DOM to be able to receive key events, but we don't want the\n\
user to see it, so the makeHidingContainer function makes it easy to make it disappear.",
  parameters: [{
    name: "id", type: "(String|Element)", description: "A vague reference to\n\
the element. Either a String id where the element can be had, a String id to give\n\
a newly created element if it does not exist, or an Element to manipulate and validate." }, { name: "obj", type: "Element", description: "The child element to stow in the hiding container." }],
  returns: "The hiding container element, not yet inserted into the DOM."
});
pliny.class({
    parent: "Primrose.DOM",
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
  });

  pliny.property({
      parent: "Primrose.StateList",
      name: "DOMElement",
      type: "HTMLSelectElement",
      description: "The DOM element that should be put on the page to control the settings."
    });
    pliny.function({
  parent: "Primrose.HTTP",
  name: "get",
  description: "Process an HTTP GET request.",
  returns: "Promise",
  parameters: [{ name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)." }, { name: "url", type: "String", description: "The resource to which the request is being sent." }, { name: "options.progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }],
  examples: [{
    name: "Make a GET request.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.get(\"json\", \"localFile.json\",\n\
      console.log.bind(console, \"progress\"),\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}" }]
});
pliny.function({
  parent: "Primrose.HTTP",
  name: "getBuffer",
  description: "Get an ArrayBuffer from a server.",
  returns: "Promise",
  parameters: [{ name: "url", type: "String", description: "The resource to which the request is being sent." }, { name: "options.progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }],
  examples: [{
    name: "Make a GET request for an ArrayBuffer.",
    description: "Use this to load audio files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var context = new AudioContext();\n\
    Primrose.HTTP.getBuffer(\"audio.mp3\",\n\
      console.log.bind(console, \"progress\"));,\n\
      function(buffer){\n\
        context.decodeAudioData(\n\
          buffer,\n\
          console.log.bind(console, \"success\"),\n\
          console.error.bind(console, \"error decoding\"));\n\
      },\n\
      console.error.bind(console, \"error loading\")\n" }]
});
pliny.function({
  parent: "Primrose.HTTP",
  name: "getObject",
  description: "Get a JSON object from a server.",
  returns: "Promise",
  parameters: [{ name: "url", type: "String", description: "The resource to which the request is being sent." }, { name: "options.progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }],
  examples: [{
    name: "Make a GET request for a JSON object.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.getObject(\"localFile.json\", {\n\
        progress: console.log.bind(console, \"progress\")\n\
      })\n\
      .then(console.log.bind(console, \"done\"))\n\
      .catch(console.error.bind(console)));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}" }]
});
pliny.function({
  parent: "Primrose.HTTP",
  name: "getText",
  description: "Get plain text from a server.",
  returns: "Promise",
  parameters: [{ name: "url", type: "String", description: "The resource to which the request is being sent." }, { name: "optins.progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }],
  examples: [{
    name: "Make a GET request for plain text.",
    description: "Use this to load arbitrary files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.getText(\"localFile.json\",\n\
      console.log.bind(console, \"progress\"),\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console));\n\
\n\
## Results:\n\
> \"Object {field1: 1, field2: \\\"Field2\\\"}\"" }]
});
pliny.function({
  parent: "Primrose.HTTP",
  name: "put",
  description: "Process an HTTP PUT request.",
  returns: "Promise",
  parameters: [{ name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)." }, { name: "url", type: "String", description: "The resource to which the request is being sent." }, { name: "options.data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request." }, { name: "options.progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }]
});
pliny.function({
  parent: "Primrose.HTTP",
  name: "sendObject",
  description: "Send a JSON object to a server.",
  returns: "Promise",
  parameters: [{ name: "url", type: "String", description: "The resource to which the request is being sent." }, { name: "options.data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request." }, { name: "options.progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }]
});
pliny.function({
  parent: "Primrose.HTTP",
  name: "XHR",
  description: "Wraps up the XMLHttpRequest object into a workflow that is easier for me to handle: a single function call. Can handle both GETs and POSTs, with or  without a payload.",
  returns: "Promise",
  parameters: [{ name: "method", type: "String", description: "The HTTP Verb being used for the request." }, { name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)." }, { name: "url", type: "String", description: "The resource to which the request is being sent." }, { name: "options.data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request." }, { name: "options.progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }],
  examples: [{
    name: "Make a GET request.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.XHR(\"GET\", \"json\", \"localFile.json\", {\n\
      progress: console.log.bind(console, \"progress\"))\n\
      .then(console.log.bind(console, \"done\")))\n\
      .catch(console.error.bind(console));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}" }]
});
pliny.class({
    parent: "Primrose.Input",
    name: "Camera",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Input",
    name: "FPSInput",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "Gamepad",
    description: "| [under construction]",
    baseClass: "Primrose.InputProcessor",
    parameters: [{ name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }]
  });

  pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "XBOX_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller."
});
pliny.class({
    parent: "Primrose.Input",
    name: "Keyboard",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]",
    parameters: [{ name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }]
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "LeapMotionInput",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "Location",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "Motion",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "Mouse",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "Speech",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "Touch",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "VR",
    description: "| [under construction]"
  });
  pliny.value({
    parent: "Primrose.Input.VR",
    name: "Version",
    type: "Number",
    baseClass: "Primrose.InputProcessor",
    description: "returns the version of WebVR that is supported (if any). Values:\n\
  - 0: no WebVR support\n\
  - 0.1: Device Orientation-based WebVR\n\
  - 0.4: Mozilla-prefixed Legacy WebVR API\n\
  - 0.5: Legacy WebVR API\n\
  - 1.0: Provisional WebVR API 1.0"
  });

  pliny.class({
    parent: "Primrose.Output",
    name: "Audio3D",
    description: "| [under construction]"
  });
  pliny.method({
    parent: "Primrose.Output.Audio3D",
    name: "loadSound",
    returns: "Promise<MediaElementAudioSourceNode>",
    parameters: [{ name: "sources", type: "String|Array<String>", description: "A string URI to an audio source, or an array of string URIs to audio sources. Will be used as a collection of HTML5 &lt;source> tags as children of an HTML5 &lt;audio> tag." }, { name: "loop", type: "Boolean", description: "(Optional) indicate that the sound should be played on loop." }],
    description: "Loads the first element of the `sources` array for which the browser supports the file format as an HTML5 &lt;audio> tag to use as an `AudioSourceNode` attached to the current `AudioContext`. This does not load all of the audio files. It only loads the first one of a list of options that could work, because all browsers do not support the same audio formats.",
    examples: [{
      name: "Load a single audio file.",
      description: "There is no one, good, compressed audio format supported in all browsers, but they do all support uncompressed WAV. You shouldn't use this on the Internet, but it might be okay for a local solution.\n\
\n\
    grammar(\"JavaScript\");\n\
    var audio = new Primrose.Output.Audio3D();\n\
    audio.loadSource(\"mySong.wav\").then(function(node){\n\
      node.connect(audio.context.destination);\n\
    });"
    }, {
      name: "Load a single audio file from a list of options.",
      description: "There is no one, good, compressed audio format supported in all browsers. As a hack around the problem, HTML5 media tags may include one or more &lt;source> tags as children to specify a cascading list of media sources. The browser will select the first one that it can successfully decode.\n\
\n\
    grammar(\"JavaScript\");\n\
    var audio = new Primrose.Output.Audio3D();\n\
    audio.loadSource([\n\
      \"mySong.mp3\",\n\
      \"mySong.aac\",\n\
      \"mySong.ogg\"\n\
    ]).then(function(node){\n\
      node.connect(audio.context.destination);\n\
    });"
    }, {
      name: "Load an ambient audio file that should be looped.",
      description: "The only audio option that is available is whether or not the audio file should be looped. You specify this with the second parameter to the `loadSource()` method, a `Boolean` value to indicate that looping is desired.\n\
\n\
    grammar(\"JavaScript\");\n\
    var audio = new Primrose.Output.Audio3D();\n\
    audio.loadSource([\n\
      \"mySong.mp3\",\n\
      \"mySong.aac\",\n\
      \"mySong.ogg\"\n\
    ], true).then(function(node){\n\
      node.connect(audio.context.destination);\n\
    });"
    }]
  });
  pliny.class({
    parent: "Primrose.Output",
    name: "HapticGlove",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Output",
    name: "Music",
    description: "| [under construction]"
  });
  pliny.class({
      parent: "Primrose.Output",
      name: "Speech",
      description: "| [under construction]"
    });
    pliny.class({
      parent: "Primrose.Output",
      name: "Speech",
      description: "| [under construction]"
    });
    pliny.function({
  parent: "Primrose.Random",
  name: "int",
  description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive. Includes a means to skew the results in one direction or another.",
  parameters: [{ name: "min", type: "Number", description: "The included minimum side of the range of numbers." }, { name: "max", type: "Number", description: "The excluded maximum side of the range of numbers." }, { name: "power", type: "Number", description: "(Optional) The power to which to raise the random number before scaling and translating into the desired range. Values greater than 1 skew output values to the minimum of the range. Values less than 1 skew output values to the maximum of the range. Defaults to 1." }],
  returns: "A random integer as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  examples: [{
    name: "Generate a random integer numbers on the range [-10, 10).", description: "To generate a random integer on a closed range, call the `Primrose.Random.integer` function as shown:\n\
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
> 0" }, {
    name: "Generate skewed random integer numbers on the range [-100, 100).", description: "To generate a random integer skewed to one end of the range on a closed range, call the `Primrose.Random.integer` function with the `power` parameter as shown:\n\
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
> 52" }]
});
pliny.function({
  parent: "Primrose.Random",
  name: "item",
  description: "Returns a random element from an array.",
  parameters: [{ name: "arr", type: "Array", description: "The array form which to pick items." }],
  returns: "One of the elements of the array, at random.",
  examples: [{
    name: "Select a random element from an array.", description: "To pick an item from an array at random, call the `Primrose.Random.item` function with the `power` parameter as shown:\n\
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
> two" }]
});
pliny.function({
  parent: "Primrose.Random",
  name: "number",
  description: "Returns a random floating-point number on a given range [min, max), i.e. min is inclusive, max is exclusive.",
  parameters: [{ name: "min", type: "Number", description: "The included minimum side of the range of numbers." }, { name: "max", type: "Number", description: "The excluded maximum side of the range of numbers." }],
  returns: "A random number as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  examples: [{
    name: "Generate a random number on the range [-1, 1).", description: "To generate a random number on a closed range, call the `Primrose.Random.number` function as shown:\n\
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
> -0.9659552359953523" }]
});
pliny.function({
  parent: "Primrose.Random",
  name: "steps",
  description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive, sticking to a number of steps in between. Useful for randomly generating music note values on pentatonic scales.",
  parameters: [{ name: "min", type: "Number", description: "The included minimum side of the range of numbers." }, { name: "max", type: "Number", description: "The excluded maximum side of the range of numbers." }, { name: "steps", type: "Number", description: "The number of steps between individual integers, e.g. if min is even and step is even, then no odd numbers will be generated." }],
  returns: "A random integer as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  examples: [{
    name: "Generate random, even numbers.", description: "To generate numbers on a closed range with a constant step size between them, call the `Primrose.Random.step` function as shown:\n\
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
> 36" }]
});
pliny.class({
    parent: "Primrose.Text",
    name: "CodePage",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Text",
    name: "CommandPack",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Text",
    name: "Cursor",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Text",
    name: "Grammar",
    parameters: [{ name: "name", type: "String", description: "A user-friendly name for the grammar, to be able to include it in an options listing." }, { name: "rules", type: "Array", description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code." }],
    description: "A Grammar is a collection of rules for processing text into tokens. Tokens are special characters that tell us about the structure of the text, things like keywords, curly braces, numbers, etc. After the text is tokenized, the tokens get a rough processing pass that groups them into larger elements that can be rendered in color on the screen.\n\
\n\
As tokens are discovered, they are removed from the text being processed, so order is important. Grammar rules are applied in the order they are specified, and more than one rule can produce the same token type.\n\
\n\
See [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names.",
    examples: [{
      name: "A plain-text \"grammar\".", description: "Plain text does not actually have a grammar that needs to be processed. However, to get the text to work with the rendering system, a basic grammar is necessary to be able to break the text up into lines and prepare it for rendering.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var plainTextGrammar = new Primrose.Text.Grammar(\n\
      // The name is for displaying in options views.\n\
      \"Plain-text\", [\n\
      // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
      [\"newlines\", /(?:\\r\\n|\\r|\\n)/] \n\
    ] );" }, {
      name: "A grammar for BASIC", description: "The BASIC programming language is now defunct, but a grammar for it to display in Primrose is quite easy to build.\n\
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
      ] );" }]
  });
  pliny.property({
      parent: "Primrose.Text.Grammar",
      name: " name",
      type: "String",
      description: "A user-friendly name for the grammar, to be able to include it in an options listing."
    });
    pliny.property({
      parent: "Primrose.Text.Grammar",
      name: "grammar",
      type: "Array",
      description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
    });
    pliny.method({
      parent: "Primrose.Text.Grammar",
      name: "tokenize",
      parameters: [{ name: "text", type: "String", description: "The text to tokenize." }],
      returns: "An array of tokens, ammounting to drawing instructions to the renderer. However, they still need to be layed out to fit the bounds of the text area.",
      description: "Breaks plain text up into a list of tokens that can later be rendered with color.",
      examples: [{
        name: 'Tokenize some JavaScript', description: 'Primrose comes with a grammar for JavaScript built in.\n\
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
    ]' }]
    });
    pliny.class({
    parent: "Primrose.Text",
    name: "OperatingSystem",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Text",
    name: "Point",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Text",
    name: "Rectangle",
    description: "| [under construction]"
  });

  pliny.class({
    parent: "Primrose.Text",
    name: "Rule",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Text",
    name: "Size",
    description: "| [under construction]"
  });
  pliny.class({
  parent: "Primrose.Text",
  name: "Terminal",
  description: "| [under construction]"
});
pliny.class({
    parent: "Primrose.Text",
    name: "Token",
    description: "| [under construction]"
  });
  pliny.record({
    parent: "Primrose.Text.CodePages",
    name: "DE_QWERTZ",
    description: "| [under construction]"
  });
  pliny.record({
    parent: "Primrose.Text.CodePages",
    name: "EN_UKX",
    description: "| [under construction]"
  });
  pliny.record({
    parent: "Primrose.Text.CodePages",
    name: "EN_US",
    description: "| [under construction]"
  });
  pliny.record({
    parent: "Primrose.Text.CodePages",
    name: "FR_AZERTY",
    description: "| [under construction]"
  });
  pliny.record({
    parent: "Primrose.Text.CommandPacks",
    name: "TextInput",
    baseClass: "Primrose.Text.CommandPack",
    description: "| [under construction]"
  });

  pliny.record({
    parent: "Primrose.Text.CommandPacks",
    name: "TextEditor",
    description: "| [under construction]"
  });
  pliny.record({
    parent: "Primrose.Text.CommandPacks",
    name: "TextInput",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Text.Controls",
    name: "PlainText",
    description: "| [under construction]"
  });
  pliny.class({
    parent: "Primrose.Text.Controls",
    name: "TextBox",
    description: "Syntax highlighting textbox control.",
    baseClass: "Primrose.Surface",
    parameters: [{ name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options", type: "Object", description: "Named parameters for creating the TextBox." }]
  });

  pliny.class({
    parent: "Primrose.Text.Controls",
    name: "TextInput",
    description: "plain text input box.",
    baseClass: "Primrose.Text.Controls.TextBox",
    parameters: [{ name: "idOrCanvasOrContext", type: "String or HTMLCanvasElement or CanvasRenderingContext2D", description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created." }, { name: "options", type: "Object", description: "Named parameters for creating the TextInput." }]
  });

  pliny.value({
    parent: "Primrose.Text.Grammars",
    name: "Basic",
    description: "| [under construction]"
  });
  pliny.value({
    parent: "Primrose.Text.Grammars",
    name: "JavaScript",
    description: "| [under construction]"
  });
  pliny.value({
    parent: "Primrose.Text.Grammars",
    name: "PlainText",
    description: "| [under construction]"
  });
  pliny.value({
    parent: "Primrose.Text.Grammars",
    name: "TestResults",
    description: "| [under construction]"
  });
  pliny.value({
    parent: "Primrose.Text.OperatingSystems",
    name: "OSX",
    description: "| [under construction]"
  });
  pliny.value({
    parent: "Primrose.Text.OperatingSystems",
    name: "OSX",
    description: "| [under construction]"
  });
  pliny.record({
    parent: "Primrose.Text.Themes",
    name: "Dark",
    description: "| [under construction]"
  });
  pliny.record({
    parent: "Primrose.Text.Themes",
    name: "Default",
    description: "| [under construction]"
  });
  