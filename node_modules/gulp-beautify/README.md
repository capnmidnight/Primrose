[![status](https://secure.travis-ci.org/contra/gulp-beautify.png?branch=master)](https://travis-ci.org/contra/gulp-beautify)

# Information
<table><br><tr><br><td>Package</td><td>gulp-beautify</td><br></tr><br><tr><br><td>Description</td><br><td>Asset beautification using node-beautify</td><br></tr><br><tr><br><td>Node Version</td><br><td>>= 0.4</td><br></tr><br></table>

# Usage
This is a gulp plugin for js-beautify.

```javascript
var beautify = require('gulp-beautify');

gulp.task('beautify', function() {
  gulp.src('./src/*.js')
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('./public/'))
});
```

# Options
Plugin options:
- `lookup`
  - Default is `true`
  - When `false` do not lookup `.jsbeautifyrc` files, which are JSON encoded configuration files for [js-beautify](https://github.com/beautify-web/js-beautify#options).

You can pass in any other options and it passes them directly to [js-beautify](https://github.com/beautify-web/js-beautify).

# LICENSE
(MIT License)

Copyright (c) 2015 Fractal [contact@wearefractal.com](mailto:contact@wearefractal.com)

Permission is hereby granted, free of charge, to any person obtaining<br>a copy of this software and associated documentation files (the<br>"Software"), to deal in the Software without restriction, including<br>without limitation the rights to use, copy, modify, merge, publish,<br>distribute, sublicense, and/or sell copies of the Software, and to<br>permit persons to whom the Software is furnished to do so, subject to<br>the following conditions:

The above copyright notice and this permission notice shall be<br>included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,<br>EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF<br>MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND<br>NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE<br>LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION<br>OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION<br>WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
