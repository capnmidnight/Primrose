function recurseDirectory(root) {
  var directoryQueue = [root],
    files = [];
  while (directoryQueue.length > 0) {
    var directory = directoryQueue.shift(),
      subFiles = fs.readdirSync(directory);
    for (var j = 0; j < subFiles.length; ++j) {
      var subFile = path.join(directory, subFiles[j]),
        stats = fs.lstatSync(subFile);
      if (stats.isDirectory()) {
        directoryQueue.push(subFile);
      }
      else {
        files.push(subFile.replace(/\\/g, "/"));
      }
    }
  }
  return files;
}

function not(dir, ext) {
  return "!" + ((dir && dir + "/") || "") + "**/*" + (ext || "");
}

function watchify(task, files, deps) {
  gulp.task("watch:" + task, deps || [], function () {
    return gulp.watch(files, [task]);
  });
}

var gulp = require("gulp"),
  babel = require("gulp-babel"),
  beautify = require("gulp-beautify"),
  concat = require("gulp-concat"),
  cssmin = require("gulp-cssmin"),
  data = require("gulp-data"),
  exec = require("child_process").exec,
  footer = require("gulp-footer"),
  fs = require("fs"),
  jshint = require("gulp-jshint"),
  path = require("path"),
  pkg = require("./package.json"),
  pliny = require("pliny"),
  pug = require("gulp-pug"),
  rename = require("gulp-rename"),
  stylus = require("gulp-stylus"),
  uglify = require("gulp-uglify"),
  jsFiles = [
    "src/**/*.js",
    "doc/**/*.js"
  ],
  stylusFiles = ["doc/**/*.styl"],
  pugFiles = [
    "*.jade",
    "*.pug",
    // */**/* is not a typo. I don't want to recurse through the templates folder,
    // I only want to recurse through the child folders of the templates folder.
    "templates/*/**/*.jade",
    "templates/*/**/*.pug"
  ],
  hasHereTTP = fs.existsSync("../VR.sln"),
  hasWebVRBootstrapper = fs.existsSync("../WebVR-Bootstrapper"),
  hasLogger = fs.existsSync("../logger"),
  hasPliny = fs.existsSync("../pliny"),
  sourceFiles = recurseDirectory("src");

sourceFiles.sort();

var debugDataES6 = {
    debug: true,
    jsExt: ".js",
    cssExt: ".css",
    bootstrapFiles: hasWebVRBootstrapper ? ["../WebVR-Bootstrapper/webvr-bootstrapper.js"] : ["node_modules/webvr-bootstrapper/webvr-bootstrapper.js"],
    frameworkFiles: [
      "node_modules/logger/logger.js",
      "node_modules/marked/marked.min.js",
      "node_modules/pliny/pliny.js",
      "node_modules/socket.io-client/socket.io.js",
      "node_modules/jshashes/hashes.js",
      "node_modules/three/three.js",
      "node_modules/three/examples/js/loaders/OBJLoader.js",
      "node_modules/three/examples/js/loaders/MTLLoader.js",
      "node_modules/three/examples/js/loaders/FBXLoader.js",
      "node_modules/html2canvas/dist/html2canvas.js"
    ]
    .concat(sourceFiles)
  },
  debugDataES5 = JSON.parse(JSON.stringify(debugDataES6));

