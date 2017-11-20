/*
pliny.function({
  parent: "Primrose.HTTP",
  name: "getObject",
  description: "Get a JSON object from a server.",
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
    name: "Make a GET request for a JSON object.",
    description: `Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.

## Code:

    grammar("JavaScript");
    Primrose.HTTP.getObject("localFile.json", {
        progress: console.log.bind(console, "progress")
      })
      .then(console.log.bind(console, "done"))
      .catch(console.error.bind(console)));

## Results:
> Object {field1: 1, field2: "Field2"}`
  }]
});
*/

import get from "./get";
export default function getObject(url, options) {
  return get("json", url, options);
};
