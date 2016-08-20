"use strict";

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
    name: "options.data",
    type: "Object",
    description: "The data object to use as the request body payload, if this is a PUT request."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }]
});

function delObject(url, options) {
  return Primrose.HTTP.del("json", url, options);
}