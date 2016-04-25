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
  headerFiles = [
    "node_modules/marked/lib/marked.js",
    "lib/pliny.js",
    "lib/sha512.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/three/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js"
  ],
  baseFiles = headerFiles.slice(),
  payloadFiles = headerFiles.map(function (f) {
    return "scripts/" + f.match(/(\w+(\.\w+)*).js$/)[1] + ".min.js";
  });

payloadFiles.push("scripts/Primrose.min.js");

baseFiles.splice(baseFiles.length, 0,
  "lib/analytics.js",
  "lib/ga.js",
  "lib/mailchimp.js",
  "obj/Primrose.js");

var pathX = /.*\/(.*).js/,
  copyFiles = baseFiles.map(function (s) {
    return {
      src: s,
      dest: s.replace(pathX, "scripts/$1.js")
    };
  });

copyFiles.push({
  src: "scripts/Primrose.js",
  dest: "archive/Primrose-" + pkg.version + ".js"
});

copyFiles.push({
  src: "scripts/Primrose.min.js",
  dest: "archive/Primrose-" + pkg.version + ".min.js"
});

var pugFileSpec = ["*.jade", "doc/**/*.jade", "examples/**/*.jade",
  "*.pug", "doc/**/*.pug", "examples/**/*.pug"];

function pugConfiguration(options, defaultData) {
  return gulp.src(pugFileSpec, { base: "./" })
    .pipe(rename(function (path) {
      path.extname = "";
      return path;
    }))
    .pipe(data(function (file) {
      var name = file.path.replace(/\\/g, "/"),
        parts = name.split("/")
          .map(function () {
            return "../";
          });
      parts.pop();
      return {
        debug: defaultData.debug,
        version: pkg.version,
        filename: name,
        fileRoot: parts.join(""),
        docFiles: defaultData.docFiles,
        frameworkFiles: defaultData.frameworkFiles
      };
    }))
    .pipe(pug(options))
    .pipe(gulp.dest("."));
}

var headerSpec = /\b(\d+)\r\n\s*h1 ([^\r\n]+)/,
  debugDataES6 = {
    debug: true,
    frameworkFiles: recurseDirectory("src"),
    docFiles: recurseDirectory("doc")
      .filter(function (f) { return /.jade$/.test(f); })
      .map(function (f, i) {
        var file = fs.readFileSync(f, "utf-8").toString(),
          match = file.match(headerSpec),
          index = i;
        if (match[1].length > 0) {
          index = parseInt(match[1]);
        }
        return {
          fileName: f.replace(/\\/g, "/").replace(/\.jade$/, ""),
          index: index,
          title: match[2],
          incomplete: /\[under construction\]/.test(file),
          tutorial: /^Tutorial:/.test(match[2])
        };
      })
  };

debugDataES6.frameworkFiles.splice(0, 0,
  "lib/logger.js",
  "lib/webgl-debug.js");

debugDataES6.frameworkFiles.splice
  .bind(debugDataES6.frameworkFiles, 0, 0)
  .apply(debugDataES6.frameworkFiles, headerFiles);

debugDataES6.docFiles.sort(function (a, b) {
  return a.index - b.index;
});

var debugDataES5 = JSON.parse(JSON.stringify(debugDataES6));
debugDataES5.frameworkFiles = debugDataES5.frameworkFiles.map(function (f) {
  return f.replace(/^src\//, "es5/");
});


gulp.task("clean", function () {
  return gulp.src(["obj", "es5", "scripts", "debug", "release", "doc/**/*.min.css", "examples/**/*.min.css", "stylesheets/**/*.min.css", "templates/*", "!templates/*.jade"])
    .pipe(clean());
});

gulp.task("pugRelease", ["clean"], function () {
  return pugConfiguration({}, { docFiles: debugDataES6.docFiles });
});

gulp.task("pugDebugES5", function () {
  return pugConfiguration({ pretty: true }, debugDataES5);
});

gulp.task("pugDebugES6", function () {
  return pugConfiguration({ pretty: true }, debugDataES6);
});

gulp.task("cssmin", ["clean"], function () {
  gulp.src(["doc/**/*.css", "stylesheets/**/*.css", "examples/**/*.css", "!*.min.css"], { base: "./" })
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./"));
});

gulp.task("jshint", function () {
  return gulp.src("src/**/*.js")
    .pipe(jshint({
      multistr: true,
      esnext: true
    }));
});

gulp.task("babel", ["jshint"], function () {
  return gulp.src("src/**/*.js", { base: "./" })
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    }))
    .pipe(gulp.dest("es5"));
});

gulp.task("debugES6", ["pugDebugES6", "jshint"], function () {
  var watcher = gulp.watch("src/**/*.js", ["jshint"]);
  watcher.on("change", function (event) {
    if (event.type === "deleted") {
      delete cached.caches.scripts[event.path];
      remember.forget("scripts", event.path);
    }
  });
});

gulp.task("debugES5", ["pugDebugES5", "jshint", "babel"], function () {
  var watcher = gulp.watch("src/**/*.js", ["jshint", "babel"]);
  watcher.on("change", function (event) {
    if (event.type === "deleted") {
      delete cached.caches.scripts[event.path];
      remember.forget("scripts", event.path);
    }
  });
});

gulp.task("concatPrimrose", ["babel"], function () {
  return gulp.src(["es5/index.js", "es5/base/**/*.js", "es5/fx/**/*.js", "es5/x/**/*.js"], { base: "./" })
    .pipe(concat("Primrose.js", { newLine: ";" }))
    .pipe(gulp.dest("obj"));
});

gulp.task("uglify", ["concatPrimrose"], function () {
  return gulp.src("obj/Primrose.js")
    .pipe(rename(function (file) {
      return "Primrose.min.js";
    }))
    .pipe(gulp.dest("obj"));
});

gulp.task("copy", ["uglify"], function () {
});

gulp.task("concatPayload", ["copy"], function () {
  return gulp.src(payloadFiles, { base: "./" })
    .pipe(concat("payload.js", { newLine: ";" }))
    .pipe(gulp.dest("./"));
});

gulp.task("release", ["clean", "pugRelease", "cssmin", "jshint", "babel"], function () {
  "concatPrimrose", "uglify", "copy", "concatPayload"


});


gulp.task("default", ["debugES6"]);