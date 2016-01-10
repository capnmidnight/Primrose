/* global Primrose, pliny */

Primrose.HTTP = ( function () {

  /////
  // Wraps up the XMLHttpRequest object into a workflow that is easier for me to
  // handle: a single function call. Can handle both GETs and POSTs, with or
  // without a payload.
  // 
  // @param {String} url - the Universal Resource Locator to which we are sending the request.
  // @param {String} method - the HTTP Verb being used for the request
  // @param {String} type - the type of data we expect back: "text", "json", "arraybuffer". See here for more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
  // @param {Function} progress - the callback to issue whenever a progress event comes in.
  // @param {Function} error - the callback to issue whenever an error occurs
  // @param {Function} success - the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event.
  // @param {Object} data - (Optional) data that we what to include in the request header payload, as a JSON object (application/json MIME type).
  ///
  function XHR ( url, method, type, progress, error, success, data ) {
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
      xhr.setRequestHeader( "Content-Type",
          "application/json;charset=UTF-8" );
      xhr.send( JSON.stringify( data ) );
    }
    else {
      xhr.send();
    }
  }

  pliny.theElder.namespace( "Primrose.HTTP", "A collection of basic XMLHttpRequest wrappers." );
  var HTTP = {};

  pliny.theElder.function( "Primrose.HTTP", {
    name: "get",
    description: "Process an HTTP GET request.",
    parameters: [
      {name: "url", type: "String", description: ""},
      {name: "type", type: "String", description: ""},
      {name: "progress", type: "Function", description: ""},
      {name: "error", type: "Function", description: ""},
      {name: "success", type: "Function", description: ""}
    ]
  } );
  HTTP.get = function ( url, type, progress, error, success ) {
    type = type || "text";

    var progressThunk = success && error && progress,
        errorThunk = ( success && error ) || ( error && progress ),
        successThunk = success || error || progress;
    XHR( url, "GET", type, progressThunk, errorThunk, successThunk );
  };


  pliny.theElder.function( "Primrose.HTTP", {
    name: "put",
    description: "Process an HTTP PUT request.",
    parameters: [
      {name: "url", type: "String", description: ""},
      {name: "type", type: "String", description: ""},
      {name: "progress", type: "Function", description: ""},
      {name: "error", type: "Function", description: ""},
      {name: "success", type: "Function", description: ""}
    ]
  } );
  HTTP.post = function ( url, data, type, progress, error, success ) {
    var progressThunk = success && error && progress,
        errorThunk = ( success && error ) || ( error && progress ),
        successThunk = success || error || progress;
    XHR( url, "POST", type, progressThunk, errorThunk, successThunk, data );
  };



  pliny.theElder.function( "Primrose.HTTP", {
    name: "getObject",
    description: "Get a JSON object from a server.",
    parameters: [
      {name: "url", type: "String", description: ""},
      {name: "progress", type: "Function", description: ""},
      {name: "error", type: "Function", description: ""},
      {name: "success", type: "Function", description: ""}
    ]
  } );
  HTTP.getObject = function ( url, progress, error, success ) {
    var progressThunk = success && error && progress,
        errorThunk = ( success && error ) || ( error && progress ),
        successThunk = success || error || progress;
    GET( url, "json", progressThunk, errorThunk, successThunk );
  };



  pliny.theElder.function( "Primrose.HTTP", {
    name: "sendObject",
    description: "Send a JSON object to a server.",
    parameters: [
      {name: "url", type: "String", description: ""},
      {name: "data", type: "Object", description: ""},
      {name: "progress", type: "Function", description: ""},
      {name: "error", type: "Function", description: ""},
      {name: "success", type: "Function", description: ""}
    ]
  } );
  HTTP.sendObject = function ( url, data, progress, error, success ) {
    POST( url, data, "json",
        success && error && progress,
        ( success && error ) || ( error && progress ),
        success || error || progress );
  };

  return HTTP;
} )();