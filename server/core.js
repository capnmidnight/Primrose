(function (exports) {
  // A few functions used in conjunction with
  // hashMap and where
  exports.equal = function (a, b) { return a === b; };
  exports.notEqual = function (a, b) { return a !== b; };
  exports.key = function (k, v) { return k; };
  exports.keys = function (obj) { return this.hashMap(obj, this.key); };
  exports.value = function (k, v) { return v; };
  exports.values = function (obj) { return this.hashMap(obj, this.value); };
  
  // Applies a exports.to the contents of an associative
  // array, returning the results of each call on that
  // exports.in an array.
  //          - hsh: the associative array to process
  //          - thunk: a function, taking two parameters "key" and "value",
  //                              that returns a single-value result.
  exports.hashMap = function (hsh, thunk) {
    var output = [];
    for (var key in hsh)
      output[output.length] = thunk(key, hsh[key]);
    return output;
  };
  
  
  // - match a dollar sign ($) literally, 
  // - (optional) then zero or more zero digit (0) characters, greedily
  // - then one or more digits (the previous rule would necessitate that
  //      the first of these digits be at least one).
  // - (optional) then a period (.) literally
  // -            then one or more zero digit (0) characters
  var paramRegex = /\$(0*)(\d+)(?:\.(0+))?/g;
  /*
    Replace template place holders in a string with a positional value.
    Template place holders start with a dollar sign ($) and are followed
    by a digit that references the parameter position of the value to 
    use in the text replacement. Note that the first position, position 0,
    is the template itself. However, you cannot reference the first position,
    as zero digit characters are used to indicate the width of number to
    pad values out to.

    Numerical precision padding is indicated with a period and trailing
    zeros.

    examples:
        fmt("a: $1, b: $2", 123, "Sean") => "a: 123, b: Sean"
        fmt("$001, $002, $003", 1, 23, 456) => "001, 023, 456"
        fmt("$1.00 + $2.00 = $3.00", Math.sqrt(2), Math.PI, 9001) 
           => "1.41 + 3.14 = 9001.00"
        fmt("$001.000", Math.PI) => 003.142
*/
    exports.fmt = function (template) {
    var args = arguments;
    return template.replace(paramRegex, function (m, pad, index, precision) {
      index = parseInt(index, 10);
      if (0 <= index && index < args.length) {
        var val = args[index];
        if (val !== null && val !== undefined) {
          if (val instanceof Date && precision) {
            switch (precision.length) {
              case 1: val = val.getYear() + 1900; break;
              case 2: val = exports.fmt("$01/$2", val.getMonth() + 1, (val.getFullYear())); break;
              case 3: val = makeDateString(val); break;
              case 4: val = addMillis(val, val.toLocaleTimeString()); break;
              case 5: case 6: val = makeDateTimeString(val); break;
              default: val = addMillis(val, makeDateTimeString(val)); break;
            }
            return val;
          }
          else {
            if (precision && precision.length > 0) {
              val = sigfig(val, precision.length);
            }
            else {
              val = val.toString();
            }
            if (pad && pad.length > 0) {
              var paddingRegex = new RegExp("^\\d{" + (pad.length + 1) + "}(\\.\\d+)?");
              while (!paddingRegex.test(val)) {
                val = "0" + val;
              }
            }
            return val;
          }
        }
      }
      return undefined;
    });
  };
  
  exports.log = function () {
    var args = Array.prototype.slice.call(arguments);
    args[0] = "$" + args.length + ".000000: " + args[0];
    args.push(new Date());
    console.log(exports.fmt.apply(exports, args));
  };
  
  function makeDateString(val) {
    return exports.fmt("$1/$02/$03", val.getFullYear(), val.getMonth() + 1, val.getDate());
  }
  
  function makeDateTimeString(val) {
    return exports.fmt("$1 $2", makeDateString(val), val.toLocaleTimeString());
  }
  
  function addMillis(val, txt) {
    return txt.replace(/( AM| PM|$)/, function (match, g1) {
      return (val.getMilliseconds() / 1000).toString().substring(1) + g1;
    });
  }
  
  function sigfig(x, y) {
    var p = Math.pow(10, y);
    var v = (Math.round(x * p) / p).toString();
    if (y > 0) {
      var i = v.indexOf(".");
      if (i === -1) {
        v += ".";
        i = v.length - 1;
      }
      while (v.length - i - 1 < y)
        v += "0";
    }
    return v;
  }
  
  // filters an associative array.
  //    - hsh: the associative array to process.
  //    - getter: a function, taking two parameters "key"
  //            and "value", that returns a single-value
  //            result, as in hashMap.
  //    - comparer: a function, taking two values A and B,
  //            that compares the output of getter to the
  //            val parameter.
  //    - val: a filtering value.
  exports.where = function (hsh, getter, comparer, val) {
    var output = {};
    if (hsh && getter && comparer) {
      for (var key in hsh) {
        if (comparer(getter(key, hsh[key]), val)) {
          output[key] = hsh[key];
        }
      }
    }
    return output;
  };
  
  // Picks a random item out of an array
  exports.selectRandom = function (arr) {
    if (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
  };
  
  // Frequently, it's necessary to print the status of a
  // hash. This exports.will run the printing, or return
  // the word "none" if there is nothing in the hash.
  //    - formatter: a function, taking two parameters "key"
  //            and "value", that returns a single-value
  //            result, as in hashMap (as that is where it
  //            will be used). The exports.should return
  //                           a string.
  //          - hsh: the associative array to process
  exports.formatHash = function (hsh, formatter) {
    if (hsh) {
      var strs = this.hashMap(hsh, formatter);
      if (strs.length > 0) {
        return strs.join("\n\n");
      }
    }
    return "\tnone";
  };
  
  exports.time = function () {
    var d = new Date();
    return (d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds();
  };
})(exports || window);