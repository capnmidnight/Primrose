/*
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
    name: "options",
    type: "Primrose.HTTP.XHR.optionsHash",
    optional: true,
    description: "Options for passing data or tracking progress. See [`Primrose.HTTP.XHR.optionsHash`](#Primrose_HTTP_XHR_optionsHash) for more information."
  }],
  examples: [{
    name: "Make a GET request for plain text.",
    description: `Use this to load arbitrary files and do whatever you want with them.

## Code:

    grammar("JavaScript");
    Primrose.HTTP.getText("localFile.json",
      console.log.bind(console, "progress"),
      console.log.bind(console, "done"),
      console.error.bind(console));

## Results:
> "Object {field1: 1, field2: \\"Field2\\"}"`
  }]
});
*/

import get from "./get";
export default function getText(url, options) {
  return get("text", url, options);
};
