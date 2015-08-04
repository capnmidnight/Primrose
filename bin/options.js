module.exports.parse = function ( arr, obj ) {
  obj = obj || {};
  for ( var i = 0; i < arr.length; ++i ) {
    var val = arr[i];
    var matches = val.match( /^-(\w+):("?)([^"]+)\2$/ );
    if ( matches ) {
      obj[matches[1]] = matches[3];
    }
  }
  return obj;
};