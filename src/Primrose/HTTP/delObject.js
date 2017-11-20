/*
pliny.function({
  parent: "Primrose.HTTP",
  name: "delObject",
  description: "Delete something on the server, and receive JSON in response.",
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
  }]
});
*/

import del from "./del";
export default function delObject(url, options) {
  return del("json", url, options);
};
