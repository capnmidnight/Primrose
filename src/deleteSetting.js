"use strict";

pliny.function({
  name: "deleteSetting",
  parameters: [{
    name: " name",
    type: "string",
    description: "The name of the setting to delete."
  }],
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

function deleteSetting(name) {
  if (window.localStorage) {
    window.localStorage.removeItem(name);
  }
}