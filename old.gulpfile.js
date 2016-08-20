var data = require("gulp-data"),
  exec = require("child_process").exec,
  fs = require("fs"),
  path = require("path"),
  pkg = require("./package.json"),
  pliny = require("pliny"),
  pug = require("gulp-pug"),
  pugFiles = [
    "*.jade",
    "*.pug",
    // */**/* is not a typo. I don't want to recurse through the templates folder,
    // I only want to recurse through the child folders of the templates folder.
    "templates/*/**/*.jade",
    "templates/*/**/*.pug"
  ],
  sourceFiles = nt.rdir("src"),
  libs = [
    "node_modules/bare-bones-logger/bare-bones-logger.js",
    "node_modules/marked/marked.min.js",
    "node_modules/pliny/pliny.js",
    "node_modules/promise-polyfill/promise.js",
    "node_modules/lavu-details-polyfill/lib/index.min.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/jshashes/hashes.js",
    "node_modules/three/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js",
    "node_modules/three/examples/js/loaders/FBXLoader.js",
    "node_modules/webvr-polyfill/build/webvr-polyfill.js",
    "node_modules/html2canvas/dist/html2canvas.js",
    "namegen.js"
  ];



function buildDocumentation(callback) {
  pliny.carve("Primrose.js", "PrimroseDocumentation.js", callback);
}
gulp.task("build:documentation", ["concat:primroselib"], buildDocumentation);
gulp.task("just:build:documentation", buildDocumentation);

function archive() {
  return gulp.src(["Primrose*.js"])
    .pipe(rename(function (file) {
      if (file.basename.indexOf(".min") > -1) {
        file.extname = ".min.js";
        file.basename = file.basename.substring(0, file.basename.length - 4);
      }
      file.basename += "-" + pkg.version;
      return file;
    }))
    .pipe(gulp.dest("archive"));
}
gulp.task("archive", ["jsmin"], archive);
gulp.task("just:archive", archive);

gulp.task("debug", ["jshint", "just:pug:debug:es6", "just:stylus"]);
gulp.task("stage", ["babel", "pug:debug:es5", "just:stylus"]);
gulp.task("release", ["pug:release", "archive", "babel"]);
gulp.task("watch", ["watch:just:pug:debug:es6", "watch:just:stylus"]);

gulp.task("default", ["debug", "watch"]);