# gulp-stylus
[![Build Status](https://travis-ci.org/stevelacy/gulp-stylus.png?branch=master)](https://travis-ci.org/stevelacy/gulp-stylus)
[![NPM version](https://badge.fury.io/js/gulp-stylus.png)](http://badge.fury.io/js/gulp-stylus)

> Compile [Stylus](http://learnboost.github.io/stylus/) with gulp (gulpjs.com)

## Information

<table>
<tr>
<td>Package</td><td>gulp-stylus</td>
</tr>
<tr>
<td>Description</td>
<td>Stylus plugin for gulp</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.9</td>
</tr>
<tr>
<td>Gulp Version</td>
<td>3.x</td>
</tr>
</table>

## Usage

#### Install

```sh
$ npm install --save-dev gulp-stylus
```

## Examples

```javascript

// include the required packages.
var gulp = require('gulp');
var data = require('gulp-data');
var stylus = require('gulp-stylus');


// include, if you want to work with sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// Get one .styl file and render
gulp.task('one', function () {
  return gulp.src('./css/one.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./css/build'));
});

// Options
// Options compress
gulp.task('compress', function () {
  return gulp.src('./css/compressed.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./css/build'));
});


// Set linenos
gulp.task('linenos', function () {
  return gulp.src('./css/linenos.styl')
    .pipe(stylus({linenos: true}))
    .pipe(gulp.dest('./css/build'));
});

// Include css
// Stylus has an awkward and perplexing 'include css' option
gulp.task('include-css', function() {
  return gulp.src('./css/*.styl')
    .pipe(stylus({
      'include css': true
    }))
    .pipe(gulp.dest('./'));

});

// Inline sourcemaps
gulp.task('sourcemaps-inline', function () {
  return gulp.src('./css/sourcemaps-inline.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css/build'));
});

// External sourcemaps
gulp.task('sourcemaps-external', function () {
  return gulp.src('./css/sourcemaps-external.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css/build'));
});

// Pass an object in raw form to be accessable in stylus
var data = {red: '#ff0000'};
gulp.task('pass-object', function () {
  gulp.src('./sty/main.styl')
    .pipe(stylus({ rawDefine: { data: data }}))
    .pipe(gulp.dest('./css/build'));
});

// Use with gulp-data
gulp.task('gulp-data', function() {
  gulp.src('./components/**/*.styl')
    .pipe(data(function(){
      return {
        componentPath: '/' + (file.path.replace(file.base, '').replace(/\/[^\/]*$/, ''));
      };
    }))
    .pipe(stylus())
    .pipe(gulp.dest('./css/build'));
});

/* Ex:
body
  color: data.red;
*/

// Default gulp task to run
gulp.task('default', ['one', 'compress', 'linenos', 'sourcemaps-inline', 'sourcemaps-external', 'pass-object']);

```

##### You can view more examples in the [example folder.](https://github.com/stevelacy/gulp-stylus/tree/master/examples)

## Extras
You can access the original `stylus` module that `gulp-stylus` uses.
```
var originalStylus = require('gulp-stylus').stylus;
```

## Options
#### All stylus options are passed to [accord/stylus](https://github.com/jenius/accord/blob/master/docs/stylus.md)



## LICENSE [MIT](LICENSE)
