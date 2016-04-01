var fmt = require("../core").fmt,
  getObject = require("../http/getObject");

//http://api.repo.nypl.org/

module.exports = {
  path: "/nypl/",
  pattern: /^\/logger\/?$/,
  GET: function (params, sendData, serverError) {
    sendData("text/html", "<script type=\"text/javascript\">alert(\"ok\");</script>");
  },
  POST: function (params, sendData, serverError, body) {
    var func = console[body.name];
    if (func) {
      func.apply(console, body.args);
    }
    else {
      console.log(body);
    }
    sendData("text/plain");
  }
};