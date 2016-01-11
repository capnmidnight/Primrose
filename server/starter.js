var os = require("os"),
    spawn = require("child_process").spawn,
    startProc = {
      linux: "xdg-open",
      win32: "explorer",
      darwin: "open"
    }[os.platform()];

module.exports = function (secure, port, startPage) {
  port = port || 80;
  startPage = startPage || "";
  if (startProc) {
    var startUrl = "http";
    if (secure) {
      startUrl += "s";
    }
    startUrl += "://localhost";
    if (port !== 80) {
      startUrl += ":" + port;
    }
    spawn(startProc, [startUrl + "/" + startPage]);
  }
};