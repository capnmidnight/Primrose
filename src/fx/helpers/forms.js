/* global pliny */

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
``var text1 = document.getElementById(\"text1\");\n\
document.addEventListener(\"unload\", function(){\n\
  setSetting(\"text1-value\", text1.value);\n\
}, false);\n\
document.addEventListener(\"load\", function(){\n\
  text1.value = getSetting(\"text1-value\", \"My default value!\");\n\
}, false);``"} ]
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
``var text1 = document.getElementById(\"text1\");\n\
document.addEventListener(\"unload\", function(){\n\
  setSetting(\"text1-value\", text1.value);\n\
}, false);\n\
document.addEventListener(\"load\", function(){\n\
  text1.value = getSetting(\"text1-value\", \"My default value!\");\n\
}, false);``"} ]
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
      description: "``console.assert(getSetting(\"A\", \"default-A\") === \"default-A\");\n\
setSetting(\"A\", \"modified-A\");\n\
console.assert(getSetting(\"A\", \"default-A\") === \"modified-A\");\n\
deleteSetting(\"A\");\n\
console.assert(getSetting(\"A\", \"default-A\") === \"default-A\");``"
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
    {name: "ctrls", type: "Array of Elements", description: "An array of HTML form elements, aka INPUT, TEXTAREA, SELECT, etc."}
  ],
  returns: "Object",
  description: "Scans through an array of input elements and builds a state object that contains the values the input elements represent. Elements that do not have an ID attribute set, or have an attribute `data-skipcache` set, will not be included.",
  examples: [ {
      name: "Basic usage",
      description: "Assuming the following HTML form:\n\
``<form>\n\
  <input type=\"text\" id=\"txt\" value=\"hello\">\n\
  <input type=\"number\" id=\"num\" value=\"5\">\n\
</form>``\n\
Code:\n\
``var ctrls = findEverything();\n\
var state = readForm(ctrls);\n\
console.assert(state.txt === \"hello\");\n\
console.assert(state.num === \"5\");``"
  }]
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
  type: "open",
  description: "Finish writing the documentation for the `writeForm()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "writeForm",
  parameters: [ ],
  description: "",
  examples: [ ]
} );
function writeForm ( ctrls, state ) {
  if ( state ) {
    for ( var name in ctrls ) {
      var c = ctrls[name];
      if ( state[name] !== null && state[name] !== undefined &&
          ( c.tagName ===
              "INPUT" || c.tagName === "SELECT" ) && ( !c.dataset ||
          !c.dataset.skipcache ) ) {
        if ( c.type === "text" || c.type === "password" || c.tagName ===
            "SELECT" ) {
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
  name: "document helpers/forms",
  type: "open",
  description: "Finish writing the documentation for the [forms](#forms) class in the helpers/ directory."
} );
