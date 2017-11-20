/*
pliny.function({
  parent: "Primrose.DOM",
  name: "makeHidingContainer",
  description: "Takes an element and shoves it into a containing element that\n\
is 0x0 pixels in size, with the overflow hidden. Sometimes, we need an element\n\
like a TextArea in the DOM to be able to receive key events, but we don't want the\n\
user to see it, so the makeHidingContainer function makes it easy to make it disappear.",
  parameters: [{
    name: "id",
    type: "(String|Element)",
    description: "A vague reference to\n\
the element. Either a String id where the element can be had, a String id to give\n\
a newly created element if it does not exist, or an Element to manipulate and validate."
  }, {
    name: "obj",
    type: "Element",
    description: "The child element to stow in the hiding container."
  }],
  returns: "The hiding container element, not yet inserted into the DOM."
});
*/

import cascadeElement from "./cascadeElement";
export default function makeHidingContainer(id, obj) {
  var elem = cascadeElement(id, "div", window.HTMLDivElement);
  elem.style.position = "absolute";
  elem.style.left = 0;
  elem.style.top = 0;
  elem.style.width = 0;
  elem.style.height = 0;
  elem.style.overflow = "hidden";
  elem.appendChild(obj);
  return elem;
}
