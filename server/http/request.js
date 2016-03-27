var http = require("http"),
  URL = require("url");

module.exports = function (method, type, url, options) {
  return new Promise(function (resolve, reject) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers.Accept = options.headers.Accept || type;

    console.log(options);

    if (options.data) {
      // We could do other data types, but in my case, I'm probably only ever
      // going to want JSON. No sense in overcomplicating the interface for
      // features I'm not going to use.
      options.headers["Content-Type"] = "application/json;charset=UTF-8";
    }

    var reqOptions = URL.parse(url);
    reqOptions.headers = {};
    for (var key in options.headers) {
      reqOptions.headers[key] = options.headers[key];
    }
    var req = http.request(reqOptions);

    req.on("response", function (res) {
      res.setEncoding("utf8");
      var output = "";
      res.on("data", function (chunk) {
        output += chunk;
      });
      res.on("end", function () {
        resolve(output);
      });
    });

    req.on("error", reject);

    if (options.data) {
      req.end(JSON.stringify(options.data));
    }
    else {
      req.end();
    }
  });
};