var gulp = require("gulp"),
  glob = require("glob").sync,
  pkg = require("./package.json"),
  marigold = require("marigold-build").setup(gulp, pkg),

  publicDirs = ["", "demos/**/", "doc/**/"],
  inplace = function(ext){
    return publicDirs.map(function(publicDir) {
      return publicDir + "*." + ext;
    });
  },

  pugFiles = inplace("pug"),
  stylusFiles = inplace("styl"),
  htmlFiles = inplace("html"),
  cssFiles = inplace("css"),
  jsFiles = inplace("js"),
  jpgFiles = inplace("jpg"),
  pngFiles = inplace("png"),

  html = marigold.html(pugFiles, {
    watch: ["*.md" ,"doc/**/*.md", "templates/**/*.pug"]
  }),
  css = marigold.css(stylusFiles),
  images = marigold.images(jpgFiles.concat(pngFiles)),

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
      format: fmt
    }
  },

  jsUMD = marigold.js(jsOptions("umd")),
  jsESModules = marigold.js(jsOptions("es")),

  tidyFiles = [
    "Primrose.doc.js",
    "Primrose.modules.doc.js",
    "Primrose.modules.min.js",
    "Primrose.modules.js.map"
  ],

  preloaderFiles = ["preloader/**/*.js"],
  srcFiles = ["src/**/*.js"],
  stopOnFiles = []
    .concat(pugFiles)
    .concat(stylusFiles)
    .concat(preloaderFiles)
    .concat(srcFiles),

  reloadOnFiles = ["!gulpfile.js"]
    .concat(jsFiles)
    .concat(cssFiles)
    .concat(htmlFiles),

  devServer = marigold.devServer(stopOnFiles, reloadOnFiles, {
    debounceDelay: 1500,
    url: "Primrose/demos/empty/"
  }),

  tidy = marigold.clean(tidyFiles, ["copy", "move"]);


gulp.task("move", () =>
  gulp.src(["Primrose.doc.js"])
    .pipe(gulp.dest("doc")));

gulp.task("copy", () =>
  gulp.src(["Primrose.min.js"])
    .pipe(gulp.dest("quickstart")));

delete jsESModules.format;
delete jsESModules.default;

marigold.taskify([
  html,
  css,
  images,
  preloader,
  jsUMD,
  jsESModules
], {
  default: devServer,
  release: function() {
    gulp.start(tidy);
  }
});
