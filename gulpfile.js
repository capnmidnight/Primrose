var gulp = require("gulp"),
  exec = require("child_process").exec,
  pliny = require("pliny"),
  pkg = require("./package.json"),
  nt = require("notiontheory-basic-build").setup(gulp, pkg),
  deps = nt.cat("PrimroseDependencies", [
    "node_modules/promise-polyfill/promise.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/webvr-polyfill/build/webvr-polyfill.js",
    "node_modules/webvr-standard-monitor/webvr-standard-monitor.js",
    "node_modules/webvr-bootstrapper/webvr-bootstrapper.js",
    "node_modules/three/build/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js",
    "node_modules/iphone-inline-video/dist/iphone-inline-video.browser.js",
    "namegen.js"
  ], null, null, true),
  js = nt.js("PrimroseLib-WithDoc", "src", ["format"], pliny.carve.bind(pliny, "PrimroseLib-WithDoc.js", "PrimroseLib.js", "PrimroseDocumentation.js")),
  min = nt.min("PrimroseDocumentation", ["PrimroseDocumentation.js"], [js.debug]),
  tot = nt.cat("Primrose", ["PrimroseDependencies.js", "PrimroseLib.js"], [deps.debug, min.debug]),
  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "templates/**/*.pug"]),
  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]);

gulp.task("format", [js.format]);
gulp.task("js", [js.default]);
gulp.task("html", [html.debug]);
gulp.task("css", [css.debug]);

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
  tot.release,
  html.release,
  css.release
]);