var fmt = require("../core").fmt,
  master = require("../master"),
  controllers = require("../controllers"),
  fs = require("fs"),
  getObject = require("../http/getObject");

//http://api.repo.nypl.org/

module.exports = {
  path: "/nypl/",
  pattern: /^\/nypl\/?(?:\?(q=[^&]+))?/,
  GET: function (params, sendData, sendStaticFile, serverError) {
    getObject("http://api.repo.nypl.org/api/v1/items/search?q=stereo&publicDomainOnly=true", {
      headers: {
        Authorization: "Token token=" + process.env.NYPL_TOKEN
      }
    }).then(function (output) {
      console.log(output);
      sendData("text/json", output, output.length);
    }).catch(serverError);
  }
};