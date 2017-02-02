var through = require('through2');
var beautify = require('js-beautify').js_beautify;
var RcLoader = require('rcloader');

module.exports = function(opts) {
  var rcLoader = new RcLoader('.jsbeautifyrc', opts, { loader: 'async' });

  function modifyFile(file, enc, cb) {
    if (file.isNull()) return cb(null, file); // pass along
    if (file.isStream()) return cb(new Error('gulp-beautify: Streaming not supported'));
    rcLoader.for(file.path, function (err, opts) {
      if (err) return cb(err);

      var str = file.contents.toString('utf8');
      file.contents = new Buffer(beautify(str, opts));
      cb(null, file);
    });
  }

  return through.obj(modifyFile);
};
