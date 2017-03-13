var gulp = require("gulp"),
  glob = require("glob").sync,
  pkg = require("./package.json"),
  marigold = require("marigold-build").setup(gulp, pkg),

  pugFiles = ["*.pug", "demos/**/*.pug", "doc/**/*.pug", "templates/**/*.pug"],
  html = marigold.html(pugFiles, { jsDir: "src" }),

  stylusFiles = ["*.styl", "demos/**/*.styl", "doc/**/*.styl"],
  css = marigold.css(stylusFiles),

  preloaderFiles = ["preloader/**/*.js"],
  preloaderJS = marigold.js("preloader/index.js", { name: "preloader" }),

  srcFiles = ["src/**/*.js"],
  umdJSTask = marigold.js("src/index.js", {
    name: "Primrose",
    advertise: true,
    extractDocumentation: true,
    dependencies: ["format"],
    external: ["three"],
    globals: {three: "THREE"},
    format: "umd"
  }),

  modulesJSTask = marigold.js("src/index.js", {
    advertise: true,
    extractDocumentation: true,
    name: "Primrose",
    moduleName: "Primrose",
    dependencies: ["format"],
    external: ["three"],
    format: "es"
  }),

  minFiles = glob("demos/*/app.js").concat([
    "preloader.js",
    "doc/app.js",
    "doc/PrimroseDocumentation.js",
    "Primrose.js"
  ]),

  min = marigold.min(minFiles, [{
    debug: umdJSTask.debug,
    release: umdJSTask.debug
  }, {
    debug: preloaderJS.debug,
    release: preloaderJS.debug
  }, {
    debug: "moveDoc",
    release: "moveDoc"
  }]),

  tasks = {
    format: [preloaderJS.format, umdJSTask.format],
    default: [preloaderJS.default, umdJSTask.default],
    debug: [preloaderJS.debug, umdJSTask.debug, modulesJSTask.debug],
    release: [min.release, modulesJSTask.release]
  },

  tidyFiles = [
    "primroseWithDoc*.js",
    "PrimroseWithDoc*.js",
    "doc/*/appWithDoc.js",
    "doc/*/appDocumentation.js",
    "primroseDocumentation*.js",
    "PrimroseDocumentation*.js",
    "templates/*.html"
  ],

  stopOnFiles = []
    .concat(pugFiles)
    .concat(stylusFiles)
    .concat(preloaderFiles)
    .concat(srcFiles),

  reloadOnFiles = [
    "*.js",
    "!gulpfile.js",
    "*.css",
    "*.html",
    "demos/**/*.js",
    "demos/**/*.css",
    "demos/**/*.html",
    "doc/**/*.js",
    "doc/**/*.css",
    "doc/**/*.html"
  ],

  devServer = marigold.devServer(stopOnFiles, reloadOnFiles);


gulp.task("tidy", [marigold.clean("Primrose", tidyFiles, tasks.release)]);
gulp.task("tidy:only", [marigold.clean("Primrose:only", tidyFiles)]);
gulp.task("moveDoc", [umdJSTask.debug], () => gulp.src(["PrimroseDocumentation.js"])
  .pipe(gulp.dest("doc")));
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

gulp.task("kablamo", marigold.exec("gulp bump\
 && gulp yolo\
 && cd ../Primrose-Site\
 && gulp yolo\
 && cd ../Primrose\
 && git push\
 && npm publish"));