debugDataES5.frameworkFiles = debugDataES5.frameworkFiles.map(function (f) {
  return f.replace(/^src\//, "es5/");
});

function echoName(op) {
  return rename(function (dat) {
    console.log("%s: %s%s%s%s", op, dat.dirname, path.sep, dat.basename, dat.extname);
    return dat;
  });
}


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

      var fxFiles = frameworkFiles;
      if (fs.existsSync(scriptName)) {
        fxFiles = fxFiles.concat([getFileDescrip(scriptName)]);
      }

      callback(null, {
        debug: defaultData.debug,
        version: pkg.version,
        cssExt: defaultData.cssExt,
        jsExt: defaultData.jsExt,
        filePath: name,
        fileRoot: fileRoot,
        fileName: shortName,
        manifest: JSON.stringify(fxFiles.map(function (f) {
          return [
            fileRoot + f[0],
            f[1]
          ];
        })),
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

function X(name, cmd, deps) {
  gulp.task(name, deps || [], function (cb) {
    exec(cmd, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });
}

if (hasHereTTP) {
  X("build:herettp", "msbuild ../VR.sln /t:Build /p:Configuration=Release;Platform=x86");

  function copyHereTTP() {
    return gulp.src(["../HereTTP/bin/x86/Release/StartHere.exe"])
      .pipe(rename(function (path) {
        path.basename += "-WINDOWS";
        return path;
      }))
      .pipe(gulp.dest("."));
  }
  gulp.task("copy:herettp", ["build:herettp"], copyHereTTP);
  gulp.task("just:copy:herettp", copyHereTTP);
}

if (hasWebVRBootstrapper) {
  X("build:bootstrapper", "cd ../WebVR-Bootstrapper && gulp");

  X("build:manifest:quickstart", "cd quickstart && node ../../WebVR-Bootstrapper/index.js PrimroseDependencies.min.js Primrose.min.js PrimroseDocumentation.min.js app.js", ["jsmin"]);

  X("build:manifest:meeting", "cd meeting && node ../../WebVR-Bootstrapper/index.js ../PrimroseDependencies.min.js ../Primrose.min.js ../doc/models/meeting/meetingroom.obj ../doc/models/meeting/meetingroom.mtl ../doc/models/meeting/BackdropTexture.png ../doc/models/meeting/Chair1Texture.png ../doc/models/meeting/Chair2Texture.png ../doc/models/meeting/Chair3Texture.png ../doc/models/meeting/Chair4Texture.png ../doc/models/meeting/Cup1Texture.png ../doc/models/meeting/Cup2Texture.png ../doc/models/meeting/Cup3Texture.png ../doc/models/meeting/Cup4Texture.png ../doc/models/meeting/Cup5Texture.png ../doc/models/meeting/LampshadeTexture.png ../doc/models/meeting/RoomTexture.png ../doc/models/meeting/TableTexture.png ../doc/models/meeting/monitor.obj ../doc/models/monitor.mtl ../doc/models/cardboard.obj ../doc/models/cardboard.mtl ../doc/models/microphone.obj ../doc/models/microphone.mtl ../doc/fonts/helvetiker_regular.typeface.js ../doc/models/avatar.json app.js");

  var quickstartDependencies = [
    "build:manifest:quickstart",
    "build:manifest:meeting",
    "build:bootstrapper"
  ];

  if (hasHereTTP) {
    quickstartDependencies.push("copy:herettp");
  }

  function copyQuickstart() {
    var toCopy = [
      "StartHere*",
      "../WebVR-Bootstrapper/webvr-bootstrapper.min.js",
      "Primrose*.min.js",
      "doc/models/monitor.*",
      "doc/models/cardboard.*",
      "doc/fonts/helvetiker_regular.typeface.js",
      "doc/audio/wind.ogg",
      not(null, ".blend"),
    ];

    return gulp.src(toCopy)
      .pipe(gulp.dest("quickstart"));
  }
  gulp.task("copy:quickstart", quickstartDependencies, copyQuickstart);
  gulp.task("just:copy:quickstart", copyQuickstart);
}

if (hasLogger) {
  X("build:logger", "cd ../logger && gulp");
}

if (hasPliny) {
  X("build:pliny", "cd ../pliny && gulp");
}

function pugRelease() {
  return pugConfiguration({}, {
    jsExt: ".min.js",
    cssExt: ".min.css",
    frameworkFiles: ["PrimroseDependencies.min.js", "Primrose.min.js"]
  });
}
gulp.task("pug:release", ["cssmin", "jsmin"], pugRelease);
gulp.task("just:pug:release", pugRelease);

function pugDebugES5() {
  return pugConfiguration({
    pretty: true
  }, debugDataES5);
}
gulp.task("pug:debug:es5", ["babel"], pugDebugES5);
gulp.task("just:pug:debug:es5", pugDebugES5);

gulp.task("just:stylus", function () {
  return gulp.src(stylusFiles, {
      base: "./"
    })
    .pipe(stylus())
    .pipe(gulp.dest("./"));
});
watchify("just:stylus", stylusFiles);

function cssMin() {
  return gulp.src(["doc/**/*.css", not("doc", ".min.css")], {
      base: "./doc"
    })
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cssmin())
    .pipe(gulp.dest("./doc"));
}
gulp.task("cssmin", ["just:stylus"], cssMin);
gulp.task("just:cssmin", cssMin);

gulp.task("just:pug:debug:es6", function () {
  return pugConfiguration({
    pretty: true
  }, debugDataES6);
});
watchify("just:pug:debug:es6", pugFiles);

gulp.task("just:beautify", function () {
  return gulp.src(jsFiles, {
      base: "./"
    })
    .pipe(beautify({
      indent_size: 2,
      brace_style: "end-expand",
      space_after_anon_function: true,
      break_chained_methods: true
    }))
    .pipe(gulp.dest("./"));
});

function jsHint() {
  return gulp.src(jsFiles)
    .pipe(jshint({
      multistr: true,
      esnext: true
    }));
}
gulp.task("jshint", ["just:beautify"], jsHint);
gulp.task("just:jshint", jsHint);
watchify("just:jshint", jsFiles);

function runBabel() {
  return gulp.src("src/**/*.js", {
      base: "./src"
    })
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    }))
    .pipe(gulp.dest("./es5"));
}
gulp.task("babel", ["jshint"], runBabel);
gulp.task("just:babel", runBabel);

