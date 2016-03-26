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
    p: process.env.PORT || "8383",
    d: "examples/editor3d/index.html",
    s: "."
  }),
  appServer, redirector, io;

options.v = (options.v === "true");
options.b = (options.b === "true");

if (typeof (options.p) === "string" || options.p instanceof String) {
  if (/\d+/.test(options.p)) {
    options.p = parseFloat(options.p);
  }
  else {
    throw new Error("Port value was not parseable: " + options.p);
  }
}

function start(key, cert, ca) {
  var useSecure = !!(key && cert && ca);
  log("starting web server");
  if (useSecure) {
    log("secure");
    appServer = https.createServer({ key: key, cert: cert, ca: ca }, webServer(options.h, options.s));
    redirector = http.createServer(webServer(options.h, options.p + 1));
    redirector.listen(options.p);
    appServer.listen(options.p + 1);
  }
  else {
    log("insecure");
    appServer = http.createServer(webServer(options.h, options.s));
    appServer.listen(options.p);
  }
  io = socketio.listen(appServer);
  io.sockets.on("connection", webSocketServer);
  console.log("options.v " + options.v);
  if (options.v) {
    try {
      console.log("Starting browser");
      starter(useSecure, options.p + (useSecure ? 1 : 0), options.d);
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
  var p = new Promise(function (resolve, reject) {
    child.stdout.on("data", function (data) {
      if (data === "Waiting...\n") {
        resolve();
      }
    });
    child.on("end", resolve);
  });

  p.then(go);
}
else {
  go();
}