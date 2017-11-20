/*
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
    description: `How the response should be interpreted. One of ["text", "json", "arraybuffer"]. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype).`,
    default: `"text"`
  }, {
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options",
    type: "Primrose.HTTP.XHR.optionsHash",
    optional: true,
    description: "Options for passing data or tracking progress. See [`Primrose.HTTP.XHR.optionsHash`](#Primrose_HTTP_XHR_optionsHash) for more information."
  }],
  examples: [{
    name: "Make a GET request.",
    description: `Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.

## Code:

    grammar("JavaScript");
    Primrose.HTTP.XHR("GET", "json", "localFile.json", {
      progress: console.log.bind(console, "progress"))
      .then(console.log.bind(console, "done")))
      .catch(console.error.bind(console));

## Results:
> Object {field1: 1, field2: "Field2"}`
  }]
});
*/

/*
pliny.record({
  parent: "Primrose.HTTP.XHR",
  name: "optionsHash",
  description: "Options for passing data or tracking progress.",
  parameters: [{
    name: "data",
    type: "Object",
    optional: true,
    description: "The data object to use as the request body payload, if this is a POST request."
  }, {
    name: "progress",
    type: "Function",
    optional: true,
    description: "A callback function to use for tracking progress. The callback function should accept a standard [`ProgressEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent)."
  }]
});
*/

export default function XHR(method, type, url, options) {
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
    // the document. The `open` method does not refer to a network connection.
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
