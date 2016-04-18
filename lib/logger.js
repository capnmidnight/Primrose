(function (DEBUG) {
  "use strict";
  if (DEBUG) {
    function sendObject(url, data) {
      var req = new XMLHttpRequest();
      req.open("POST", url);
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send(JSON.stringify(data));
    }

    function wrap(name) {
      var orig = "_" + name;
      console[orig] = console[name];
      return function () {
        var container = document.querySelector("#debugOutput");
        var args = Array.prototype.slice.call(arguments);
        console[orig].apply(console, args);
        for (var i = 0; i < args.length; ++i) {
          if (typeof args[i] === "object") {
            var obj1 = args[i],
              obj2 = {};
            for (var key in obj1) {
              obj2[key] = obj1[key];
              if (obj2[key] !== null && obj2[key] !== undefined) {
                obj2[key] = obj2[key].toString();
              }
            }
            args[i] = obj2;
          }
        }
        sendObject("/logger/", {
          name: name,
          args: args
        });
      }
    }

    ["log", "info", "warn", "error"].forEach(function (n) {
      console[n] = wrap(n);
    });

    window.onerror = function (message, source, lineno, colno, error) {
      console.error({
        time: (new Date()).toLocaleTimeString(),
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error.message
      });
      return true;
    }
  }
})(true);