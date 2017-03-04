var gulp = require("gulp"),
  glob = require("glob").sync,
  pkg = require("./package.json"),
  nt = require("notiontheory-basic-build"),

  builder = nt.setup(gulp, pkg),

  html = builder.html("Primrose", ["*.pug", "demos/**/*.pug", "doc/**/*.pug", "templates/**/*.pug"], "src"),

  css = builder.css("Primrose", ["*.styl", "demos/**/*.styl", "doc/**/*.styl"]),

  preloaderJS = builder.js("preloader", "preloader/index.js"),

  preloaderMin = builder.min(
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

  clients = [],

  devServer = () => nt.startServer({ 
    mode: "dev",
    port: 8080,
    webSocketServer: (client) => {
      clients.push(client);
      console.log("new client connection. Total clients:", clients.length);
      client.on("disconnect", () => {
        const index = clients.indexOf(client);
        console.log("disconnecting client", index);
        clients.splice(index, 1);
      });
    }
  }),

  reload = (_, cb) => {
    console.log("reloading " + clients.length + " clients");
    clients.forEach((client) => 
      client.emit("reload"));
    cb();
  },

  umdJSTask = builder.js("Primrose", "src/index.js", {
    advertise: true,
    extractDocumentation: true,
    dependencies: ["format"],
    external: ["three"],
    globals: {three: "THREE"},
    format: "umd",
    post: reload
  }),

  umdMinTask = builder.min("Primrose", [
    "doc/PrimroseDocumentation.js",
    "Primrose.js"], [{
    debug: umdJSTask.debug,
    release: umdJSTask.debug
  }]),

  modulesJSTask = builder.js("Primrose", "src/index.js", {
    advertise: true,
    extractDocumentation: true,
    moduleName: "Primrose",
    dependencies: ["format"],
    external: ["three"],
    format: "es"
  }),

  demos = glob("demos/*/app.js").map(function(file) {

    var name = file.match(/demos\/(\w+)\/app\.js/)[1],
      taskName = "Demo:" + name,
      min = builder.min(taskName, file);

    return min.release;
  }),

  minDocApp = builder.min("DocApp", "doc/app.js"),

  tasks = {
    format: [preloader.format, umdJSTask.format],
    default: [preloader.default, umdJSTask.default],
    debug: [preloader.debug, umdJSTask.debug, modulesJSTask.debug],
    release: [preloader.release, umdMinTask.release, modulesJSTask.release, minDocApp.release]
      .concat(demos)
  },

  tidyFiles = [
    "PrimroseWithDoc*.js",
    "doc/*/appWithDoc.js",
    "doc/*/appDocumentation.js",
    "PrimroseDocumentation.modules.js",
    "templates/*.html"
  ];


gulp.task("tidy", [builder.clean("Primrose", tidyFiles, tasks.release)]);
gulp.task("tidy:only", [builder.clean("Primrose:only", tidyFiles)]);
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

gulp.task("default", [ "js", "html", "css" ], devServer);
gulp.task("test", [ "release" ], devServer);

gulp.task("debug", ["js:debug", "html:debug", "css:debug"]);
gulp.task("release",  ["js:release", "html:release", "css:release"]);

gulp.task("kablamo", nt.exec("gulp bump\
 && gulp yolo\
 && cd ../Primrose-Site\
 && gulp yolo\
 && cd ../Primrose\
 && git push\
 && npm publish"));
