# Setup and Installation
There are several ways to acquire, install, and use Primrose, depending on your needs.
In general, there are two versions of the Primrose package, one that has been "minified",
and one that has not. Minification is a process of removing comments and unnecessary
whitespace characters, as well as renaming some internal, inaccessible variables 
and functions to be short, one- or two-character long names.

Versions that have been minified have the file extension `.min.js`, whereas versions
that are not minified just have the `.js` file extension. Wherever you see a reference
to `Primrose.js`, it may be replaced with `Primrose.min.js`. The choice between the
two is easy:
* While you are developing your application, use the version that is not minified.
  If any errors or warnings occur while you are developing your application, it
  will be easier to debug the cause with the full, expanded version.
* Before you deploy your application to your website, switch to using the minified
  version. Minification can save significant amounts of bandwidth usage for your
  users. WebGL applications tend to be large, so any amount of savings will get
  your users into your application faster and use less of their energy and data
  resources.

## Automatic Installation
By forking the Primrose repository on GitHub, you have direct access to the source
code and can generate new packages whenever you want. If you have [Node.js](https://nodejs.org/)
installed, then you can use NPM to install all of the necessary dependencies by
running the command <kbd>npm install</kbd> from your command line.

<under construction>

## Manual Installation
Manual installation is a bit more difficult than automatic installation, but does
not require you to keep a copy of the entire Primrose repository or build new packages.
Manual installation will require you to install the dependencies on your own. See
the final section "Dependencies" in this document.

### Direct Link to Latest Version of Primrose
If you opt for manually installing Primrose, you will also have to manually install
its dependencies. This will require visiting each of the links in the "Dependencies"
section above and download their associated files manually.

The latest version of Primrose will always reside at:
* <http://www.primrosevr.com/bin/Primrose.js> - expanded version.
* <http://www.primrosevr.com/bin/Primrose.min.js> - minified version.

> NOTE: this file is volatile. Whenever new versions are released, this file will
> get updated automatically. Major-version releases may result in breaking,
> backwards-incompatible changes. If you're excited to use only the latest-and-greatest
> code and are regularly testing and keeping up with changes, use this "Latest"
> version of the file. If, on the other hand, you need more stability, read further
> on this page to see how you can use a static version of the package.

### Linking to a Static Version of Primrose
<under construction>

## Dependencies
There are also a number of libraries on which Primrose depends.

If you are only using Primrose as a client-side library, then there is only one
external dependency that Primrose does not include automatically.
* [Three.js](http://www.threejs.org) - an abstraction layer and scene graph 
  implementation for WebGL. `three.js` is usually located at:
** <http://www.threejs.org/build/three.js> - expanded version.
** <http://www.threejs.org/build/three.min.js> - minified version.

There are a few optional dependencies:
* [WebGL-Debug.js](https://raw.githubusercontent.com/KhronosGroup/WebGLDeveloperTools/master/src/debug/webgl-debug.js) -
  a wrapper for WebGL contexts that can help debug WebGL-specific issues.
* [Endocumate](http://www.primrosevr.com/bin/endocumate.min.js) - a microlibrary
  Markdown files into HTML. Required if Pliny is expected to generate HTML output.
* [Pliny](http://www.primrosevr.com/bin/pliny.min.js) - Pliny provides the documentation
  for all of the namespaces, classes, functions, etc., in an online database that
  is accessible during Primrose live-coding sessions.

Additionally, if you will be using Primrose with the provided multiplayer server,
you will need:
* [Socket.IO](http://socket.io/) - an abstraction layer for WebSockets. It provides
  a polyfill for communicating with WebSocket servers using Socket.IO over AJAX
  requests or long-polled HTTP POST requests, as well as features for reconnecting
  dropped connections in case of intermittent network outage.
* [node-mime](https://github.com/broofa/node-mime) - a comprehensive MIME type
  mapping API based on mime-db module.

Each of these dependencies has their own installation and setup instructions. However,
when cloning Primrose from GitHub and using the build tools, NPM (Node Package Manager)
can automatically manage these for you.