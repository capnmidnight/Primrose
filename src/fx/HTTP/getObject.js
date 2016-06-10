pliny.function({
  parent: "Primrose.HTTP",
  name: "getObject",
  description: "Get a JSON object from a server.",
  returns: "Promise",
  parameters: [
    { name: "url", type: "String", description: "The resource to which the request is being sent." },
    { name: "options.progress", type: "Function", optional: true, description: "A callback function to be called as the download from the server progresses." }
  ],
  examples: [{
    name: "Make a GET request for a JSON object.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.getObject(\"localFile.json\", {\n\
        progress: console.log.bind(console, \"progress\")\n\
      })\n\
      .then(console.log.bind(console, \"done\"))\n\
      .catch(console.error.bind(console)));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"}
  ]
});
Primrose.HTTP.getObject = (url, options) => Primrose.HTTP.get("json", url, options);