pliny.function("Primrose.HTTP", {
  name: "getObject",
  description: "Get a JSON object from a server.",
  returns: "If no success function is provide, returns a Promise. Otherwise, returns undefined.",
  parameters: [
    { name: "url", type: "String", description: "The resource to which the request is being sent." },
    { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." },
    { name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event." },
    { name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs." }
  ],
  examples: [{
    name: "Make a GET request for a JSON object.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.getObject(\"localFile.json\",\n\
      console.log.bind(console, \"progress\"),\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"}
  ]
});
Primrose.HTTP.getObject = function (url, progress, success, error) {
  return Primrose.HTTP.get("json", url, progress, success, error);
};