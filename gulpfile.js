var gulp = require("gulp"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  cssmin = require("gulp-cssmin"),
  data = require("gulp-data"),
  footer = require("gulp-footer"),
  fs = require("fs"),
  jshint = require("gulp-jshint"),
  pkg = require("./package.json"),
  pliny = require("pliny"),
  pug = require("gulp-pug"),
  recurseDirectory = require("./server/recurseDirectory"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  zip = require("gulp-zip"),
  pathX = /.*\/(.*).js/,
  sourceFiles = recurseDirectory("src"),
  headerFiles = [
    "node_modules/logger/logger.js",
    "lib/loggerInit.js",
    "lib/promise.js",
    "lib/Element.details.js",
    "node_modules/pliny/pliny.js",
    "lib/sha512.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/three/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js"
  ],
  mainPageFiles = [
    "lib/ga-snippet.js",
    "node_modules/autotrack/autotrack.js"
  ],
  headerSpec = /(?:\b(\d+)\r\n\s*)?h1 ([^\r\n]+)/,
  docFiles = recurseDirectory("doc")
    .filter(function (f) { return /.jade$/.test(f); })
    .map(function (f, i) {
      var file = fs.readFileSync(f, "utf-8").toString(),
        match = file.match(headerSpec),
        index = i;
      if (match) {
        if (match[1]) {
          index = parseInt(match[1]);
        }

        var obj = {
          fileName: f.replace(/\\/g, "/").replace(/\.jade$/, ""),
          index: index,
          title: match[2],
          incomplete: /\[under construction\]/.test(file),
          tutorial: /^Tutorial:/.test(match[2]),
          example: /^Example:/.test(match[2])
        };

        return obj;
      }
    }).filter(function (f) {
      return f;
    }),
  debugDataES6 = {
    debug: true,
    jsExt: ".js",
    cssExt: ".css",
    frameworkFiles: headerFiles.concat(sourceFiles)
  },
  debugDataES5 = JSON.parse(JSON.stringify(debugDataES6));

docFiles.sort(function (a, b) {
  return a.index - b.index;
});

debugDataES5.frameworkFiles = debugDataES5.frameworkFiles.map(function (f) {
  return f.replace(/^src\//, "es5/");
});



function pugConfiguration(options, defaultData) {
  return gulp.src(["*.jade", "doc/**/*.jade"], { base: "./" })
    .pipe(rename(function (path) {
      path.extname = "";
      return path;
    }))
    .pipe(data(function (file, callback) {
      var name = file.path.replace(/\\/g, "/"),
        parts = name.split("/")
          .map(function () {
            return "../";
          }),
        shortName = name.match(/([^\/]+)\.html$/),
        scriptName = name.replace(/\.html$/, "/app.js");

      parts.pop();

      var exists = fs.existsSync(scriptName);
      txt = exists && fs.readFileSync(scriptName, "utf-8");

      callback(null, {
        debug: defaultData.debug,
        version: pkg.version,
        cssExt: defaultData.cssExt,
        jsExt: defaultData.jsExt,
        filePath: name,
        fileRoot: parts.join(""),
        fileName: shortName && shortName[1],
        fileSize: function fileSize(file) {
          return (fs.lstatSync(file).size / 1000).toFixed(1) + "KB";
        },
        docFiles: docFiles,
        frameworkFiles: defaultData.frameworkFiles,
        demoScriptName: scriptName,
        demoScript: exists && ("grammar(\"JavaScript\");\n" + txt)
      });
    }))
    .pipe(pug(options))
    .on("error", console.error.bind(console, "PUG ERROR"))
    .pipe(gulp.dest("."));
}

gulp.task("pug:release", function () {
  return pugConfiguration({}, {
    jsExt: ".min.js",
    cssExt: ".min.css"
  });
});

gulp.task("pug:debug:es5", function () {
  return pugConfiguration({ pretty: true }, debugDataES5);
});

gulp.task("pug:debug:es6", function () {
  return pugConfiguration({ pretty: true }, debugDataES6);
});

gulp.task("cssmin", function () {
  gulp.src(["doc/**/*.css", "stylesheets/**/*.css", "!**/*.min.css"], { base: "./" })
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./"));
});

gulp.task("jshint", function () {
  return gulp.src(sourceFiles)
    .pipe(jshint({
      multistr: true,
      esnext: true
    }));
});

gulp.task("babel", ["jshint"], function () {
  return gulp.src("src/**/*.js", { base: "./src" })
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    }))
    .pipe(gulp.dest("./es5"));
});

function concatenate(stream, name, f) {
  var s = stream.pipe(concat(name + ".js", { newLine: "\n" }));
  if (f) {
    s = s.pipe(footer(f));
  }
  return s.pipe(gulp.dest("./"));
}

gulp.task("concat:primrose", ["jshint"], function () {
  return concatenate(gulp.src(sourceFiles)
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    })), "Primrose", "\nPrimrose.VERSION = \"v" + pkg.version + "\";\nconsole.info(\"Using Primrose v" + pkg.version +". Find out more at http://www.primrosevr.com\");");
});

gulp.task("concat:dependencies", function () {
  return concatenate(gulp.src(headerFiles), "PrimroseDependencies");
});

gulp.task("concat:marketing", function () {
  return concatenate(gulp.src(mainPageFiles), "PrimroseSite");
});

gulp.task("carveDocumentation", ["concat:primrose"], function (callback) {
  pliny.carve("Primrose.js", "PrimroseDocumentation.js", function () {
    console.log("done");
    callback();
  });
});

gulp.task("jsmin", ["carveDocumentation", "concat:dependencies", "concat:marketing"], function () {
  return gulp.src(["Primrose*.js", "!*.min.js"])
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("./"));
});


gulp.task("archive", ["jsmin"], function () {
  return gulp.src(["Primrose*.js", "!PrimroseSite*", "!PrimroseDependencies*"])
    .pipe(rename(function (file) {
      if (file.basename.indexOf(".min") > -1) {
        file.extname = ".min.js";
        file.basename = file.basename.substring(0, file.basename.length - 4);
      }
      file.basename += "-" + pkg.version;
      return file;
    }))
    .pipe(gulp.dest("archive"));
});

gulp.task("copy:quickstart", ["jsmin"], function () {
  return gulp.src([
    "../HereTTP/bin/x86/Release/StartHere.exe",
    "Primrose*.min.js", "!PrimroseSite.min.js",
    "doc/models/monitor.*",
    "doc/models/cardboard.*",
    "doc/fonts/helvetiker_regular.typeface.js",
    "doc/audio/wind.ogg",
    "!**/*.blend"])
    .pipe(gulp.dest("quickstart"));
});

gulp.task("quickstart", ["copy:quickstart"], function () {
  return gulp.src(["quickstart/**/*"])
    .pipe(zip("quickstart.zip"))
    .pipe(gulp.dest("."));
});

gulp.task("debug", ["jshint", "pug:debug:es6"]);
gulp.task("default", ["debug"]);
gulp.task("stage", ["babel", "pug:debug:es5"]);
gulp.task("release", ["cssmin", "pug:release", "quickstart", "archive"]);