Primrose.HTTP.del = (function () {
  "use strict";

  pliny.function({
    parent: "Primrose.HTTP",
    name: "del",
    description: "Process an HTTP DELETE request.",
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
      name: "options.data",
      type: "Object",
      description: "The data object to use as the request body payload."
    }, {
      name: "options.progress",
      type: "Function",
      optional: true,
      description: "A callback function to be called as the download from the server progresses."
    }, ]
  });
  return (type, url, options) => Primrose.HTTP.XHR("DELETE", type, url, options);
})();