/* global pliny */

pliny.issue( "", {
  name: "document getSetting",
  type: "open",
  description: "Finish writing the documentation for the `getSetting()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "getSetting",
  parameters: [ ],
  returns: "Object",
  description: "",
  examples: [ ]
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
  type: "open",
  description: "Finish writing the documentation for the `setSetting()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "setSetting",
  parameters: [ ],
  description: "",
  examples: [ ]
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
  type: "open",
  description: "Finish writing the documentation for the `deleteSetting()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "deleteSetting",
  parameters: [ ],
  returns: "Object",
  description: "",
  examples: [ ]
} );
function deleteSetting ( name ) {
  if ( window.localStorage ) {
    window.localStorage.removeItem( name );
  }
}

pliny.issue( "", {
  name: "document readForm",
  type: "open",
  description: "Finish writing the documentation for the `readForm()` function in the helpers/forms.js file."
} );
pliny.function( "", {
  name: "readForm",
  parameters: [ ],
  returns: "Object",
  description: "",
  examples: [ ]
} );
function readForm ( ctrls ) {
  var state = {};
  if ( ctrls ) {
    for ( var name in ctrls ) {
      var c = ctrls[name];
      if ( ( c.tagName === "INPUT" || c.tagName === "SELECT" ) &&
          ( !c.dataset || !c.dataset.skipcache ) ) {
        if ( c.type === "text" || c.type === "password" || c.tagName ===
            "SELECT" ) {
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
