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

function serverError(response, requestedURL, httpStatusCode) {
  var rest = Array.prototype.slice.call(arguments, 3),
    msg = core.fmt("URL: [$1] $2: $3", requestedURL, httpStatusCode, http.STATUS_CODES[httpStatusCode]);
  if (rest.length > 0) {
    msg += core.fmt(" -> [$1]", rest.join("], ["));
  }

  if (httpStatusCode >= 500) {
    console.error("Error", msg);
  }
  else {
    // so many of these are just bots trying to exploit open proxies
    // that it will fill up the logs with junk and before long we won't
    // have any disk space left.
    // console.warn("Warning", msg);
  }

  response.writeHead(httpStatusCode);
  response.end(msg);
}

function findController(requestedURL, httpMethod) {
  for (var i = 0; i < routes.length; ++i) {
    var matches = requestedURL.match(routes[i].pattern);
    if (matches) {
      matches.shift();
      var handler = routes[i][httpMethod];
      if (!handler) {
        serverError(res, requestedURL, 405);
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

function matchController(srcDirectory, request, response, requestedURL, httpMethod) {
  var controller = findController(requestedURL, httpMethod);
  if (controller) {
    controller.handler(
      controller.parameters,
      sendData.bind(this, request, response),
      sendStaticFile.bind(this, srcDirectory, request, response, requestedURL),
      serverError.bind(this, response, requestedURL));
    return true;
  }
  return false;
}

function sendStaticFile(srcDirectory, request, response, requestedURL, filePath) {
  fs.lstat(filePath, function (err, stats) {
    if (err) {
      serverError(response, requestedURL, 404, filePath);
    }
    else if (stats.isDirectory()) {
      if (requestedURL[requestedURL.length - 1] !== "/") {
        requestedURL += "/";
      }
      requestedURL += "index.html";
      response.writeHead(307, { "Location": requestedURL });
      response.end();
    }
    else {
      sendData(request, response, mime.lookup(filePath), fs.createReadStream(filePath), stats.size);
    }
  });
}

function sendData(request, response, mimeType, content, contentLength) {
  if (!mimeType) {
    response.writeHead(415);
    response.end();
  }
  else {
    var headers = {
      "content-type": mimeType,
      "connection": "keep-alive"
    };

    if (content instanceof stream.Readable) {
      headers["content-length"] = contentLength;
      response.writeHead(200, headers);
      content.pipe(response);
    }
    else {
      var send = function (d) {
        headers["content-length"] = d.length;
        response.writeHead(200, headers);
        response.end(d);
      };

      send(content);
    }
  }
}

function serveRequest(srcDirectory, request, response) {
  if (!matchController(srcDirectory, request, response, request.url, request.method) && request.method === "GET") {
    if (request.url.indexOf("..") === -1) {
      var newURL = request.url,
        path = srcDirectory + newURL,
        file = path.match(filePattern)[1];
      sendStaticFile(srcDirectory, request, response, newURL, file);
    }
    else {
      serverError(response, request.url, 403);
    }
  }
}

function redirectPort(host, target, request, response) {
  var reqHost = request.headers.host && request.headers.host.replace(/(:\d+|$)/, ":" + target);
  var url = "https://" + reqHost + request.url;
  if (reqHost
    && (host === "localhost" || reqHost === host + ":" + target)
    && !/https?:/.test(request.url)) {
    response.writeHead(307, { "Location": url });
  }
  else {
    serverError(response, url, 400);
  }
  response.end();
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
  IS_LOCAL = host === "localhost";
  if (!isString(host)) {
    throw new Error("`host` parameter not a supported type. Excpected string. Given: " + host + ", type: " + typeof (host));
  }
  else if (!isString(target) && !isNumber(target)) {
    throw new Error("`target` parameter not a supported type. Excpected number or string. Given: " + target + ", type: " + typeof (target));
  }
  else if (isString(target)) {
    return serveRequest.bind(this, target);
  }
  else {
    return redirectPort.bind(this, host, target);
  }
};

module.exports.webServer = webServer;
module.exports.findController = findController;