/*
pliny.function({
  parent: "Util",
  name: "setSetting",
  parameters: [{
    name: "settingName",
    type: "string",
    description: "The name of the setting to set."
  }, {
    name: "val",
    type: "Object",
    description: "The value to write. It should be useable as a parameter to `JSON.stringify()`."
  }],
  description: "Writes named values to `localStorage`. The values should be valid\n\
for passing to `JSON.stringify()`. Typically, you'd call this function at page-unload\n\
time, then call the [`getSetting()`](#getSetting) function during a subsequent page load.",
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

export default function setSetting(settingName, val) {
  if (window.localStorage && val) {
    try {
      window.localStorage.setItem(settingName, JSON.stringify(val));
    }
    catch (exp) {
      console.error("setSetting", settingName, val, typeof (val), exp);
    }
  }
};
