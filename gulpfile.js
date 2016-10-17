var gulp = require("gulp"),
  exec = require("child_process").exec,
  pliny = require("pliny"),
  pkg = require("./package.json"),
  nt = require("../notiontheory-basic-build/src").setup(gulp, pkg),
  deps = nt.cat("PrimroseDependencies", [
    "node_modules/promise-polyfill/promise.js",
    "node_modules/socket.io-client/socket.io.js",
    "../webvr-polyfill/build/webvr-polyfill.js",
    "../webvr-standard-monitor/webvr-standard-monitor.js",
    "node_modules/webvr-bootstrapper/webvr-bootstrapper.js",
    "node_modules/three/build/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js",
    "../bare-bones-logger/bare-bones-logger.js",
    "namegen.js"
  ], null, null, true),
  js = nt.js("PrimroseLib-WithDoc", "src", ["format"], pliny.carve.bind(pliny, "PrimroseLib-WithDoc.js", "PrimroseLib.js", "PrimroseDocumentation.js")),
  jsDev = nt.js("PrimroseLib-WithDoc", "src", ["format"], pliny.carve.bind(pliny, "PrimroseLib-WithDoc.js", "PrimroseLib.js", "PrimroseDocumentation.js"), true),
  min = nt.min("PrimroseDocumentation", ["PrimroseDocumentation.js"], [js.build]),
  tot = nt.cat("Primrose", ["PrimroseDependencies.js", "PrimroseLib.js"], [deps.build, min.build]),
  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "templates/**/*.pug"]),
  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]);

gulp.task("format", [js.format]);
gulp.task("js", [jsDev.default]);
gulp.task("html", [html.debug]);
gulp.task("css", [css.build]);

gulp.task("default", [
  deps.default,
  jsDev.default,
  html.default,
  css.default
]);

gulp.task("debug", [
  tot.build,
  html.debug,
  css.build
]);

gulp.task("test", [
  tot.build,
  html.test,
  css.build
]);

gulp.task("release",  [
  tot.build,
  html.release,
  css.build
]);