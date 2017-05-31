# DEPENDENCIES

We can't leave comments in JSON files, so here is some rationalization for each of the dependencies.

## Dependencies

These dependencies are included in the package and are installed when the user installs the package.

* `lavu-details-polyfill` - This package is used in the doc pages to be able to support details/summary view for browsers that don't yet have this useful HTML element.
* `iphone-inline-video` - Fixes a critical bug on iOS 9
* `jstransformer-marked` - Include Markdown file contents in HTML files via Pug templates.
* `pliny` - Remove the documentation objects from the source files and render documentation objects into documentation pages.
* `three` - WebGL scene-graph library.

## Dev Dependencies

These dependencies are not included in the package, but are installed if the user has cloned the repository and ran `npm install`.

* `gulp` - Task runner.
* `marigold-build` - Manage the build process and drastically simplify it.
