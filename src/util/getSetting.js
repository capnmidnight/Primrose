/*
pliny.function({
  parent: "Util",
  name: "getSetting",
  parameters: [{
    name: "settingName",
    type: "string",
    description: "The name of the setting to read."
  }, {
    name: "defValue",
    type: "Object",
    description: "The default value to return, if the setting is not present in `localStorage`."
  }],
  returns: "The Object stored in `localStorage` for the given name, or the default value provided if the setting doesn't exist in `localStorage`.",
  description: "Retrieves named values out of `localStorage`. The values should\n\
be valid for passing to `JSON.parse()`. A default value can be specified in the\n\
function call that should be returned if the value does not exist, or causes an\n\
error in parsing. Typically, you'd call this function at page-load time after having\n\
called the [`setSetting()`](#setSetting) function during a previous page session.",
  examples: [{
    name: "Basic usage",
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
    }, false);"
  }]
});
*/

export default function getSetting(settingName, defValue) {
  if (window.localStorage) {
    var val = window.localStorage.getItem(settingName);
    if (val) {
      try {
        return JSON.parse(val);
      }
      catch (exp) {
        console.error("getSetting", settingName, val, typeof (val), exp);
        console.error(exp);
        console.error("getSetting", settingName, val, typeof (val));
      }
    }
  }
  return defValue;
};
