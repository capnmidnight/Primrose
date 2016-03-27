var fmt = require("./core").fmt,
  master = require("./master"),
  fs = require("fs"),
  findController = require("./webServer").findController;

function GameController(name, title) {
  this.name = name;
  this.title = title;
  this.path = fmt("$1.html", name);
  this.appcachePath = fmt("$1.appcache", name);
  this.pattern = new RegExp(fmt("^\\/$1.(html|appcache)$", name));
};

GameController.prototype.GET = function (params, sendData, serverError) {
  var f = this[params[0]];
  if (typeof (f) === "function") {
    f.call(this, sendData, serverError);
  }
  else {
    serverError(500, "no handler for " + params[0]);
  }
};

GameController.prototype.html = function (sendData, serverError) {
  master.build(
    sendData,
    serverError,
    "src/templates/game.html",
    this.name,
    this.title);
};

GameController.prototype.appcache = function (sendData, serverError) {
  getFileDescription(this.path, null, function (desc) {
    findFilesInFiles(
      [this.path],
      this.appcachePath,
      sendAppCache.bind(this, desc.stamp, sendData),
      serverError);
  }.bind(this));
};

function findFilesInFiles(paths, skipURL, success, error, accum, index) {
  accum = accum || [];
  index = index || 0;
  if (index >= paths.length) {
    success(accum);
  }
  else {
    var next = function () {
      setImmediate(findFilesInFiles, paths, skipURL, success, error, accum, index + 1);
    };
    
    // only read certain types of files
    if (/\.(html|css|js|json|dae)$/.test(paths[index])) {
      findFilesInFile(paths[index], skipURL, function (files) {
        files.filter(function (f) {
          return paths.indexOf(f) === -1;// && isGood;
        }).forEach(function (f) {
          paths.push(f);
        });
        next();
      }, error, accum);
    }
    else {
      next();
    }
  }
}

function findFilesInFile(path, skipURL, success, error, accum) {
  fs.exists(path, function (yes) {
    if (yes) {
      fs.readFile(path, { encoding: "utf8" }, function (err, file) {
        if (err) {
          console.error(path, err);
          error(500, err);
        }
        else {
          extractFileReferences(path, file, skipURL, success, accum);
        }
      });
    }
  });
}

function extractFileReferences(path, file, skipURL, success, accum) {
  var isCSS = /\.css$/.test(path);
  var isJS = /\.js$/.test(path);
  var pattern = isCSS ? /url\(\.\.\/([^)]+)\)/g : /"([^"]*)"/g;
  var strings = [];
  if (isJS) {
    file = file.replace(/\\"/g, "{ESCAPED_QUOTE}");
  }
  file.replace(pattern, function (match, capture) {
    strings.push(capture);
    return match;
  });
  strings.sort();
  strings = strings.filter(function (a, i) {
    return a.length > 0
      && (i === 0 || a !== strings[i - 1])
      && /^[^.].+\.\w+$/.test(a)
      && a !== skipURL;
  });
  filterFiles(strings || [], success, accum);
}

function filterFiles(strings, done, accum, index) {
  accum = accum || [];
  index = index || 0;
  if (index >= strings.length) {
    done(accum);
  }
  else {
    fs.exists(strings[index], function (yes) {
      if (yes) {
        accum.push(strings[index]);
      }
      setImmediate(filterFiles, strings, done, accum, index + 1);
    });
  }
}

function getFileDescriptions(paths, done, accum, index) {
  accum = accum || [];
  index = index || 0;
  if (index >= paths.length) {
    done(accum);
  }
  else {
    getFileDescription(paths[index], null, function (desc) {
      if (desc) {
        accum.push(desc);
      }
      setImmediate(getFileDescriptions, paths, done, accum, index + 1);
    });
  }
}

function getFileDescription(path, data, done) {
  var send = function (length) {
    done({
      name: path,
      size: length,
      stamp: length
    });
  };
  if (data) {
    send(data.length);
  }
  else {
    fs.lstat(path, function (err, stats) {
      if (err) {
        send(-1);
      }
      else {
        done({
          name: path,
          size: stats.size,
          stamp: stats.atime.getTime() + stats.ctime.getTime() + stats.mtime.getTime()
        });
      }
    });
  }
}

function sendAppCache(mainFileTime, sendData, files) {
  getFileDescriptions(files, function (descriptions) {
    var data = fmt("CACHE MANIFEST\n# $1\nCACHE:", mainFileTime);
    for (var i = 0; i < descriptions.length; ++i) {
      // Appending these timestamps to the manifest will change the byte
      // signature of the manifest when the timestamps update, i.e. newer
      // versions of the files are uploaded. This then indicates to the
      // browser that a new app update needs to be downloaded.
      //
      // We could hash the contents of the files instead, in case the file
      // was touched but not updated, but that isn't likely to occur on
      // the server and this is quicker and easier.
      data += fmt("\n# $1\n$2", descriptions[i].stamp, descriptions[i].name);
    }
    data += "\nNETWORK:\n*";
    sendData("text/cache-manifest", data, data.length);
  });
}

module.exports = GameController;