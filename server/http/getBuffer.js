var get = require("./get");
module.exports = function (url, options) {
  return get("arraybuffer", url, options);
};