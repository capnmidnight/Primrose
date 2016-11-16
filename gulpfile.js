var gulp = require("gulp"),
  exec = require("child_process").exec,
  fs = require("fs"),
  pliny = require("pliny"),
  pkg = require("./package.json"),
  build = require("../notiontheory-basic-build"),
  nt = build.setup(gulp, pkg),

  js = nt.js("PrimroseLib-WithDoc", "src", ["format"], (inFile) => {
    // removes the documentation objects from the concatenated library.
    var outFile = inFile.replace("-WithDoc", "");
    pliny.carve(inFile, outFile, "doc/PrimroseDocumentation.js");
  }, true),

  // Pliny doesn't perform minification of the the output documentation file, so
  // we do it here.
  min = nt.min("PrimroseDocumentation", ["doc/PrimroseDocumentation.js"], [{
    debug: js.debug,
    release: js.debug
  }]),

  // Combine the dependencies and the library into a single, easy to use package.
  tot = nt.cat("Primrose", [
    "node_modules/promise-polyfill/promise.js",
    "node_modules/three/build/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/iphone-inline-video/dist/iphone-inline-video.browser.js",
    "../webvr-polyfill/webvrMinPolyfill.js",
    "../webvr-standard-monitor/webvrStandardMonitor.js",
    "PrimroseLib.js"
  ].map((file) => {
    if(!fs.existsSync(file)){
      throw new Error("file doesn't exist: " + file);
    }
    return file;
  }), [{
    debug: min.debug,
    release: min.debug
  }]),

  // Delete some intermediate files that aren't needed.
  clean = nt.clean("Primrose", [
    "PrimroseLib-WithDoc*.js",
    "PrimroseDependencies*.js",
    "PrimroseLib*.js"
  ], [tot.release]),

  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "templates/**/*.pug"], "src"),
  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]);

gulp.task("format", [js.format]);
gulp.task("js", [js.default]);
gulp.task("js:debug", [js.debug]);
gulp.task("js:release", [js.release]);
gulp.task("html", [html.debug]);
gulp.task("css", [css.debug]);

gulp.task("copy", [tot.release], () => gulp.src(["Primrose.min.js"])
    .pipe(gulp.dest("quickstart")));

gulp.task("default", [
  js.default,
  tot.default,
  html.default,
  css.default
]);

gulp.task("debug", [
  tot.debug,
  html.debug,
  css.debug
]);

gulp.task("test", [
  tot.release,
  html.test,
  css.release
]);

gulp.task("release",  [
  clean,
  html.release,
  css.release
]);

gulp.task("kablamo", build.exec("gulp bump && gulp yolo && cd ../Primrose-Site && gulp kablamo && cd ../Primrose && gulp trololo && npm publish"));