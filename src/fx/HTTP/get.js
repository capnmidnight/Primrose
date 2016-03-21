pliny.function("Primrose.HTTP", {
  name: "get",
  description: "Process an HTTP GET request.",
  returns: "If no success function is provide, returns a Promise. Otherwise, returns undefined.",
  parameters: [
    { name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)." },
    { name: "url", type: "String", description: "The resource to which the request is being sent." },
    { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." },
    { name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event." },
    { name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs." }
  ],
  examples: [{
    name: "Make a GET request.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.get(\"json\", \"localFile.json\",\n\
      console.log.bind(console, \"progress\"),\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"}
  ]
});
Primrose.HTTP.get = function (type, url, progress, success, error) {
  return Primrose.HTTP.XHR("GET", type || "text", url, null, progress, success, error);
};