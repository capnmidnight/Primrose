function makeURL ( url, queryMap ) {
  var output = [ ];
  for ( var key in queryMap ) {
    if ( queryMap.hasOwnProperty( key ) &&
        typeof queryMap[key] !== "function" ) {
      output.push( encodeURIComponent( key ) + "=" + encodeURIComponent(
          queryMap[key] ) );
    }
  }
  return url + "?" + output.join( "&" );
}

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

function GET ( url, type, progress, error, success ) {
  type = type || "text";

  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  XHR( url, "GET", type, progressThunk, errorThunk, successThunk );
}

function POST ( url, data, type, progress, error, success ) {
  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  XHR( url, "POST", type, progressThunk, errorThunk, successThunk );
}

function getObject ( url, progress, error, success ) {
  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  GET( url, "json", progressThunk, errorThunk, successThunk );
}

function sendObject ( url, data, progress, error, success ) {
  POST( url, data, "json",
      success && error && progress,
      ( success && error ) || ( error && progress ),
      success || error || progress );
}
