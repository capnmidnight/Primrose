var fs = require("fs"),
  http = require("http"),
  mime = require("mime"),
  stream = require("stream"),
  url = require("url"),
  core = require("./core.js"),
  routes = require("./controllers.js");

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

function findController(request) {
  for (var i = 0; i < routes.length; ++i) {
    var matches = request.url.match(routes[i].pattern);
    if (matches) {
      matches.shift();
      var handler = routes[i][request.method];
      if (!handler) {
        serverError(res, request.url, 405);
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

function matchController(request, response) {
  var controller = findController(request);
  if (controller) {
    controller.handler(
      controller.parameters,
      sendData.bind(this, request, response),
      serverError.bind(this, response, request.url));
    return true;
  }
  return false;
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

function serveRequest(request, response) {
  if (!matchController(request, response) && request.method === "GET") {
    var parts = url.parse(request.url),
      file = "." + parts.pathname;
    
    if (file[file.length - 1] === "/") {
      file += "index.html";
    }

    fs.lstat(file, function (err, stat) {
      if (err) {
        serverError(response, request.url, 404);
      }
      else if (stat.isDirectory()) {
        response.writeHead(307, { "Location": request.url + "/" });
        response.end();
      }
      else {
        sendData(request, response, mime.lookup(file), fs.createReadStream(file), stat.size);
      }
    });
  }
}

module.exports.webServer = serveRequest;
module.exports.findController = findController;