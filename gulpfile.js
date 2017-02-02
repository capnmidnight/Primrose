var gulp = require("gulp"),
  exec = require("child_process").exec,
  glob = require("glob").sync,
  fs = require("fs"),
  path = require("path"),
  pliny = require("pliny"),
  pkg = require("./package.json"),

  startServer = require("notion-node"),

  build = require("notiontheory-basic-build"),
  nt = build.setup(gulp, pkg),

  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "templates/**/*.pug"], "src"),

  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]),

  formats = ["umd", "es"],

  preloaderJS = nt.js("preloader", "preloader/index.js"),

  preloaderMin = nt.min(
    "preloader",  [
    "preloader.js"
  ], [{
    debug: preloaderJS.debug,
    release: preloaderJS.debug
  }]),

  preloader = {
    format: preloaderJS.format,
    default: preloaderJS.default,
    debug: preloaderJS.debug,
    release: preloaderMin.release
  },

  tasks = formats.map((format) => {

    ext = "";
    if(format === "es") {
      ext += ".modules";
    }
    else if(format !== "umd"){
      ext += "." + format;
    }
    ext += ".js";

    var inFile = "PrimroseWithDoc" + ext,
      outFile = inFile.replace("WithDoc", ""),
      docFile = "doc/" + inFile.replace("WithDoc", "Documentation"),
      js = nt.js("PrimroseWithDoc:" + format, "src/index.js", {
      advertise: true,
      moduleName: "Primrose",
      fileName: inFile,
      dependencies: ["format"],
      format: format,
      post: (_, cb) => {
        // removes the documentation objects from the concatenated library.
        pliny.carve(inFile, outFile, docFile, cb);
      }
    });

    var min;
    if(format === "umd") {
      min = nt.min("Primrose", [
        "doc/PrimroseDocumentation.js",
        "Primrose.js"], [{
        debug: js.debug,
        release: js.debug
      }]);
    }

    return { js, min };
  }).reduce((collect, task) => {
    if(!collect.format) {
      collect.format = [task.js.format];
      collect.default = [task.js.default];
    }
    collect.debug.push(task.js.debug);
    var releaseTask = (task.min || task.js).release;
    collect.release.push(releaseTask);
    return collect;
  }, { format: null, default: null, debug: [], release: [] }),

  demos = glob("doc/*/app.js").map(function(file) {

    var name = file.match(/doc\/(\w+)\/app\.js/)[1],
      parts = path.parse(file),
      taskName = "Demo:" + name,
      min = nt.min(taskName, file);

    return min;
  });

tasks.release.push.apply(tasks.release, demos.map(d=>d.release));
tasks.format.push(preloader.format);
tasks.default.push(preloader.default);
tasks.debug.push(preloader.debug);
tasks.release.push(preloader.release);

const tidyFiles = [
  "PrimroseWithDoc*.js",
  "doc/*/appWithDoc.js",
  "doc/*/appDocumentation.js",
  "doc/PrimroseDocumentation.modules.js"
];
gulp.task("tidy", [nt.clean("Primrose", tidyFiles, tasks.release)]);
gulp.task("tidy:only", [nt.clean("Primrose:only", tidyFiles)]);

gulp.task("copy", ["tidy"], () => gulp.src(["Primrose.min.js"])
  .pipe(gulp.dest("quickstart")));


gulp.task("format", tasks.format);
gulp.task("js", tasks.default);
gulp.task("js:debug", tasks.debug);
gulp.task("js:release", ["copy"]);
gulp.task("html", [html.default]);
gulp.task("html:debug", [html.debug]);
gulp.task("html:release", [html.release]);
gulp.task("css", [css.default]);
gulp.task("css:debug", [css.debug]);
gulp.task("css:release", [css.release]);

gulp.task("default", [ "js", "html", "css" ], () => startServer({ mode: "dev" }));
gulp.task("debug", ["js:debug", "html:debug", "css:debug"]);
gulp.task("release",  ["js:release", "html:release", "css:release"]);

gulp.task("kablamo", build.exec("gulp bump && gulp yolo && cd ../Primrose-Site && gulp kablamo && cd ../Primrose && gulp trololo && npm publish"));
