var request = require("./request");
module.exports = function (type, url, options) {
  return request("GET", type || "text/plain", url, options);
};