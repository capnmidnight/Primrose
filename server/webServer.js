var fs = require("fs"),
    http = require("http"),
    mime = require("mime"),
    url = require("url"),
    stream = require("stream"),
    zlib = require("zlib"),
    core = require("./core.js"),
    routes = require("./controllers.js"),
    filePattern = /([^?]+)(\?([^?]+))?/,
    IS_LOCAL = false;

function serverError(res, url, code) {
  var rest = Array.prototype.slice.call(arguments, 3),
      msg = core.fmt("URL: [$1] $2: $3", url, code, http.STATUS_CODES[code]);
  if (rest.length > 0) {
    msg += core.fmt(" -> [$1]", rest.join("], ["));
  }
  
  if (code >= 500) {
    console.error("Error", msg);
  }
  else {
        // so many of these are just bots trying to exploit open proxies
        // that it will fill up the logs with junk and before long we won't
        // have any disk space left.
        // console.warn("Warning", msg);
  }
  
  res.writeHead(code);
  res.end(msg);
}

function findController(url, method) {
  for (var i = 0; i < routes.length; ++i) {
    var matches = url.match(routes[i].pattern);
    if (matches) {
      matches.shift();
      var handler = routes[i][method];
      if (!handler) {
        serverError(res, url, 405);
      }
      else {
        return {
          handler: handler.bind(routes[i]),
          parameters: matches
        };
      }
    }
  }
}

function matchController(srcDir, req, res, url, method) {
  var controller = findController(url, method);
  if (controller) {
    controller.handler(
      controller.parameters,
            sendData.bind(this, req, res),
            sendStaticFile.bind(this, srcDir, req, res, url),
            serverError.bind(this, res, url));
    return true;
  }
  return false;
}

function sendStaticFile(srcDir, req, res, url, path) {
  var mimeType = mime.lookup(path);
  var send = function (p) {
    fs.stat(p, function (err, stats) {
      if (err) {
        serverError(res, url, 500, err);
      }
      else {
        sendData(req, res, mimeType, fs.createReadStream(p), stats.size);
      }
    });
  };
  
  fs.exists(path, function (yes) {
    if (yes) {
      send(path);
    }
    else {
      serverError(res, url, 404, path);
    }
  });
}

function sendData(req, res, mimeType, data, length) {
  if (!mimeType) {
    res.writeHead(415);
    res.end();
  }
  else {
    var headers = {
      "content-type": mimeType,
      "connection": "keep-alive"
    };
    
    if (data instanceof stream.Readable) {
      headers["content-length"] = length;
      res.writeHead(200, headers);
      data.pipe(res);
    }
    else {
      var send = function (d) {
        headers["content-length"] = d.length;
        res.writeHead(200, headers);
        res.end(d);
      };
      
      send(data);
    }
  }
}

function serveRequest(srcDir, req, res) {
  console.log("serving request", req.method, req.url);
  if (!matchController(srcDir, req, res, req.url, req.method) && req.method === "GET") {
    if (req.url.indexOf("..") === -1) {
      var url = req.url;
      if (url[url.length - 1] === "/") {
        url += "index.html";
      }
      var path = srcDir + url,
          file = path.match(filePattern)[1];
      sendStaticFile(srcDir, req, res, req.url, file);
    }
    else {
      serverError(res, req.url, 403);
    }
  }
}

function redirectPort(host, target, req, res) {
  var reqHost = req.headers.host && req.headers.host.replace(/(:\d+|$)/, ":" + target);
  var url = "https://" + reqHost + req.url;
  if (reqHost 
        && (host === "localhost" || reqHost === host + ":" + target) 
        && !/https?:/.test(req.url)) {
    res.writeHead(307, { "Location": url });
  }
  else {
    serverError(res, url, 400);
  }
  res.end();
}

function isString(v) { return typeof (v) === "string" || v instanceof String; }
function isNumber(v) { return isFinite(v) && !isNaN(v); }

/*
    Creates a callback function that listens for requests and either redirects
    them to the port specified by `target` (if `target` is a number) or serves
    applications and static files from the directory named by `target` (if 
    `target` is a string).
    
    `host`: the name of the host to validate against the HTTP header on request.
    `target`: a number or a string.
        - number: the port number to redirect to, keeping the request the same, otherwise.
        - string: the directory from which to serve static files.
*/
function webServer(host, target) {
  console.log("set on host", host);
  IS_LOCAL = host === "localhost";
  if (!isString(host)) {
    throw new Error("`host` parameter not a supported type. Excpected string. Given: " + host + ", type: " + typeof (host));
  }
  else if (!isString(target) && !isNumber(target)) {
    throw new Error("`target` parameter not a supported type. Excpected number or string. Given: " + target + ", type: " + typeof (target));
  }
  else if (isString(target)) {
    console.log("serving from", target);
    return serveRequest.bind(this, target);
  }
  else {
    console.log("redirecting to", target);
    return redirectPort.bind(this, host, target);
  }
};

module.exports.webServer = webServer;
module.exports.findController = findController;