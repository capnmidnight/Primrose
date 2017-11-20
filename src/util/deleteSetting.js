/*
pliny.function({
  parent: "Util",
  name: "deleteSetting",
  parameters: [{
    name: "settingName",
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
*/

export default function deleteSetting(settingName) {
  if (window.localStorage) {
    window.localStorage.removeItem(settingName);
  }
};
