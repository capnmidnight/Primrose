var gulp = require("gulp"),
  exec = require("child_process").exec,
  glob = require("glob").sync,
  fs = require("fs"),
  path = require("path"),
  pliny = require("../pliny/src/pliny"),
  pkg = require("./package.json"),
  build = require("../notiontheory-basic-build"),
  nt = build.setup(gulp, pkg),

  html = nt.html("Primrose", ["*.pug", "doc/**/*.pug", "templates/**/*.pug"], "src"),

  css = nt.css("Primrose", ["*.styl", "doc/**/*.styl"]),

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

    var js = nt.js("PrimroseWithDoc:" + format, "src", {
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

    var min;
    if(format === "umd") {
      min = nt.min("Primrose", [
        "doc/PrimroseDocumentation" + ext,
        "Primrose" + ext], [{
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
    collect.release.push(task.js.release);
    return collect;
  }, { format: null, default: null, debug: [], release: [] }),

  demos = glob("doc/**/src/index.js").map(function(file) {
    var name = file.match(/doc\/(\w+)\/src\/index\.js/)[1],
      parts = path.parse(file),
      taskName = "Demo:" + name,
      inFile = path.join(parts.dir, "../appWithDoc.js"),
      outFile = inFile.replace("WithDoc", ""),
      docFile = inFile.replace("WithDoc", "Documentation"),
      js = nt.js(taskName, parts.dir, {
        moduleName: name,
        fileName: inFile,
        format: "umd",
        watch: ["src/**/*.js"],
        post: (_, cb) => pliny.carve(inFile, outFile, docFile, cb)
      }),
      min = nt.min(taskName, outFile, [{
        debug: js.debug,
        release: js.release
      }]);



    const demoTasks = tasks.default.slice();
    demoTasks.push(js.default, min.default);

    const demoTaskName = "Demo:" + name;
    gulp.task(demoTaskName, demoTasks);

    return {
      name: name,
      format: js.format,
      default: demoTaskName,
      debug: min.debug,
      release: min.release
    };
  });

gulp.task("clean", [nt.clean("Primrose:full", [
  "Primrose*.js",
  "doc/Primrose*.js"
])]);

gulp.task("tidy", [nt.clean("Primrose", [
  "PrimroseWithDoc*.js",
  "doc/*/appWithDoc.js",
  "doc/*/appDocumentation.js",
  "doc/PrimroseDocumentation.modules.js"
])]);

gulp.task("copy", ["tidy"], () => gulp.src(["Primrose.min.js"])
  .pipe(gulp.dest("quickstart")));

tasks.format.push.apply(tasks.format, demos.map(d=>d.format));
tasks.debug.push.apply(tasks.debug, demos.map(d=>d.debug));
//tasks.release.push.apply(tasks.release, demos.map(d=>d.release));

gulp.task("format", tasks.format);
gulp.task("js", tasks.default);

const demoTasks = tasks.default.slice();
demoTasks.push.apply(demoTasks, demos.map(d=>d.default));

gulp.task("demos", demoTasks);
gulp.task("js:debug", tasks.debug);
gulp.task("js:release", tasks.release);
gulp.task("html", [html.default]);
gulp.task("css", [css.default]);

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