function concatenate(stream, name, f) {
  var s = stream.pipe(concat(name + ".js", {
    newLine: "\n"
  }));
  if (f) {
    s = s.pipe(footer(f));
  }
  return s.pipe(gulp.dest("./"));
}

function concatPrimrose() {
  return concatenate(gulp.src(sourceFiles)
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    })), "Primrose", "\nPrimrose.VERSION = \"v" + pkg.version + "\";\nconsole.info(\"Using Primrose v" + pkg.version + ". Find out more at http://www.primrosevr.com\");");
}
gulp.task("concat:primrose", ["jshint"], concatPrimrose);
gulp.task("just:concat:primrose", concatPrimrose);

var concatDependenciesDependecies = [];

if (hasLogger) {
  concatDependenciesDependecies.push("build:logger");
}

if (hasPliny) {
  concatDependenciesDependecies.push("build:pliny");

  function buildDocumentation(callback) {
    pliny.carve("Primrose.js", "PrimroseDocumentation.js", callback);
  }
  gulp.task("build:documentation", ["concat:primrose"], buildDocumentation);
  gulp.task("just:build:documentation", buildDocumentation);
}

function concatDependencies() {
  return concatenate(gulp.src([
    "node_modules/logger/logger.js",
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
    "node_modules/html2canvas/dist/html2canvas.js"
  ]), "PrimroseDependencies");
}
gulp.task("concat:dependencies", concatDependenciesDependecies, concatDependencies);
gulp.task("just:concat:dependencies", concatDependencies);

var jsMinDependencies = ["concat:dependencies"];
if (hasPliny) {
  jsMinDependencies.push("build:documentation");
}

function jsMin() {
  return gulp.src(["Primrose*.js", "!*.min.js"])
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(uglify())
    .pipe(gulp.dest("./"));
}
gulp.task("jsmin", jsMinDependencies, jsMin);
gulp.task("just:jsmin", jsMin);

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
gulp.task("release", ["pug:release", "copy:quickstart", "archive", "babel"]);
gulp.task("watch", ["watch:just:pug:debug:es6", "watch:just:jshint", "watch:just:stylus"]);

gulp.task("default", ["debug", "watch"]);