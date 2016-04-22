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
  jade = require("gulp-jade"),
  jshint = require("gulp-jshint"),
  path = require("path"),
  pkg = require("./package.json"),
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

var jadeFileSpec = ["*.jade", "doc/**/*.jade", "examples/**/*.jade"];

function jadeConfiguration(options, defaultData) {
  var config = {
    options: options,
    files: [{
      expand: true,
      src: jadeFileSpec,
      dest: "",
      ext: "",
      extDot: "last"
    }]
  };

  defaultData.version = pkg.version;

  config.options.data = function (dest, src) {
    defaultData.filename = dest;
    return defaultData;
  }.bind(config);

  return config;
}

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
        files.push("/" + subFile.replace(/\\/g, "/"));
      }
    }
  }
  return files;
}

var headerSpec = /\b(\d+)\r\n\s*h1 ([^\r\n]+)/,
  debugDataES6 = {
    debug: true,
    frameworkFiles: recurseDirectory("src"),
    docFiles: recurseDirectory("doc")
      .filter(function (f) { return /.jade$/.test(f); })
      .map(function (f, i) {
        var file = fs.readFileSync(f.substring(1), "utf-8").toString(),
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
  "/lib/logger.js",
  "/lib/webgl-debug.js");

debugDataES6.frameworkFiles.splice
  .bind(debugDataES6.frameworkFiles, 0, 0)
  .apply(debugDataES6.frameworkFiles, headerFiles
    .map(function (f) {
      return "/" + f;
    }));

debugDataES6.docFiles.sort(function (a, b) {
  return a.index - b.index;
});

var debugDataES5 = JSON.parse(JSON.stringify(debugDataES6));
debugDataES5.frameworkFiles = debugDataES5.frameworkFiles.map(function (f) {
  return f.replace(/^\/src\//, "/es5/");
});

var jadeDebugConfigurationES5 = jadeConfiguration({ pretty: true }, debugDataES5),
  jadeDebugConfigurationES6 = jadeConfiguration({ pretty: true }, debugDataES6),
  jadeReleaseConfiguration = jadeConfiguration({}, { docFiles: debugDataES6.docFiles });


gulp.task("clean", function () {
  return gulp.src(["obj", "es5", "scripts", "debug", "release", "doc/**/*.min.css", "examples/**/*.min.css", "stylesheets/**/*.min.css", "templates/*", "!templates/*.jade"])
    .pipe(clean());
});

gulp.task("jadeRelease", ["clean"], function () {
});

gulp.task("jadeDebugES5", function () {
});

gulp.task("jadeDebugES6", function () {
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
  return gulp.src("src/**/*.js")
    .pipe(babel({
      sourceMap: false,
      presets: ["es2015"]
    }))
    .pipe(gulp.dest("es5"));
});

gulp.task("makeRelease", ["babel"], function () {
});

gulp.task("copy", ["uglify"], function () {
});

gulp.task("concatPayload", ["copy"], function () {
  return gulp.src(payloadFiles)
    .pipe(concat("payload.js", { newLine: ";" }))
    .dest("./");
});

gulp.task("debugES6", ["jadeDebugES6", "jshint"], function () {
  var watcher = gulp.watch("src/**/*.js", ["jshint"]);
  watcher.on("change", function (event) {
    if (event.type === "deleted") {
      delete cached.caches.scripts[event.path];
      remember.forget("scripts", event.path);
    }
  });
});

gulp.task("debugES5", ["jadeDebugES5", "jshint", "babel"], function () {
  var watcher = gulp.watch("src/**/*.js", ["jshint", "babel"]);
  watcher.on("change", function (event) {
    if (event.type === "deleted") {
      delete cached.caches.scripts[event.path];
      remember.forget("scripts", event.path);
    }
  });
});

gulp.task("release", ["clean", "jadeRelease", "cssmin", "jshint", "babel"], function () {
  "concatPrimrose", "uglify", "copy", "concatPayload"
});


gulp.task("default", ["debugES6"]);