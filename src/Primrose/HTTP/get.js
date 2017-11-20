/*
pliny.function({
  parent: "Primrose.HTTP",
  name: "get",
  description: "Process an HTTP GET request.",
  returns: "Promise",
  parameters: [{
    name: "type",
    type: "String",
    description: `How the response should be interpreted. One of ["text", "json", "arraybuffer"]. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype).`,
    default: `"text"`
  }, {
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
    name: "Make a GET request.",
    description: `Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.

## Code:

    grammar("JavaScript");
    Primrose.HTTP.get("json", "localFile.json",
      console.log.bind(console, "progress"),
      console.log.bind(console, "done"),
      console.error.bind(console));

## Results:
> Object {field1: 1, field2: "Field2"}`
  }]
});
*/

import XHR from "./XHR";
export default function get(type, url, options) {
  return XHR("GET", type || "text", url, options);
};
