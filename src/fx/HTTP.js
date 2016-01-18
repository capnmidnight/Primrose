/* global Primrose, pliny */

Primrose.HTTP = ( function () {

  pliny.namespace( "Primrose.HTTP", "A collection of basic XMLHttpRequest wrappers." );
  var HTTP = {};


  pliny.function( "Primrose.HTTP", {
    name: "XHR",
    description: "Wraps up the XMLHttpRequest object into a workflow that is easier for me to handle: a single function call. Can handle both GETs and POSTs, with or  without a payload.",
    parameters: [
      {name: "method", type: "String", description: "The HTTP Verb being used for the request."},
      {name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the ref#[1]."},
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [ {
        name: "Make a GET request.",
        description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
Code:\n\
``Primrose.HTTP.XHR(\"GET\", \"json\", \"localFile.json\",\n\
  console.log.bind(console, \"done\"),\n\
  console.error.bind(console),\n\
  console.log.bind(console, \"progress\"));``\n\
Results:\n\
``Object {field1: 1, field2: \"Field2\"}``"}
    ],
    references: [
      {name: "MDN - XMLHttpRequest - responseType", description: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype"}
    ]
  } );
  HTTP.XHR = function ( method, type, url, data, success, error, progress ) {
    var xhr = new XMLHttpRequest();
    xhr.onerror = error;
    xhr.onabort = error;
    xhr.onprogress = progress;
    xhr.onload = function () {
      // The other error events are client-errors. If there was a server error,
      // we'd find out about it during this event. We need to only respond to
      // successful requests, i.e. those with HTTP status code in the 200 or 300
      // range.
      if ( xhr.status < 400 ) {
        if ( success ) {
          success( xhr.response );
        }
      }
      else if ( error ) {
        error();
      }
    };

    // The order of these operations is very explicit. You have to call open
    // first. It seems counter intuitive, but think of it more like you're opening
    // an HTTP document to be able to write to it, and then you finish by sending
    // the document. The "open" method does not refer to a network connection.
    xhr.open( method, url );
    if ( type ) {
      xhr.responseType = type;
    }
    if ( data ) {
      // We could do other data types, but in my case, I'm probably only ever
      // going to want JSON. No sense in overcomplicating the interface for
      // features I'm not going to use.
      xhr.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
      xhr.send( JSON.stringify( data ) );
    }
    else {
      xhr.send();
    }
  };



  pliny.function( "Primrose.HTTP", {
    name: "get",
    description: "Process an HTTP GET request.",
    parameters: [
      {name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the ref#[1]."},
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [ {
        name: "Make a GET request.",
        description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
Code:\n\
``Primrose.HTTP.get(\"json\", \"localFile.json\",\n\
  console.log.bind(console, \"done\"),\n\
  console.error.bind(console),\n\
  console.log.bind(console, \"progress\"));``\n\
Results:\n\
``Object {field1: 1, field2: \"Field2\"}``"}
    ],
    references: [
      {name: "MDN - XMLHttpRequest - responseType", description: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype"}
    ]
  } );
  HTTP.get = function ( type, url, success, error, progress ) {
    HTTP.XHR( "GET", type || "text", url, null, success, error, progress );
  };


  pliny.function( "Primrose.HTTP", {
    name: "put",
    description: "Process an HTTP PUT request.",
    parameters: [
      {name: "type", type: "String", description: "How the response should be interpreted. Defaults to \"text\". \"json\", \"arraybuffer\", and other values are also available. See the ref#[1]."},
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    references: [
      {name: "MDN - XMLHttpRequest - responseType", description: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype"}
    ]
  } );
  HTTP.post = function ( type, url, data, success, error, progress ) {
    HTTP.XHR( "POST", type, url, data, success, error, progress );
  };



  pliny.function( "Primrose.HTTP", {
    name: "getObject",
    description: "Get a JSON object from a server.",
    parameters: [
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [ {
        name: "Make a GET request for a JSON object.",
        description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
Code:\n\
``Primrose.HTTP.getObject(\"localFile.json\",\n\
  console.log.bind(console, \"done\"),\n\
  console.error.bind(console),\n\
  console.log.bind(console, \"progress\"));``\n\
Results:\n\
``Object {field1: 1, field2: \"Field2\"}``"}
    ],
    references: [
      {name: "MDN - XMLHttpRequest - responseType", description: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype"}
    ]
  } );
  HTTP.getObject = function ( url, success, error, progress ) {
    HTTP.get( "json", url, success, error, progress );
  };



  pliny.function( "Primrose.HTTP", {
    name: "sendObject",
    description: "Send a JSON object to a server.",
    parameters: [
      {name: "url", type: "String", description: "The resource to which the request is being sent."},
      {name: "data", type: "Object", description: "The data object to use as the request body payload, if this is a PUT request."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}

    ],
    references: [
      {name: "MDN - XMLHttpRequest - responseType", description: "https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype"}
    ]
  } );
  HTTP.sendObject = function ( url, data, success, error, progress ) {
    HTTP.put( "json", url, data, success, error, progress );
  };

  return HTTP;
} )();