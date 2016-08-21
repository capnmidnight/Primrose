var gulp = require("gulp"),
  build = require("notiontheory-basic-build"),
  concat = require("gulp-concat"),
  exec = require("child_process").exec,
  pliny = require("pliny"),
  rename = require("gulp-rename"),
  pkg = require("./package.json"),
  nt = build.setup(gulp),
  jsFiles = ["src/**/*.js"],
  depFiles = [
    "node_modules/promise-polyfill/promise.js",
    "node_modules/lavu-details-polyfill/lib/index.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/webvr-polyfill/build/webvr-polyfill.js",
    "node_modules/webvr-bootstrapper/webvr-bootstrapper.js",
    "node_modules/html2canvas/dist/html2canvas.js",
    "node_modules/three/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js",
    "node_modules/three/examples/js/loaders/FBXLoader.js",
    "node_modules/bare-bones-logger/bare-bones-logger.js",
    "namegen.js"
  ],
  totFiles = depFiles.concat(jsFiles),
  js = nt.js("PrimroseLib", jsFiles, function(callback) {
    pliny.carve("PrimroseLib.js", "PrimroseDocumentation.js", callback);
  }),
  deps = nt.cat("PrimroseDependencies", depFiles),
  html = nt.html("Primrose", ["!templates/**/*.pug", "**/*.pug"]),
  css = nt.css("Primrose", ["**/*.styl"]);

function finalCountdown(){
  return gulp.src(["PrimroseDependencies.js", "PrimroseLib.js"])
    .pipe(concat("Primrose.js"))
    .pipe(gulp.dest("./"));
}

gulp.task("bundle", [js.debug, deps.debug], finalCountdown);
gulp.task("just:bundle", finalCountdown);
gulp.task("watch:just:bundle", () => gulp.watch(["PrimroseDependencies.js", "PrimroseLib.js"], ["just:bundle"]));

var fullMin = nt.min("Primrose", ["Primrose*.js"], ["bundle"]);
gulp.task("archive", [fullMin], () => gulp.src(["Primrose*.js"])
  .pipe(rename(function (file) {
    if (file.basename.indexOf(".min") > -1) {
      file.extname = ".min.js";
      file.basename = file.basename.substring(0, file.basename.length - 4);
    }
    file.basename += "-" + pkg.version;
    return file;
  }))
  .pipe(gulp.dest("archive")));

gulp.task("MeetingManifest", [fullMin], (cb) => exec("cd meeting && node ../node_modules/webvr-bootstrapper/index.js ../Primrose.min.js ../doc/models/meeting/meetingroom.obj ../doc/models/meeting/meetingroom.mtl ../doc/models/meeting/BackdropTexture.png ../doc/models/meeting/Chair1Texture.png ../doc/models/meeting/Chair2Texture.png ../doc/models/meeting/Chair3Texture.png ../doc/models/meeting/Chair4Texture.png ../doc/models/meeting/Cup1Texture.png ../doc/models/meeting/Cup2Texture.png ../doc/models/meeting/Cup3Texture.png ../doc/models/meeting/Cup4Texture.png ../doc/models/meeting/Cup5Texture.png ../doc/models/meeting/LampshadeTexture.png ../doc/models/meeting/RoomTexture.png ../doc/models/meeting/TableTexture.png ../doc/models/meeting/monitor.obj ../doc/models/monitor.mtl ../doc/models/cardboard.obj ../doc/models/cardboard.mtl ../doc/models/microphone.obj ../doc/models/microphone.mtl ../doc/fonts/helvetiker_regular.typeface.js ../doc/models/avatar.json app.js", (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  cb(err);
}));

gulp.task("debug", ["bundle", html.debug, css.debug]);
gulp.task("default", ["bundle", "watch:just:bundle", html.default, css.default]);
gulp.task("release", ["archive", html.release, css.release, "MeetingManifest"]);