var gulp = require("gulp"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  data = require("gulp-data"),
  footer = require("gulp-footer"),
  fs = require("fs"),
  jshint = require("gulp-jshint"),
  path = require("path"),
  pkg = require("./package.json"),
  pliny = require("pliny"),
  pug = require("gulp-pug"),
  recurseDirectory = require("./recurseDirectory"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  sourceFiles = recurseDirectory("src"),
  headerFiles = [
    "node_modules/logger/logger.js",
    "lib/promise.js",
    "lib/Element.details.js",
    "node_modules/pliny/pliny.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/three/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js"
  ],
  headerSpec = /(?:\b(\d+)\r\n\s*)?h1 ([^\r\n]+)/,
  docFiles = recurseDirectory("templates/doc")
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
          fileName: f.replace(/\\/g, "/")
            .replace(/^templates\/(.+)\.jade$/, "$1"),
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
  return gulp.src(["*.jade", "*.pug", "templates/doc/*.jade", "templates/doc/*.pug"], { base: "./" })
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
        shortName = name.match(/([^\/]+)\.html$/),
        scriptName = name.replace(/\.html$/, "/app.js");

      parts.pop();

      callback(null, {
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
        getDemoScript: function getDemoScript(scriptName) {
          return "grammar(\"JavaScript\");\n" + fs.readFileSync(scriptName, "utf-8");
        }
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

gulp.task("carveDocumentation", ["concat:primrose"], function (callback) {
  pliny.carve("Primrose.js", "PrimroseDocumentation.js", callback);
});

gulp.task("jsmin", ["carveDocumentation", "concat:dependencies"], function () {
  return gulp.src(["Primrose*.js", "!*.min.js"])
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("./"));
});


gulp.task("archive", ["jsmin"], function () {
  return gulp.src(["Primrose*.js", "!PrimroseDependencies*"])
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
    "Primrose*.min.js",
    "doc/models/monitor.*",
    "doc/models/cardboard.*",
    "doc/fonts/helvetiker_regular.typeface.js",
    "doc/audio/wind.ogg",
    "!**/*.blend"])
    .pipe(gulp.dest("quickstart"));
});

gulp.task("debug", ["jshint", "pug:debug:es6"]);
gulp.task("default", ["debug"]);
gulp.task("stage", ["babel", "pug:debug:es5"]);
gulp.task("release", ["pug:release", "copy:quickstart", "archive"]);