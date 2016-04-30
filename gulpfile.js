var gulp = require("gulp"),
  babel = require("gulp-babel"),
  clean = require("gulp-clean"),
  concat = require("gulp-concat"),
  copy = require("gulp-copy"),
  cssmin = require("gulp-cssmin"),
  data = require("gulp-data"),
  footer = require("gulp-footer"),
  fs = require("fs"),
  header = require("gulp-header"),
  jshint = require("gulp-jshint"),
  path = require("path"),
  pkg = require("./package.json"),
  pug = require("gulp-pug"),
  recurseDirectory = require("./server/recurseDirectory"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  pathX = /.*\/(.*).js/,
  pugFileSpec = ["*.jade", "doc/**/*.jade"],
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
  return gulp.src(pugFileSpec, { base: "./" })
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
        shortName = name.match(/([^\/]+)\.html$/);
      parts.pop();

      var scriptName = name.replace(/\.html$/, "/app.js");
      fs.readFile(scriptName, "utf-8", function (err, txt) {
        callback(undefined, {
          debug: defaultData.debug,
          version: pkg.version,
          cssExt: defaultData.cssExt,
          jsExt: defaultData.jsExt,
          filePath: name,
          fileRoot: parts.join(""),
          fileName: shortName && shortName[1],
          docFiles: docFiles,
          frameworkFiles: defaultData.frameworkFiles,
          demoScriptName: scriptName,
          demoScript: !err && ("grammar(\"JavaScript\");\n" + txt)
        });
      });
    }))
    .pipe(pug(options))
    .pipe(gulp.dest("."));
}

gulp.task("jshint", function () {
  return gulp.src(sourceFiles)
    .pipe(jshint({
      multistr: true,
      esnext: true
    }));
});

gulp.task("pugRelease", function () {
  return pugConfiguration({}, {
    jsExt: ".min.js",
    cssExt: ".min.css"
  });
});

gulp.task("pugDebugES5", function () {
  return pugConfiguration({ pretty: true }, debugDataES5);
});

gulp.task("pugDebugES6", function () {
  return pugConfiguration({ pretty: true }, debugDataES6);
});

gulp.task("clean", ["jshint"], function () {
  return gulp.src(["**/*.min.*", "!archive/*", "es5/*.js"])
    .pipe(clean());
});

gulp.task("cssmin", ["clean"], function () {
  gulp.src(["doc/**/*.css", "stylesheets/**/*.css", "!*.min.css"], { base: "./" })
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./"));
});

gulp.task("babel", ["clean"], function () {
  return gulp.src("src/**/*.js", { base: "./src" })
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    }))
    .pipe(gulp.dest("./es5"));
});

function concatenate(stream, name) {
  return stream
    .pipe(concat(name + ".js", { newLine: "\n" }))
    .pipe(gulp.dest("./"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("./"));
}

gulp.task("concatPrimrose", ["clean"], function () {
  return concatenate(gulp.src(sourceFiles)
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    })), "Primrose");
});

gulp.task("concatPayload", ["clean"], function () {
  return concatenate(gulp.src(headerFiles), "PrimroseDependencies");
});

gulp.task("concatMarketing", ["clean"], function () {
  return concatenate(gulp.src(mainPageFiles), "PrimroseSite");
});

gulp.task("archive", ["concatPrimrose"], function () {
  return gulp.src(["Primrose*.js"])
    .pipe(rename(function (file) {
      if (file.basename.indexOf(".min") > -1) {
        file.extname = ".min.js";
      }
      file.basename = "Primrose-" + pkg.version;
      return file;
    }))
    .pipe(gulp.dest("archive"));
});

gulp.task("release", ["cssmin", "pugRelease", "concatPayload", "concatMarketing", "archive"]);
gulp.task("debugES5", ["babel", "pugDebugES5"]);
gulp.task("default", ["pugDebugES6"]);