/* global Primrose, pliny */
Primrose.HTTP = ( function () {

  /**
   * Wraps up the XMLHttpRequest object into a workflow that is easier for me to
   * handle: a single function call. Can handle both GETs and POSTs, with or
   * without a payload.
   * 
   * @param {String} url - the Universal Resource Locator to which we are sending the request.
   * @param {String} method - the HTTP Verb being used for the request
   * @param {String} type - the type of data we expect back: "text", "json", "arraybuffer". See here for more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @param {Function} progress - the callback to issue whenever a progress event comes in.
   * @param {Function} error - the callback to issue whenever an error occurs
   * @param {Function} success - the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event.
   * @param {Object} data - (Optional) data that we what to include in the request header payload, as a JSON object (application/json MIME type).
   */
  function XHR ( url, method, type, progress, error, success, data ) {
    var xhr = new XMLHttpRequest();
    xhr.onerror = error;
    xhr.onabort = error;
    xhr.onprogress = progress;
    xhr.onload = function () {
      if ( xhr.status < 400 ) {
        if ( success ) {
          success( xhr.response );
        }
      }
      else if ( error ) {
        error();
      }
    };

    xhr.open( method, url );
    if ( type ) {
      xhr.responseType = type;
    }
    if ( data ) {
      xhr.setRequestHeader( "Content-Type",
          "application/json;charset=UTF-8" );
      xhr.send( JSON.stringify( data ) );
    }
    else {
      xhr.send();
    }
  }

  pliny.theElder.namespace("Primrose.HTTP", "A collection of basic XMLHttpRequest wrappers.");
  var HTTP = {};

  HTTP.get = function ( url, type, progress, error, success ) {
    type = type || "text";

    var progressThunk = success && error && progress,
        errorThunk = ( success && error ) || ( error && progress ),
        successThunk = success || error || progress;
    XHR( url, "GET", type, progressThunk, errorThunk, successThunk );
  };
  
  
  HTTP.post = function ( url, data, type, progress, error, success ) {
    var progressThunk = success && error && progress,
        errorThunk = ( success && error ) || ( error && progress ),
        successThunk = success || error || progress;
    XHR( url, "POST", type, progressThunk, errorThunk, successThunk, data );
  };
  
  
  HTTP.getObject = function ( url, progress, error, success ) {
    var progressThunk = success && error && progress,
        errorThunk = ( success && error ) || ( error && progress ),
        successThunk = success || error || progress;
    GET( url, "json", progressThunk, errorThunk, successThunk );
  };
  
  
  HTTP.sendObject = function ( url, data, progress, error, success ) {
    POST( url, data, "json",
        success && error && progress,
        ( success && error ) || ( error && progress ),
        success || error || progress );
  };

  return HTTP;
} )();