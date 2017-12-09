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
  justDemoPugFiles = ["demos/**/*.pug"],
  stylusFiles = inplace("styl"),
  justDemoStylusFiles = ["demos/**/*.styl"],
  justDemoJSFiles = ["demos/**/*.js", "!demos/**/*.min.js", "!demos/pacman/pacman.js"],
  htmlFiles = inplace("html"),
  cssFiles = inplace("css"),
  jsFiles = inplace("js"),
  jpgFiles = inplace("jpg"),
  pngFiles = inplace("png"),

  html = marigold.html(pugFiles, {
    watch: ["*.md" ,"doc/**/*.md", "templates/**/*.pug"]
  }),
  justDemoHTML = marigold.html(justDemoPugFiles, {
    name: "primrose:just-demos"
  }),
  css = marigold.css(stylusFiles),
  justDemoCSS = marigold.css(justDemoStylusFiles, {
    name: "primrose:just-demos"
  }),
  images = marigold.images(jpgFiles.concat(pngFiles)),
  minifyDemos = marigold.minify(justDemoJSFiles),

  preloader = marigold.js({
    entry: "preloader/index.js",
    disableGenerators: true,
    sourceMap: false
  }),

  jsOptions = (fmt) => {
    return {
      name: "Primrose",
      advertise: true,
      sourceMap: (debug) => debug && fmt === "umd",
      extractDocumentation: (debug) => !debug,
      format: fmt
    };
  },

  jsUMD = marigold.js(jsOptions("umd")),
  jsESModules = marigold.js(jsOptions("es")),

  tidyFiles = [
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
    url: "fx/demos/physics2/"
  }),

  copyQuickstart = marigold.move(["Primrose.min.js"], "quickstart"),

  tidy = marigold.clean(tidyFiles, [copyQuickstart]);

// simplify some of the tasks to improve performance.
delete jsESModules.default;
html.default = justDemoHTML.default;
css.default = justDemoCSS.default;

gulp.task("serve", devServer);

marigold.taskify([
  html,
  css,
  images,
  preloader,
  jsUMD,
  jsESModules
], {
  default: devServer,
  release() {
    gulp.start(tidy.release);
  }
});
