"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "getText",
  description: "Get plain text from a server. Returns a promise that will be resolve with the text retrieved from the server.",
  returns: "Promise",
  parameters: [{
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Make a GET request for plain text.",
    description: "Use this to load arbitrary files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  Primrose.HTTP.getText(\"localFile.json\",\n\
    console.log.bind(console, \"progress\"),\n\
    console.log.bind(console, \"done\"),\n\
    console.error.bind(console));\n\
\n\
## Results:\n\
> \"Object {field1: 1, field2: \\\"Field2\\\"}\""
  }]
});

function getText(url, options) {
  return Primrose.HTTP.get("text", url, options);
}