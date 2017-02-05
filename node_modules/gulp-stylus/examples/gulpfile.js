'use strict';

// include the required packages.
var gulp = require('gulp');
var stylus = require('../');


// include, if you want to work with sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// Get one .styl file and render
gulp.task('one', function () {
	gulp.src('./css/one.styl')
		.pipe(stylus())
		.pipe(gulp.dest('./css/build'));
});

// Options
// Options compress
gulp.task('compress', function () {
	gulp.src('./css/compressed.styl')
		.pipe(stylus({
      compress: true
    }))
		.pipe(gulp.dest('./css/build'));
});


// Set linenos
gulp.task('linenos', function () {
  gulp.src('./css/linenos.styl')
    .pipe(stylus({linenos: true}))
    .pipe(gulp.dest('./css/build'));
});

// Inline sourcemaps
gulp.task('sourcemaps-inline', function () {
  gulp.src('./css/sourcemaps-inline.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css/build'));
});

// External sourcemaps
gulp.task('sourcemaps-external', function () {
  gulp.src('./css/sourcemaps-external.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css/build'));
});

gulp.task('include-css', function() {
  // Stylus has an awkward and perplexing 'include css' option
  gulp.src('./css/*.styl')
    .pipe(stylus({
      'include css': true
    }))
    .pipe(gulp.dest('./'));

});


// Default gulp task to run
gulp.task('default', ['one', 'compress', 'linenos', 'sourcemaps-inline', 'sourcemaps-external']);
