var socketControllers = require("./socketControllers"),
    log = require("./core").log;

module.exports = function (socket) {
  log("New connection!");
  socket.on("handshake", function (controllerName) {
    var found = false;
    for (var i = 0; i < socketControllers.length; ++i) {
      if (socketControllers[i].handshake === controllerName) {
        socketControllers[i].bindSocket(socket);
        socket.emit("handshakeComplete", controllerName);
        found = true;
      }
    }
    if (!found) {
      log("unknown web socket controller type [$1]", controllerName);
      socket.emit("handshakeFailed", socketControllers.map(function (o) { return o.handshake; }));
    }
  });
};