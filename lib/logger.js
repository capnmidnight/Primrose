(function () {
  "use strict";
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
      try {
        var container = document.querySelector("#debugOutput");
        var args = Array.prototype.slice.call(arguments);
        console[orig].apply(console, args);
        if (container) {
          var d = document.createElement("div");
          d.className = name + "Msg";
          d.appendChild(document.createTextNode(args.join(" ")));
          container.appendChild(d);
        }
        for (var i = 0; i < args.length; ++i) {
          if (typeof args[i] === "object") {
            var obj = {};
            for (var key in args[i]) {
              obj[key] = args[i][key].toString();
            }
            args[i] = obj;
          }
        }
        sendObject("/logger/", {
          name: name,
          args: args
        });
      }
      catch (exp) {
        alert(exp.message);
      }
    }
  }

  ["log", "warn", "error"].forEach(function (n) {
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
})();