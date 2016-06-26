Primrose.HTTP.get = (function () {
  "use strict";

  pliny.function({
    parent: "Primrose.HTTP",
    name: "get",
    description: "Process an HTTP GET request.",
    returns: "Promise",
    parameters: [{
      name: "type",
      type: "String",
      description: "How the response should be interpreted. One of [\"text\", \"json\", \"arraybuffer\"]. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype).",
      default: "\"text\""
    }, {
      name: "url",
      type: "String",
      description: "The resource to which the request is being sent."
    }, {
      name: "options.progress",
      type: "Function",
      optional: true,
      description: "A callback function to be called as the download from the server progresses."
    }],
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
> Object {field1: 1, field2: \"Field2\"}"
    }]
  });
  return (type, url, options) => Primrose.HTTP.XHR("GET", type || "text", url, options);
})();