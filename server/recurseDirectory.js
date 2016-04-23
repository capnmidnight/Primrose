var fs = require("fs"),
  path = require("path");

module.exports = function recurseDirectory(root) {
  var directoryQueue = [root],
    files = [];
  while (directoryQueue.length > 0) {
    var directory = directoryQueue.shift(),
      subFiles = fs.readdirSync(directory);
    for (var j = 0; j < subFiles.length; ++j) {
      var subFile = path.join(directory, subFiles[j]),
        stats = fs.lstatSync(subFile);
      if (stats.isDirectory()) {
        directoryQueue.push(subFile);
      }
      else {
        files.push(subFile.replace(/\\/g, "/"));
      }
    }
  }
  return files;
};