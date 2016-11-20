var gulp = require("gulp"),
  exec = require("child_process").exec,
  fs = require("fs"),
  pliny = require("../pliny/src/pliny"),
  pkg = require("./package.json"),
  build = require("../notiontheory-basic-build"),
  nt = build.setup(gulp, pkg),

  js = nt.js("PrimroseWithDoc", "src", ["format"], (inFile, cb) => {
    // removes the documentation objects from the concatenated library.
    var outFile = inFile.replace("WithDoc", "");
    pliny.carve(inFile, outFile, "doc/PrimroseDocumentation.js", cb);
  }, true, "Primrose"),

  min = nt.min("Primrose", ["doc/PrimroseDocumentation.js", "Primrose.js"], [{
    debug: js.debug,
    release: js.debug
  }]),

  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "templates/**/*.pug"], "src"),
  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]);

gulp.task("clean", [nt.clean("Primrose", [
  "Primrose*.js",
  "doc/PrimroseDocumentation*.js"
])]);

gulp.task("format", [js.format]);
gulp.task("js", [js.default]);
gulp.task("js:debug", [js.debug]);
gulp.task("js:release", [min.release]);
gulp.task("html", [html.debug]);
gulp.task("css", [css.debug]);

gulp.task("copy", [min.release], () => gulp.src(["Primrose.min.js"])
  .pipe(gulp.dest("quickstart")));

gulp.task("default", [
  js.default,
  html.default,
  css.default
]);

gulp.task("debug", [
  js.debug,
  html.debug,
  css.debug
]);

gulp.task("test", [
  min.release,
  html.test,
  css.release
]);

gulp.task("release",  [
  min.release,
  html.release,
  css.release
]);

gulp.task("kablamo", build.exec("gulp bump && gulp yolo && cd ../Primrose-Site && gulp kablamo && cd ../Primrose && gulp trololo && npm publish"));