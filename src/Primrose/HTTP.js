pliny.namespace({
  parent: "Primrose",
  name: "HTTP",
  description: "A collection of basic XMLHttpRequest wrappers."
});

pliny.function({
  parent: "Primrose.HTTP",
  name: "XHR",
  description: "Wraps up the XMLHttpRequest object into a workflow that is easier for me to handle: a single function call. Can handle both GETs and POSTs, with or  without a payload.",
  returns: "Promise",
  parameters: [{
    name: "method",
    type: "String",
    description: "The HTTP Verb being used for the request."
  }, {
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
    description: "The data object to use as the request body payload, if this is a PUT request."
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
  Primrose.HTTP.XHR(\"GET\", \"json\", \"localFile.json\", {\n\
    progress: console.log.bind(console, \"progress\"))\n\
    .then(console.log.bind(console, \"done\")))\n\
    .catch(console.error.bind(console));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"
  }]
});

export function XHR(method, type, url, options) {
  return new Promise(function (resolve, reject) {
    options = options || {};
    options.headers = options.headers || {};
    if (method === "POST") {
      options.headers["Content-Type"] = options.headers["Content-Type"] || type;
    }

    var req = new XMLHttpRequest();
    req.onerror = (evt) => reject(new Error("Request error: " + evt.message));
    req.onabort = (evt) => reject(new Error("Request abort: " + evt.message));
    req.onload = function () {
      // The other error events are client-errors. If there was a server error,
      // we'd find out about it during this event. We need to only respond to
      // successful requests, i.e. those with HTTP status code in the 200 or 300
      // range.
      if (req.status < 400) {
        resolve(req.response);
      }
      else {
        reject(req);
      }
    };

    // The order of these operations is very explicit. You have to call open
    // first. It seems counter intuitive, but think of it more like you're opening
    // an HTTP document to be able to write to it, and then you finish by sending
    // the document. The "open" method does not refer to a network connection.
    req.open(method, url);
    if (type) {
      req.responseType = type;
    }

    req.onprogress = options.progress;

    for (var key in options.headers) {
      req.setRequestHeader(key, options.headers[key]);
    }

    req.withCredentials = !!options.withCredentials;

    if (options.data) {
      req.send(JSON.stringify(options.data));
    }
    else {
      req.send();
    }
  });
};


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
  }]
});
export function del(type, url, options) {
  return XHR("DELETE", type, url, options);
};

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

export function delObject(url, options) {
  return del("json", url, options);
};


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

export function get(type, url, options) {
  return XHR("GET", type || "text", url, options);
};


pliny.function({
  parent: "Primrose.HTTP",
  name: "getBuffer",
  description: "Get an ArrayBuffer from a server.",
  returns: "Promise",
  parameters: [{
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
    name: "Make a GET request for an ArrayBuffer.",
    description: "Use this to load audio files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var context = new AudioContext();\n\
  Primrose.HTTP.getBuffer(\"audio.mp3\",\n\
    console.log.bind(console, \"progress\"));,\n\
    function(buffer){\n\
      context.decodeAudioData(\n\
        buffer,\n\
        console.log.bind(console, \"success\"),\n\
        console.error.bind(console, \"error decoding\"));\n\
    },\n\
    console.error.bind(console, \"error loading\")\n"
  }]
});

export function getBuffer(url, options) {
  return get("arraybuffer", url, options);
};


pliny.function({
  parent: "Primrose.HTTP",
  name: "getObject",
  description: "Get a JSON object from a server.",
  returns: "Promise",
  parameters: [{
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
> Object {field1: 1, field2: \"Field2\"}"
  }]
});

export function getObject(url, options) {
  return get("json", url, options);
};


pliny.function({
  parent: "Primrose.HTTP",
  name: "getText",
  description: "Get plain text from a server. Returns a promise that will be resolve with the text retrieved from the server.",
  returns: "Promise",
  parameters: [{
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
    name: "Make a GET request for plain text.",
    description: "Use this to load arbitrary files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  Primrose.HTTP.getText(\"localFile.json\",\n\
    console.log.bind(console, \"progress\"),\n\
    console.log.bind(console, \"done\"),\n\
    console.error.bind(console));\n\
\n\
## Results:\n\
> \"Object {field1: 1, field2: \\\"Field2\\\"}\""
  }]
});

export function getText(url, options) {
  return get("text", url, options);
};

pliny.function({
  parent: "Primrose.HTTP",
  name: "post",
  description: "Process an HTTP POST request.",
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
    description: "The data object to use as the request body payload, if this is a POST request."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }]
});

export function post(type, url, options) {
  return XHR("POST", type, url, options);
};


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

export function postObject(url, options) {
  return post("json", url, options);
};

import * as HTTP from ".";
export default HTTP;