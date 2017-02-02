'use strict';

var objectAssign = require('object-assign');
var through = require('through2');
var defaultPug = require('pug');
var ext = require('gulp-util').replaceExtension;
var PluginError = require('gulp-util').PluginError;

module.exports = function gulpPug(options) {
  var opts = objectAssign({}, options);
  var pug = opts.pug || opts.jade || defaultPug;

  opts.data = objectAssign(opts.data || {}, opts.locals || {});

  return through.obj(function compilePug(file, enc, cb) {
    var data = objectAssign({}, opts.data, file.data || {});

    opts.filename = file.path;
    file.path = ext(file.path, opts.client ? '.js' : '.html');

    if (file.isStream()) {
      return cb(new PluginError('gulp-pug', 'Streaming not supported'));
    }

    if (file.isBuffer()) {
      try {
        var compiled;
        var contents = String(file.contents);
        if (opts.client) {
          compiled = pug.compileClient(contents, opts);
        } else {
          compiled = pug.compile(contents, opts)(data);
        }
        file.contents = new Buffer(compiled);
      } catch (e) {
        return cb(new PluginError('gulp-pug', e));
      }
    }
    cb(null, file);
  });
};
