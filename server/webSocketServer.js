var socketControllers = require("./socketControllers"),
  log = require("./core").log;

function findController(controllerName) {
  for (var i = 0; i < socketControllers.length; ++i) {
    if (socketControllers[i].handshake === controllerName) {
      return socketControllers[i];
    }
  }
}

module.exports = function (socket) {
  log("New connection!");
  socket.on("handshake", function (controllerName) {
    console.log("handshaking", controllerName);
    var controller = findController(controllerName);
    if (controller) {
      controller.bindSocket(socket);
      socket.emit("handshakeComplete", controllerName);
    }
    else {
      log("unknown web socket controller type [$1]", controllerName);
      socket.emit("handshakeFailed", socketControllers.map(function (o) { return o.handshake; }));
    }
  });
};