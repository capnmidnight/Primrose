var gulp = require("gulp"),
  glob = require("glob").sync,
  pkg = require("./package.json"),
  marigold = require("marigold-build").setup(gulp, pkg),

  pugFiles = ["*.pug", "demos/**/*.pug", "doc/**/*.pug"],
  html = marigold.html(pugFiles, { watch: ["*.md" ,"doc/**/*.md", "templates/**/*.pug"] }),

  stylusFiles = ["*.styl", "demos/**/*.styl", "doc/**/*.styl"],
  css = marigold.css(stylusFiles),

  preloaderFiles = ["preloader/**/*.js"],
  preloader = marigold.js({
    entry: "preloader/index.js",
    disableGenerators: true
  }),

  jsOptions = (fmt) => {
    return {
      name: "Primrose",
      advertise: true,
      extractDocumentation: true,
      dependencies: ["format"],
      globals: { three: "THREE" },
      format: fmt
    }
  },

  srcFiles = ["src/**/*.js"],
  jsUMD = marigold.js(jsOptions("umd"));


gulp.task("move", [jsUMD.release], () => gulp.src(["PrimroseDocumentation.js"])
  .pipe(gulp.dest("doc")));

var jsESModules = marigold.js(jsOptions("es")),

  minFiles = glob("demos/*/app.js").concat([
    "preloader.js",
    "doc/PrimroseDocumentation.js",
    "doc/app.js",
    "Primrose.js"
  ]),
  minDeps = [
    preloader,
    "move",
    jsESModules
  ],
  min = marigold.min(minFiles, minDeps),

  tasks = {
    format: [preloader.format, jsUMD.format],
    default: [preloader.default, jsUMD.default],
    debug: [preloader.debug, jsUMD.debug, jsESModules.debug],
    release: [min.release]
  },

  tidyFiles = [
    "doc/*/appWithDoc.js",
    "doc/*/appDocumentation.js",
    "PrimroseDocumentation*.js",
    "templates/*.html",
    "Primrose*.modules.js.map",
    "PrimroseWithDoc.modules.js"
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

  devServer = marigold.devServer(stopOnFiles, reloadOnFiles, {
    debounceDelay: 1500,
    url: "Primrose/demos/empty/"
  });

var tidy = marigold.clean(tidyFiles, tasks.release);
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
