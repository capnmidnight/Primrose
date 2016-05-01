var http = require("http"),
  socketio = require("socket.io"),
  webServer = require("./server/webServer").webServer,
  webSocketServer = require("./server/webSocketServer"),
  appServer = http.createServer(webServer),
  io = socketio.listen(appServer);

appServer.listen(process.env.PORT || 8383);
io.sockets.on("connection", webSocketServer);