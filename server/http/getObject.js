var get = require("./get");
module.exports = function (url, options) {
  return get("text/json", url, options);
};