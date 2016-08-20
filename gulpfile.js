var gulp = require("gulp"),
  build = require("../notiontheory-basic-build/src/index.js"),
  exec = require("child_process").exec,
  pliny = require("pliny"),
  nt = build.setup(gulp),
  js = nt.js("PrimroseLib", ["src/**/*.js"]),
  html = nt.html("PrimrosePug", ["**/*.pug"]),
  css = nt.css("PrimroseStylus", ["**/*.styl"]);
  deps = nt.cat("PrimroseDependencies", [
    "node_modules/bare-bones-logger/bare-bones-logger.js",
    "node_modules/marked/marked.js",
    "node_modules/pliny/pliny.js",
    "node_modules/promise-polyfill/promise.js",
    "node_modules/lavu-details-polyfill/lib/index.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/jshashes/hashes.js",
    "node_modules/three/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js",
    "node_modules/three/examples/js/loaders/FBXLoader.js",
    "node_modules/webvr-polyfill/build/webvr-polyfill.js",
    "node_modules/html2canvas/dist/html2canvas.js",
    "namegen.js"
  ]);

gulp.task("PrimroseDocumentation", [js.debug], function(callback) {
  pliny.carve("PrimroseLib.js", "PrimroseDocumentation.js", callback);
});

var total = nt.cat("Primrose", ["PrimroseDependencies.js", "PrimroseLib.js"], ["PrimroseDocumentation", deps.debug]);

var tasks = ["default", "debug", "release"].reduce((obj, type) => {
  obj[type] = [js, css, html, deps, total].map((arr) => arr[type]);
  return obj;
}, {});

gulp.task("MeetingManifest", (cb) => exec("cd meeting && node node_modules/webvr-bootstrapper/index.js ../PrimroseDependencies.min.js ../Primrose.min.js ../doc/models/meeting/meetingroom.obj ../doc/models/meeting/meetingroom.mtl ../doc/models/meeting/BackdropTexture.png ../doc/models/meeting/Chair1Texture.png ../doc/models/meeting/Chair2Texture.png ../doc/models/meeting/Chair3Texture.png ../doc/models/meeting/Chair4Texture.png ../doc/models/meeting/Cup1Texture.png ../doc/models/meeting/Cup2Texture.png ../doc/models/meeting/Cup3Texture.png ../doc/models/meeting/Cup4Texture.png ../doc/models/meeting/Cup5Texture.png ../doc/models/meeting/LampshadeTexture.png ../doc/models/meeting/RoomTexture.png ../doc/models/meeting/TableTexture.png ../doc/models/meeting/monitor.obj ../doc/models/monitor.mtl ../doc/models/cardboard.obj ../doc/models/cardboard.mtl ../doc/models/microphone.obj ../doc/models/microphone.mtl ../doc/fonts/helvetiker_regular.typeface.js ../doc/models/avatar.json app.js", (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  cb(err);
}));

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
gulp.task("PrimroseArchive", [total.release], archive);

tasks.release.push("MeetingManifest", "PrimroseArchive");

for(var type in tasks){
  gulp.task(type, tasks[type]);
}