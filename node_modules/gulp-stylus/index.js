'use strict';

var through        = require('through2');
var stylus         = require('accord').load('stylus');
var gutil          = require('gulp-util');
var rext           = require('replace-ext');
var extname        = require('path').extname;
var assign         = require('lodash.assign');
var applySourceMap = require('vinyl-sourcemaps-apply');

function guErr(err) {
  return new gutil.PluginError('gulp-stylus', err);
}

module.exports = function (options) {
  var opts = assign({}, options);

  return through.obj(function (file, enc, cb) {

    if (file.isStream()) {
      return cb(guErr('Streaming not supported'));
    }
    if (file.isNull()) {
      return cb(null, file);
    }
    if (extname(file.path) === '.css') {
      return cb(null, file);
    }
    if (file.sourceMap || opts.sourcemap) {
      opts.sourcemap = assign({basePath: file.base}, opts.sourcemap);
    }
    if (file.data) {
      opts.define = file.data;
    }
    opts.filename = file.path;

    stylus.render(file.contents.toString(enc || 'utf-8'), opts)
      .catch(function(err) {
        delete err.input;
        return cb(guErr(err));
      })
      .done(function(res) {
        if (res == null) {
          return;
        }
        if (res.result !== undefined) {
          file.path = rext(file.path, '.css');
          if (res.sourcemap) {
            res.result = res.result.replace(/\/\*[@#][\s\t]+sourceMappingURL=.*?\*\/$/mg, '');
            res.sourcemap.file = file.relative;
            applySourceMap(file, res.sourcemap);
          }
          file.contents = new Buffer(res.result);
          return cb(null, file);
        }
      });
  });

};

module.exports.stylus = require('stylus');
