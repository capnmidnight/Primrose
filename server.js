var http = require("http"),
  socketio = require("socket.io"),
  webServer = require("./server/webServer").webServer,
  webSocketServer = require("./server/webSocketServer"),
  appServer = http.createServer(webServer),
  io = socketio.listen(appServer),
  port = process.env.PORT || 8383;

console.log("Listening on port " + port);
appServer.listen(port);
io.sockets.on("connection", webSocketServer);
