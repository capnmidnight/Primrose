var os = require("os"),
    spawn = require("child_process").spawn,
    defaultStartProc = {
      linux: "xdg-open",
      win32: "explorer",
      darwin: "open"
    }[os.platform()];

module.exports = function (secure, port, startPage, startProc) {
  port = port || 80;
  startPage = startPage || "";
  startProc = startProc || defaultStartProc;
  var startUrl = "http";
  if (secure) {
    startUrl += "s";
  }
  startUrl += "://localhost";
  if (port !== 80) {
    startUrl += ":" + port;
  }
  var startPath = startUrl + "/" + startPage;
  console.log("starting: ", startProc, startPath);
  spawn(startProc, [startPath]);
};