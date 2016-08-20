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

gulp.task("build:manifest:meeting", () => exec("cd meeting && node node_modules/webvr-bootstrapper/index.js ../PrimroseDependencies.min.js ../Primrose.min.js ../doc/models/meeting/meetingroom.obj ../doc/models/meeting/meetingroom.mtl ../doc/models/meeting/BackdropTexture.png ../doc/models/meeting/Chair1Texture.png ../doc/models/meeting/Chair2Texture.png ../doc/models/meeting/Chair3Texture.png ../doc/models/meeting/Chair4Texture.png ../doc/models/meeting/Cup1Texture.png ../doc/models/meeting/Cup2Texture.png ../doc/models/meeting/Cup3Texture.png ../doc/models/meeting/Cup4Texture.png ../doc/models/meeting/Cup5Texture.png ../doc/models/meeting/LampshadeTexture.png ../doc/models/meeting/RoomTexture.png ../doc/models/meeting/TableTexture.png ../doc/models/meeting/monitor.obj ../doc/models/monitor.mtl ../doc/models/cardboard.obj ../doc/models/cardboard.mtl ../doc/models/microphone.obj ../doc/models/microphone.mtl ../doc/fonts/helvetiker_regular.typeface.js ../doc/models/avatar.json app.js", (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  cb(err);
}));

var debugData = {
    debug: true,
    jsExt: ".js",
    cssExt: ".css"
  },
  releaseData = {
    debug: false,
    jsExt: ".min.js",
    cssExt: ".min.css"
  };

function pugConfiguration(options, defaultData) {

  function getFile(fileName) {
    return fs.readFileSync(fileName, "utf-8");
  }

  function getDemoScript(scriptName) {
    return "grammar(\"JavaScript\");\n" + getFile(scriptName);
  }

  function getFileDescrip(f) {
    return [f, fs.lstatSync(f).size];
  }

  var frameworkFiles = defaultData.frameworkFiles.map(getFileDescrip);
  return gulp.src(["*.jade", "*.pug",
    "templates/doc/**/*.jade", "templates/doc/**/*.pug",
    "templates/meeting/**/*.jade", "templates/meeting/**/*.pug"], { base: "./" })
    .pipe(rename(function (p) {
      p.extname = "";
      p.dirname = p.dirname.replace("templates" + path.sep, "");
      return p;
    }))
    .pipe(data(function (file, callback) {
      var name = file.path.replace(/\\/g, "/"),
        parts = name.split("/")
          .map(function () {
            return "../";
          }),
        nameSpec = name.match(/(\w+\/)(\w+)[/.]/),
        dirName = nameSpec && nameSpec[1],
        shortName = nameSpec && nameSpec[2],
        scriptName = dirName + shortName + "/app.js",
        demoTitle = null;

      parts.pop();

      scriptName = scriptName.replace("index/app.js", "app.js");

      var fileRoot = parts.join("");

      var fxFiles = defaultData.debug ? [] : frameworkFiles;
      if (fs.existsSync(scriptName)) {
        fxFiles = fxFiles.concat([getFileDescrip(scriptName)]);
      }
      fxFiles = fxFiles.map((f) => "        " + JSON.stringify([
        fileRoot + f[0],
        f[1]
      ]));

      callback(null, {
        debug: defaultData.debug,
        version: pkg.version,
        cssExt: defaultData.cssExt,
        jsExt: defaultData.jsExt,
        filePath: name,
        fileRoot: fileRoot,
        fileName: shortName,
        manifest: "[\n" + fxFiles.join(",\n") + "\n      ]",
        bootstrapFiles: defaultData.bootstrapFiles,
        frameworkFiles: defaultData.frameworkFiles,
        demoScriptName: scriptName,
        demoTitle: demoTitle,
        getFile: getFile,
        getDemoScript: getDemoScript
      });
    }))
    .pipe(pug(options))
    .on("error", console.error.bind(console, "PUG ERROR"))
    .pipe(gulp.dest("."));
}

function pugRelease() {
  return pugConfiguration({}, releaseData);
}
gulp.task("pug:release", ["cssmin", "jsmin"], pugRelease);
gulp.task("just:pug:release", pugRelease);

gulp.task("just:pug:debug", function () {
  return pugConfiguration({ pretty: true }, debugData);
});

gulp.task("watch:just:pug:debug", () => gulp.watch(["node_modules/**/*", "**/*.jade", "**/*.pug"], ["just:pug:debug"]));

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