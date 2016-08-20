"use strict";


pliny.function({
  name: "readForm",
  parameters: [{
    name: "ctrls",
    type: "Hash of Elements",
    description: "An array of HTML form elements, aka INPUT, TEXTAREA, SELECT, etc."
  }],
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

function readForm(ctrls) {
  var state = {};
  if (ctrls) {
    for (var name in ctrls) {
      var c = ctrls[name];
      if ((c.tagName === "INPUT" || c.tagName === "SELECT") &&
        (!c.dataset || !c.dataset.skipcache)) {
        if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
          state[name] = c.value;
        }
        else if (c.type === "checkbox" || c.type === "radio") {
          state[name] = c.checked;
        }
      }
    }
  }
  return state;
}