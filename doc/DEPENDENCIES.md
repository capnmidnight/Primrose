# DEPENDENCIES

We can't leave comments in JSON files, so here is some rationalization for each of the dependencies.

## Dependencies

These dependencies are included in the package and are installed when the user installs the package.

* `lavu-details-polyfill` - This package is used in the doc pages to be able to support details/summary view for browsers that don't yet have this useful HTML element.

## Dev Dependencies

These dependencies are not included in the package, but are installed if the user has cloned the repository and ran `npm install`.

* `bare-bones-logger` - Use to perform debugging on iOS and to forward logging output to a texture.
* `iphone-inline-video` - Fixes a critical bug on iOS 9
* `jstransformer-marked` - Include Markdown file contents in HTML files via Pug templates.
* `pliny` - Remove the documentation objects from the source files and render documentation objects into documentation pages.
* `promise-polyfill` - Provide Promises for IE.
* `notiontheory-basic-build` - Manage the build process and drastically simplify it.
* `three` - WebGL scene-graph library.
* `webvr-polyfill` - Provide WebVR API on systems that support Device Motion API but don't yet have WebVR API.
*  `webvr-standard-monitor` - Represent the regular monitor through the WebVR API to simplify handling multiple types of displays.