var gulp = require("gulp"),
  glob = require("glob").sync,
  pkg = require("./package.json"),
  marigold = require("marigold-build").setup(gulp, pkg),

  pugFiles = ["*.pug", "demos/**/*.pug", "doc/**/*.pug", "templates/**/*.pug"],
  html = marigold.html(pugFiles, { jsDir: "src" }),

  stylusFiles = ["*.styl", "demos/**/*.styl", "doc/**/*.styl"],
  css = marigold.css(stylusFiles),

  preloaderFiles = ["preloader/**/*.js"],
  preloader = marigold.js("preloader/index.js", { name: "preloader" }),

  jsOptions = (fmt) => {
    return {
      name: "Primrose",
      advertise: true,
      extractDocumentation: true,
      dependencies: ["format"],
      external: ["three"],
      globals: { three: "THREE" },
      format: fmt
    }
  },

  srcFiles = ["src/**/*.js"],
  jsUMD = marigold.js("src/index.js", jsOptions("umd"));


gulp.task("move", [jsUMD.release], () => gulp.src(["PrimroseDocumentation.js"])
  .pipe(gulp.dest("doc")));

var jsESModules = marigold.js("src/index.js", jsOptions("es")),

  minFiles = glob("demos/*/app.js").concat([
    "preloader.js",
    "doc/PrimroseDocumentation.js",
    "doc/app.js",
    "Primrose.js"
  ]),
  minDeps = [
    preloader.release,
    "move",
    jsESModules.release
  ],
  min = marigold.min(minFiles, minDeps),

  tasks = {
    format: [preloader.format, jsUMD.format],
    default: [preloader.default, jsUMD.default],
    debug: [preloader.debug, jsUMD.debug, jsESModules.debug],
    release: [min.release]
  },

  tidyFiles = [
    "PrimroseWithDoc*.js",
    "doc/*/appWithDoc.js",
    "doc/*/appDocumentation.js",
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

console.log(tasks.release);
var tidy = marigold.clean("Primrose", tidyFiles, tasks.release);
marigold.clean("Primrose:only", tidyFiles);
gulp.task("copy", [tidy], () => gulp.src(["Primrose.min.js"])
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
