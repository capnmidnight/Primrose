pliny.function("Primrose.HTTP", {
  name: "XHR",
  description: "Wraps up the XMLHttpRequest object into a workflow that is easier for me to handle: a single function call. Can handle both GETs and POSTs, with or  without a payload.",
  parameters: [
    { name: "method", type: "String", description: "The HTTP Verb being used for the request." },
    { name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype)." },
    { name: "url", type: "String", description: "The resource to which the request is being sent." },
    { name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request." },
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
    Primrose.HTTP.XHR(\"GET\", \"json\", \"localFile.json\",\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console),\n\
      console.log.bind(console, \"progress\"));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"}
  ]
});
Primrose.HTTP.XHR = function (method, type, url, data, progress, success, error) {

  var promise = new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onprogress = progress;
    xhr.onerror = reject;
    xhr.onabort = reject;
    xhr.onload = function () {
      // The other error events are client-errors. If there was a server error,
      // we'd find out about it during this event. We need to only respond to
      // successful requests, i.e. those with HTTP status code in the 200 or 300
      // range.
      if (xhr.status < 400) {
        if (resolve) {
          resolve(xhr.response);
        }
      }
      else if (reject) {
        reject(xhr);
      }
    };

    // The order of these operations is very explicit. You have to call open
    // first. It seems counter intuitive, but think of it more like you're opening
    // an HTTP document to be able to write to it, and then you finish by sending
    // the document. The "open" method does not refer to a network connection.
    xhr.open(method, url);
    if (type) {
      xhr.responseType = type;
    }

    if (data) {
      // We could do other data types, but in my case, I'm probably only ever
      // going to want JSON. No sense in overcomplicating the interface for
      // features I'm not going to use.
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(data));
    }
    else {
      xhr.send();
    }
  });

  if (success) {
    promise.then(success, error);
  }
  else {
    return promise;
  }
};