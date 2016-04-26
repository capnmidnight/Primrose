var logger = (function () {
  "use strict";

  var logger = {
    setup: null,
    DISABLED: 0,
    HTTP: 1,
    WEBSOCKET: 2,
    DOM: 3
  }

  logger.setup = function setup(type, target) {
    if (type !== logger.DISABLED) {

      var send = null;

      if ((type === logger.HTTP || type === logger.WEBSOCKET) && location.protocol === "file:") {
        console.warn("Can't perform HTTP requests from the file system. Not going to setup the error proxy, but will setup the error catch-all.");
      }
      else if (type === logger.HTTP) {
        send = function (data) {
          var req = new XMLHttpRequest();
          req.open("POST", target);
          req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          req.send(data);
        };
      }
      else if (type === logger.WEBSOCKET) {
        var socket = new WebSocket(target);
        send = function (data) {
          socket.send(data);
        };
      }
      else if (type === logger.DOM) {
        var output = document.querySelector(target);
        send = function (data) {
          var elem = document.createElement("pre");
          elem.appendChild(document.createTextNode(data));
          output.appendChild(elem);
        };
      }
      else if (type instanceof Function) {
        send = type;
      }

      if (send !== null) {
        function cloneArgs(args) {
          var output = [];
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
              output.push(obj2);
            }
          }
          return output;
        }

        function wrap(name) {
          var orig = "_" + name;
          if (!console[orig]) {
            console[orig] = console[name];
          }
          return function () {
            console[orig].apply(console, arguments);
            send(JSON.stringify({
              name: name,
              args: cloneArgs(arguments)
            }));
          }
        }

        ["log", "info", "warn", "error"].forEach(function (n) {
          console[n] = wrap(n);
        });
      }

      window.onerror = function (message, source, lineno, colno, error) {
        console.error({
          time: (new Date()).toLocaleTimeString(),
          message: message,
          source: source,
          lineno: lineno,
          colno: colno,
          error: error.message
        });
      }
    }
  };

  return logger;
})();