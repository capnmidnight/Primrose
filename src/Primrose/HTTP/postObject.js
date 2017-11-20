/*
pliny.function({
  parent: "Primrose.HTTP",
  name: "postObject",
  description: "Send a JSON object to a server.",
  returns: "Promise",
  parameters: [{
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options",
    type: "Primrose.HTTP.XHR.optionsHash",
    optional: true,
    description: "Options for passing data or tracking progress. See [`Primrose.HTTP.XHR.optionsHash`](#Primrose_HTTP_XHR_optionsHash) for more information. The `data` field is not optional."
  }]
});
*/

import post from "./post";
export default function postObject(url, options) {
  return post("json", url, options);
};
