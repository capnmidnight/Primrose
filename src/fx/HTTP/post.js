pliny.function({
  parent: "Primrose.HTTP",
  name: "put",
  description: "Process an HTTP PUT request.",
  returns: "Promise",
  parameters: [
    { name: "type", type: "String", description: "How the response should be interpreted. One of [\"text\", \"json\", \"arraybuffer\"]. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype).", default: "\"text\"" },
    { name: "url", type: "String", description: "The resource to which the request is being sent." },
    { name: "options.data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request." },
    { name: "options.progress", type: "Function", optional: true, description: "A callback function to be called as the download from the server progresses." },
  ]
});
Primrose.HTTP.post = (type, url, options) => Primrose.HTTP.XHR("POST", type, url, options);