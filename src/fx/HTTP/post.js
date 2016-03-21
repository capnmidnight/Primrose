pliny.function("Primrose.HTTP", {
  name: "put",
  description: "Process an HTTP PUT request.",
  returns: "If no success function is provide, returns a Promise. Otherwise, returns undefined.",
  parameters: [
    { name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)." },
    { name: "url", type: "String", description: "The resource to which the request is being sent." },
    { name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request." },
    { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." },
    { name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event." },
    { name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs." }
  ]
});
Primrose.HTTP.post = function (type, url, data, progress, success, error) {
  return Primrose.HTTP.XHR("POST", type, url, data, progress, success, error);
};