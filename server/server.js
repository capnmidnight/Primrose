/*
https://www.github.com/capnmidnight/Primrose
Copyright (c) 2014 Sean T. McBeth
All rights reserved.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var format = require("util").format,
    fs = require("fs"),
    http = require("http"),
    https = require("https"),
    socketio = require("socket.io"),
    log = require("./core").log,
    starter = require("./starter"),
    webServer = require("./webServer").webServer,
    webSocketServer = require("./webSocketServer"),
    options = require("./options").parse(process.argv, {
      v: "false",
      h: "localhost"
    }),
    srcDir = ".",
    startPage = "",
    port = 8383,
    app, redir, io;

function start(key, cert, ca) {
  var useSecure = !!(key && cert && ca);
  if (useSecure) {
    log("secure");
    app = https.createServer(
      {
        key: key,
        cert: cert,
        ca: ca
      },
            webServer(options.h, srcDir)
    );
    redir = http.createServer(webServer(options.h, port + 1));
    redir.listen(port);
    app.listen(port + 1);
  }
  else {
    log("insecure");
    app = http.createServer(webServer(options.h, srcDir));
    app.listen(port);
  }
  io = socketio.listen(app);
  io.sockets.on("connection", webSocketServer);
  console.log("options.v " + options.v);
  if (options.v !== "false") {
    try {
      console.log("Starting browser");
      starter(useSecure, port + (useSecure ? 1 : 0), startPage);
    } catch (exp) {
      console.error("couldn't start browser", exp.message);
    }
  }
}

/*
 * function: readFiles(filePaths, callback)
 * parameters:
 *  `filePaths`: array of strings, representing file paths
 *  `callback`: callback function - `function(err, fileContents)`
 *      `err`: the Error object--if any--that caused the reading
 *             process to abort.
 *      `fileContents`: an array of strings
 *
 * Reads all files specified in the filePaths array as UTF-8 encoded text files
 * and executes the provided callback function when done.
 *
 * If any one of the files is missing or causes an error, the entire process
 * aborts and the callback is called with the error object as the first
 * parameter. The second `fileContents` parameter will be null.
 *
 * If all of the files load successfully, the callback is called with null
 * as the first parameter and the full string contents of each of the files in
 * an array as the second parameter.
 */
function readFiles(filePaths, callback) {
  __readFiles(filePaths, callback, 0, []);
}

function __readFiles(filePaths, callback, index, fileContents) {
  if (index === filePaths.length) {
    callback(null, fileContents);
  }
  else {
    fs.exists(filePaths[index], function (yes) {
      if (yes) {
        fs.readFile(filePaths[index], { encoding: "utf8" }, function (err, file) {
          if (err) {
            callback(err, null);
          }
          else {
            fileContents.push(file);
            setImmediate(__readFiles, filePaths, callback, index + 1, fileContents);
          }
        });
      }
      else {
        callback(new Error(filePaths[index] + " does not exist"), null);
      }
    });
  }
}

readFiles([
  "../key.pem",
  "../cert.pem",
  "../ca.pem"],
    function (err, files) {
  if (err) {
    console.error(err);
    start();
  }
  else {
    start.apply(this, files);
  }
});
