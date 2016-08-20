var gulp = require("gulp"),
  build = require("notiontheory-basic-build"),
  nt = build.setup(gulp),
  js = nt.js("PrimroseLib", ["src/**/*.js"]),
  html = nt.html("primrose-pug", ["**/*.pug"]),
  css = nt.css("primrose-stylus", ["**/*.styl"]);

gulp.task("default", [js.dev, css.dev, html.dev]);
gulp.task("debug", [js.debug, css.debug, html.debug]);
gulp.task("release", [js.release, css.release, html.release]);