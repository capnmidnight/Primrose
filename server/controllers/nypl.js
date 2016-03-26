var fmt = require("../core").fmt,
  master = require("../master"),
  controllers = require("../controllers"),
  fs = require("fs"),
  http = require("http");

//http://api.repo.nypl.org/

module.exports = {
  path: "/nypl/",
  pattern: /^\/nypl\/?(?:\?(q=[^&]+))?/,
  GET: function (params, sendData, sendStaticFile, serverError) {
    var req = http.request({
      hostname: "api.repo.nypl.org",
      path: "/api/v1/items/search?q=stereo&publicDomainOnly=true",
      method: "GET",
      headers: {
        "Authorization": "Token token=kd7zdl8042m7gl7o"
      }
    }, function (res) {
      res.setEncoding("utf8");
      var output = "";
      res.on("data", function (chunk) {
        output += chunk;
      });
      res.on("end", function () {
        sendData("text/json", output, output.length);
      });
    });

    req.end();
  }
};