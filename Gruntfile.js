/* global module */

var pathX = /.*\/(.*).js/,
  pkg = require("./package.json"),
  fs = require("fs"),
  path = require("path"),
  baseFiles = [
    "obj/Primrose.js",
    "lib/analytics.js",
    "lib/ga.js",
    "lib/mailchimp.js",
    "lib/pliny.js",
    "lib/sha512.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/three/three.js",
    "node_modules/marked/lib/marked.js"
  ],
  copyFiles = baseFiles.map(function (s) {
    return {
      src: s,
      dest: s.replace(pathX, "scripts/$1.js")
    };
  });


copyFiles.push({
  src: "scripts/Primrose.js",
  dest: "archive/Primrose-<%= pkg.version %>.js"
});

copyFiles.push({
  src: "scripts/Primrose.min.js",
  dest: "archive/Primrose-<%= pkg.version %>.min.js"
});

function jadeConfiguration(options, defaultData) {
  var config = {
    options: options,
    files: [{
      expand: true,
      src: ["**/*.jade"],
      dest: "",
      ext: "",
      extDot: "last"
    }]
  };

  defaultData.version = pkg.version;

  config.options.data = function (dest, src) {
    defaultData.filename = dest;
    return defaultData;
  }.bind(config);

  return config;
}

function recurseDirectory(root) {
  var directoryQueue = [root],
    files = [];
  while (directoryQueue.length > 0) {
    var directory = directoryQueue.shift(),
      subFiles = fs.readdirSync(directory);
    for (var j = 0; j < subFiles.length; ++j) {
      var subFile = path.join(directory, subFiles[j]),
        stats = fs.lstatSync(subFile);
      if (stats.isDirectory()) {
        directoryQueue.push(subFile);
      }
      else {
        files.push("/" + subFile.replace(/\\/g, "/"));
      }
    }
  }
  return files;
}

var headerSpec = /\b(\d+)\r\n\s*h1 ([^\r\n]+)/,
  debugData = {
    debug: true,
    frameworkFiles: recurseDirectory("src"),
    docFiles: recurseDirectory("doc")
      .filter(function (f) { return /.jade$/.test(f); })
      .map(function (f, i) {
        var file = fs.readFileSync(f.substring(1), "utf-8").toString(),
          match = file.match(headerSpec),
          index = i;
        if (match[1].length > 0) {
          index = parseInt(match[1]);
        }
        return {
          fileName: f.replace(/\\/g, "/").replace(/\.jade$/, ""),
          index: index,
          title: match[2],
          incomplete: /\[under construction\]/.test(file),
          tutorial: /^Tutorial:/.test(match[2])
        };
      })
  };

if (false) {
  debugData.frameworkFiles = debugData.frameworkFiles.map(function (f) {
    return f.replace(/^\/src\//, "/es5/");
  });
}

debugData.frameworkFiles.unshift("/node_modules/socket.io-client/socket.io.js");
debugData.frameworkFiles.unshift("/node_modules/three/three.js");
debugData.frameworkFiles.unshift("/lib/sha512.js");
debugData.frameworkFiles.unshift("/lib/webgl-debug.js");
debugData.frameworkFiles.unshift("/lib/pliny.js");
debugData.frameworkFiles.unshift("/node_modules/marked/lib/marked.js");
debugData.frameworkFiles.unshift("/lib/logger.js");

debugData.docFiles.sort(function (a, b) {
  return a.index - b.index;
});

var jadeDebugConfiguration = jadeConfiguration({ pretty: true }, debugData),
  jadeReleaseConfiguration = jadeConfiguration({}, { docFiles: debugData.docFiles });

module.exports = function (grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    clean: ["obj", "es5/**/*.js", "scripts", "debug", "release", "doc/**/*.min.css", "examples/**/*.min.css", "stylesheets/**/*.min.css"],

    jade: {
      release: jadeReleaseConfiguration,
      debug: jadeDebugConfiguration
    },

    watch: {
      jade: {
        files: "**/*.*.jade",
        tasks: ["jade:debug"]
      },
      hint: {
        files: "src/**/*.js",
        tasks: ["jshint", "babel"]
      }
    },

    cssmin: {
      default: {
        files: [{
          expand: true,
          src: ["doc/**/*.css", "stylesheets/**/*.css", "examples/**/*.css", "!*.min.css"],
          dest: "",
          ext: ".min.css"
        }]
      }
    },

    jshint: {
      default: "src/**/*.js",
      options: {
        multistr: true,
        esnext: true
      }
    },

    babel: {
      options: {
        sourceMap: false,
        presets: ["es2015"]
      },
      dist: {
        files: [{
          expand: true,
          cwd: "src",
          src: ["**/*.js"],
          dest: "es5"
        }]
      }
    },

    concat: {
      options: {
        banner: "/*\n\
  <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n\
  <%= pkg.license.type %>\n\
  Copyright (C) 2015 <%= pkg.author %>\n\
  <%= pkg.homepage %>\n\
  <%= pkg.repository.url %>\n\
*/\n",
        separator: ";",
        footer: "Primrose.VERSION = \"v<%= pkg.version %>\";\n" +
        "console.log(\"Using Primrose v<%= pkg.version %>. Find out more at <%= pkg.homepage %>\");"
      },
      default: {
        files: {
          "obj/Primrose.js": ["lib/pliny.js", "es5/index.js", "es5/base/**/*.js", "es5/fx/**/*.js", "es5/x/**/*.js"]
        }
      }
    },

    uglify: {
      default: {
        files: baseFiles.map(function (s) {
          return {
            src: s,
            dest: s.replace(pathX, "scripts/$1.min.js")
          };
        })
      }
    },

    copy: {
      default: {
        files: copyFiles
      }
    }
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-jade");

  grunt.registerTask("none", []);
  grunt.registerTask("debug", ["jshint", "babel", "jade:debug", "watch:hint"]);
  grunt.registerTask("build-js", ["jshint", "babel", "concat", "uglify", "copy"]);
  grunt.registerTask("release", ["clean", "jade:release", "cssmin", "build-js"]);
  grunt.registerTask("default", ["debug"]);
};
