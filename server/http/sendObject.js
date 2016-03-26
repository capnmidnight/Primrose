var post = require("./post");
module.exports = function (url, options) {
  return post("text/json", url, options);
};