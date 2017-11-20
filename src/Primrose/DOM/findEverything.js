/*
pliny.function({
  parent: "Primrose.DOM",
  name: "findEverything",
  description: "Searches an element for all sub elements that have a named ID,\n\
using that ID as the name of a field in a hashmap to store a reference to the element.\n\
Basically, a quick way to get at all the named elements in a page. Returns an object full\n\
of element references, with fields named by the ID of the elements that were found.\n\
\n\
> NOTE: You may name your IDs pretty much anything you want, but for ease of use,\n\
> you should name them in a camalCase fashion. See [CamelCase - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/CamelCase).",
  parameters: [{
    name: "elem",
    type: "Element",
    optional: true,
    description: "the root element from which to search.",
    default: "`document`."
  }, {
    name: "obj",
    type: "Object",
    optional: true,
    description: "the object in which to store the element references. If no object is provided, one will be created."
  }],
  returns: "Object",
  examples: [{
    name: "Get all child elements.",
    description: "Assuming the following HTML snippet:\n\
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
  var elems = Primrose.DOM.findEverything();\n\
  console.log(elems.First.innerHTML);\n\
  console.log(elems[\"second-elem\"].textContent);\n\
  console.log(elems.img1.src);\n\
\n\
## Results:\n\
> first element  \n\
> Second element  \n\
> img.png"
  }]
});
*/

export default function findEverything(elem, obj) {
  elem = elem || document;
  obj = obj || {};
  var arr = elem.querySelectorAll("*");
  for (var i = 0; i < arr.length; ++i) {
    var e = arr[i];
    if (e.id && e.id.length > 0) {
      obj[e.id] = e;
      if (e.parentElement) {
        e.parentElement[e.id] = e;
      }
    }
  }
  return obj;
}
