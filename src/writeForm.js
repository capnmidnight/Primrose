pliny.function({
  name: "writeForm",
  parameters: [{
    name: "ctrls",
    type: "Hash of Elements",
    description: "A hash-collection of HTML input elements that will have their values set."
  }, {
    name: "state",
    type: "Hash object",
    description: "The values that will be set on the form. Hash keys should match IDs of the elements in the `ctrls` parameter."
  }],
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

function writeForm(ctrls, state) {
  if (state) {
    for (var name in ctrls) {
      var c = ctrls[name];
      if (state[name] !== null && state[name] !== undefined &&
        (c.tagName ===
          "INPUT" || c.tagName === "SELECT") && (!c.dataset ||
          !c.dataset.skipcache)) {
        if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
          c.value = state[name];
        }
        else if (c.type === "checkbox" || c.type === "radio") {
          c.checked = state[name];
        }
      }
    }
  }
}