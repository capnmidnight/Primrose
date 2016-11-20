var gulp = require("gulp"),
  exec = require("child_process").exec,
  fs = require("fs"),
  pliny = require("../pliny/src/pliny"),
  pkg = require("./package.json"),
  build = require("../notiontheory-basic-build"),
  nt = build.setup(gulp, pkg),

  formats = ["umd", "es"],

  tasks = formats.map((format) => {

    ext = "";
    if(format === "es") {
      ext += ".modules";
    }
    else if(format !== "umd"){
      ext += "." + format;
    }
    ext += ".js";

    var tasks = nt.js("PrimroseWithDoc:" + format, "src", {
      advertise: true,
      moduleName: "Primrose",
      fileName: "PrimroseWithDoc" + ext,
      dependencies: ["format"],
      format: format,
      post: (inFile, cb) => {
        // removes the documentation objects from the concatenated library.
        var outFile = inFile.replace("WithDoc", ""),
          docFile = "doc/" + inFile.replace("WithDoc", "Documentation");
        pliny.carve(inFile, outFile, docFile, cb);
      }
    });

    if(format === "umd") {
      var format = tasks.format;
      tasks = nt.min("Primrose", [
        "doc/PrimroseDocumentation" + ext,
        "Primrose" + ext], [{
        debug: tasks.debug,
        release: tasks.debug
      }]);
      tasks.format = format;
    }

    return tasks;
  }).reduce((collect, task) => {
    collect.format = [task.format];
    collect.default.push(task.default);
    collect.debug.push(task.debug);
    collect.release.push(task.release);
    return collect;
  }, { format: [], default: [], debug: [], release: [] }),

  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "templates/**/*.pug"], "src"),
  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]);

gulp.task("clean", [nt.clean("Primrose:full:", [
  "Primrose*.js",
  "doc/Primrose*.js"
])]);

gulp.task("tidy", [nt.clean("Primrose", [
  "PrimroseWithDoc*.js",
  "doc/PrimroseDocumentation.js",
  "doc/PrimroseDocumentation.modules.js"
], tasks.release)]);

gulp.task("copy", ["tidy"], () => gulp.src(["Primrose.min.js"])
  .pipe(gulp.dest("quickstart")));

gulp.task("format", tasks.format);
gulp.task("js", tasks.default.slice(0, 1));
gulp.task("js:debug", tasks.debug);
gulp.task("js:release", tasks.release);
gulp.task("html", [html.debug]);
gulp.task("css", [css.debug]);

gulp.task("default", [
  "js",
  html.default,
  css.default
]);

gulp.task("debug", [
  "js:debug",
  html.debug,
  css.debug
]);

gulp.task("test", tasks.release.concat([
  html.test,
  css.release
]));

gulp.task("release",  [
  "js:release",
  html.release,
  css.release
]);

gulp.task("kablamo", build.exec("gulp bump && gulp yolo && cd ../Primrose-Site && gulp kablamo && cd ../Primrose && gulp trololo && npm publish"));