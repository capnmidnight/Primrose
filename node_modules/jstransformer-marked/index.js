'use strict';

var marked = require('marked');

exports.name = 'marked';
exports.outputFormat = 'html';
exports.inputFormats = ['marked', 'markdown', 'md'];
exports.render = function (str, options) {
  return marked(str, options);
};
