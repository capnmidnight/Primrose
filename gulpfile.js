var gulp = require("gulp"),
  exec = require("child_process").exec,
  pliny = require("pliny"),
  pkg = require("./package.json"),
  build = require("../notiontheory-basic-build"),
  nt = build.setup(gulp, pkg),

  // The separate dependencies file exists to make the development build faster.
  // No need to constantly be re-concatenating files that haven't changed.
  deps = nt.cat("PrimroseDependencies", [
    "node_modules/promise-polyfill/promise.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/three/build/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/iphone-inline-video/dist/iphone-inline-video.browser.js",
    "lib/namegen.js",
    "../webvr-polyfill/build/webvr-polyfill.js",
    "../webvr-standard-monitor/webvr-standard-monitor.js"
  ]),
  js = nt.js("PrimroseLib-WithDoc", "src", ["format"], pliny.carve.bind(pliny, "PrimroseLib-WithDoc.js", "PrimroseLib.js", "doc/PrimroseDocumentation.js"), true),
  min = nt.min("PrimroseDocumentation", ["doc/PrimroseDocumentation.js"], [js]),
  tot = nt.cat("Primrose", ["PrimroseDependencies.js", "PrimroseLib.js"], [deps, min]),
  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "templates/**/*.pug"]),
  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]),
  clean = nt.clean("Primrose", [
    "Primrose.js",
    "PrimroseLib-WithDoc*.js",
    "PrimroseDependencies*.js",
    "PrimroseLib*.js"
  ], [tot.release]);

gulp.task("format", [js.format]);
gulp.task("js", [js.default]);
gulp.task("js:debug", [js.debug]);
gulp.task("js:release", [js.release]);
gulp.task("html", [html.debug]);
gulp.task("css", [css.debug]);

gulp.task("copy", [tot.release], () => gulp.src(["Primrose.min.js"])
    .pipe(gulp.dest("quickstart")));

gulp.task("default", [
  deps.default,
  js.default,
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

gulp.task("kablamo", build.exec("gulp bump && gulp yolo && gulp trololo && npm publish"));