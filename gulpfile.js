var gulp = require("gulp"),
  build = require("notiontheory-basic-build"),
  exec = require("child_process").exec,
  pliny = require("pliny"),
  rename = require("gulp-rename"),
  pkg = require("./package.json"),
  nt = build.setup(gulp),
  deps = nt.cat("PrimroseDependencies", [
    "node_modules/promise-polyfill/promise.js",
    "node_modules/lavu-details-polyfill/lib/index.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/webvr-polyfill/build/webvr-polyfill.js",
    "node_modules/webvr-standard-monitor/webvr-standard-monitor.js",
    "node_modules/webvr-bootstrapper/webvr-bootstrapper.js",
    "node_modules/html2canvas/dist/html2canvas.js",
    "node_modules/three/build/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js",
    "node_modules/three/examples/js/loaders/FBXLoader.js",
    "node_modules/bare-bones-logger/bare-bones-logger.js",
    "namegen.js"
  ]),
  js = nt.js("PrimroseLib-WithDoc", "src", ["format"], pliny.carve.bind(pliny, "PrimroseLib-WithDoc.js", "PrimroseLib.js", "PrimroseDocumentation.js")),
  min = nt.min("PrimroseDocumentation", ["PrimroseDocumentation.js"], [js.build]),
  tot = nt.cat("Primrose", ["PrimroseDependencies.js", "PrimroseLib.js"], [deps.build, min.build]),
  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "meeting/**/*.pug"]),
  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]);

gulp.task("format", [js.format]);

gulp.task("archive", [min.build], () => gulp.src(["Primrose*.js"])
  .pipe(rename(function (file) {
    if (file.basename.indexOf(".min") > -1) {
      file.extname = ".min.js";
      file.basename = file.basename.substring(0, file.basename.length - 4);
    }
    file.basename += "-" + pkg.version;
    return file;
  }))
  .pipe(gulp.dest("archive")));

gulp.task("MeetingManifest", [tot.build], (cb) => exec("cd meeting && node ../node_modules/webvr-bootstrapper ../Primrose.min.js ../doc/models/meeting/meetingroom.obj ../doc/models/meeting/meetingroom.mtl ../doc/models/meeting/BackdropTexture.png ../doc/models/meeting/Chair1Texture.png ../doc/models/meeting/Chair2Texture.png ../doc/models/meeting/Chair3Texture.png ../doc/models/meeting/Chair4Texture.png ../doc/models/meeting/Cup1Texture.png ../doc/models/meeting/Cup2Texture.png ../doc/models/meeting/Cup3Texture.png ../doc/models/meeting/Cup4Texture.png ../doc/models/meeting/Cup5Texture.png ../doc/models/meeting/LampshadeTexture.png ../doc/models/meeting/RoomTexture.png ../doc/models/meeting/TableTexture.png ../doc/fonts/helvetiker_regular.typeface.jsonon ../doc/models/avatar.json ../doc/audio/wind.ogg app.js", (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  cb(err);
}));

gulp.task("js", [js.default]);
gulp.task("html", [html.debug]);
gulp.task("css", [css.build]);

gulp.task("default", [
  deps.default,
  js.default,
  html.default,
  css.default
]);

gulp.task("debug", [
  tot.build,
  html.debug,
  css.build
]);

gulp.task("js", [js.default]);
gulp.task("html", [html.debug]);
gulp.task("css", [css.build]);

gulp.task("release",  [
  "archive",
  "MeetingManifest",
  html.release,
  css.build
]);