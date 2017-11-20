/*
pliny.function({
  parent: "Primrose.HTTP",
  name: "del",
  description: "Process an HTTP DELETE request.",
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
  }]
});
*/

import XHR from "./XHR";
export default function del(type, url, options) {
  return XHR("DELETE", type, url, options);
};
