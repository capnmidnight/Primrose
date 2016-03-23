"use strict";

pliny.function("Primrose.HTTP", {
  name: "sendObject",
  description: "Send a JSON object to a server.",
  returns: "If no success function is provide, returns a Promise. Otherwise, returns undefined.",
  parameters: [{ name: "url", type: "String", description: "The resource to which the request is being sent." }, { name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request." }, { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }, { name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event." }, { name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs." }]
});
Primrose.HTTP.sendObject = function (url, data, progress, success, error) {
  return Primrose.HTTP.put("json", url, data, progress, success, error);
};
