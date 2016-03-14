/* global require, process, exp */
﻿var format = require("util").format,
    fs = require("fs"),
    http = require("http"),
    https = require("https"),
    socketio = require("socket.io"),
    exec = require('child_process').exec,
    log = require("./core").log,
    starter = require("./starter"),
    webServer = require("./webServer").webServer,
    webSocketServer = require("./webSocketServer"),
    options = require("./options").parse(process.argv, {
      v: "false",
      b: "false",
      h: "localhost",
      p: "8383"
    }),
    srcDir = ".",
    startPage = "examples/editor3d/index.html",
    port = process.env.PORT || options.p,
    app, redir, io;

options.v = (options.v === "true");
options.b = (options.b === "true");

if (typeof (port) === "string" || port instanceof String) {
  if (/\d+/.test(port)) {
    port = parseFloat(port);
  }
  else {
    throw new Error("Port value was not parseable: " + port);
  }
}

function start(key, cert, ca) {
  var useSecure = !!(key && cert && ca);
  if (useSecure) {
    log("secure");
    app = https.createServer({
      key: key,
      cert: cert,
      ca: ca
    },
      webServer(options.h, srcDir));
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

function go() {
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
}

if (options.b) {
  console.log("Rebuilding site templates");
  var child = exec("grunt debug");
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on("exit", go);
}
else {
  go();
}