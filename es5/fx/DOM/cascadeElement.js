"use strict";

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
Primrose.DOM.cascadeElement = function (id, tag, DOMClass) {
  var elem = null;
  if (id === null) {
    elem = document.createElement(tag);
    elem.id = id = "auto_" + tag + Date.now();
  } else if (DOMClass === undefined || id instanceof DOMClass) {
    elem = id;
  } else if (typeof id === "string") {
    elem = document.getElementById(id);
    if (elem === null) {
      elem = document.createElement(tag);
      elem.id = id;
    } else if (elem.tagName !== tag.toUpperCase()) {
      elem = null;
    }
  }

  if (elem === null) {
    pliny.error({ name: "Invalid element", type: "Error", description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation." });
    throw new Error(id + " does not refer to a valid " + tag + " element.");
  } else if (tag !== "canvas") {
    elem.innerHTML = "";
  }
  return elem;
};