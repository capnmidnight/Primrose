# Installation and Setup
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
If you have [Node.js](http://www.nodejs.org) installed, cloning the Primrose repository
from GitHub gives you direct access to the source code to automatically install
all dependencies and generate the necessary distribution package to use Primrose.
From your command line or terminal, start by changing directory to your favorite
projects folder and then running the commands:

<kbd>git clone https://github.com/capnmidnight/Primrose.git<br>
cd Primrose<br>
npm install<br>
grunt</kbd>

From there, you may copy the `Primrose.min.js` file out of the `bin/` directory
into your private project directory, or run the command <kbd>npm start</kbd> to
run a copy of this website and try Primrose out right away.

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

Link to the file by including a `&lt;script&gt;` tag in your page HTML:

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Primrose VR Application</title>
        <script type="text/javascript" src="http://www.threejs.org/build/three.min.js"></script>
         
        <!-- START: INCLUDE PRIMROSE LIBRARY -->
        <script type="text/javascript" src="http://www.primrosevr.com/bin/Primrose.min.js"></script>
        <!-- END: INCLUDE PRIMROSE LIBRARY -->
         
        <link type="text/css" rel="stylesheet" href="style.css">
      </head>
      <body>
        <canvas id="frontBuffer" tabindex="1"></canvas>
        <script type="text/javascript" src="app.js"></script>
      </body>
    </html>

### Linking to a Static Version of Primrose
Each versioned release of Primrose gets copied to the Archive directory on the
Primrose website. You can find any past version of Primrose here:
* <http://www.primrosevr.com/archive/> - for both expanded and minified versions.

For example, to link to the minified version of v0.20.2 of the Primrose package, 
you would use the link:
* <http://www.primrosevr.com/archive/Primrose-0.20.2.min.js>

If you have locally saved a copy of `Primrose.js` or `Primrose.min.js` without
a version number in its name, you can find the version number in the JavaScript
Developer Console of your favorite browser with the library loaded. It will appear
as:

<kbd>Using Primrose v0.20.2. Find out more at http://www.primrosevr.com</kbd>

You can then copy that version number into a filename of the Archive directory
to retrieve any historical version you may need.

> NOTE: because of bandwidth limitations with the Primrose website hosting
> provider, it is advised that you copy the necessary files to your own
> project directory and host them with your own provider.

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