/* global module */

var pkg = require("./package.json"),
  fs = require("fs"),
  path = require("path"),
  headerFiles = [
    "node_modules/marked/lib/marked.js",
    "lib/pliny.js",
    "lib/sha512.js",
    "node_modules/socket.io-client/socket.io.js",
    "node_modules/three/three.js",
    "node_modules/three/examples/js/loaders/OBJLoader.js",
    "node_modules/three/examples/js/loaders/MTLLoader.js"
  ],
  baseFiles = headerFiles.slice();

baseFiles.splice(baseFiles.length, 0,
  "obj/Primrose.js",
  "lib/analytics.js",
  "lib/ga.js",
  "lib/mailchimp.js");

var pathX = /.*\/(.*).js/,
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

var jadeFileSpec = ["*.jade", "doc/**/*.jade", "examples/**/*.jade"];

function jadeConfiguration(options, defaultData) {
  var config = {
    options: options,
    files: [{
      expand: true,
      src: jadeFileSpec,
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
  debugDataES6 = {
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

debugDataES6.frameworkFiles.splice(0, 0,
  "/lib/logger.js",
  "/lib/webgl-debug.js");

debugDataES6.frameworkFiles.splice
  .bind(debugDataES6.frameworkFiles, 0, 0)
  .apply(debugDataES6.frameworkFiles, headerFiles
    .map(function (f) {
      return "/" + f;
    }));

debugDataES6.docFiles.sort(function (a, b) {
  return a.index - b.index;
});

var debugDataES5 = JSON.parse(JSON.stringify(debugDataES6));
debugDataES5.frameworkFiles = debugDataES5.frameworkFiles.map(function (f) {
  return f.replace(/^\/src\//, "/es5/");
});

var jadeDebugConfigurationES5 = jadeConfiguration({ pretty: true }, debugDataES5),
  jadeDebugConfigurationES6 = jadeConfiguration({ pretty: true }, debugDataES6),
  jadeReleaseConfiguration = jadeConfiguration({}, { docFiles: debugDataES6.docFiles });

module.exports = function (grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    clean: ["obj", "es5", "scripts", "debug", "release", "doc/**/*.min.css", "examples/**/*.min.css", "stylesheets/**/*.min.css"],

    jade: {
      release: jadeReleaseConfiguration,
      "debug-es5": jadeDebugConfigurationES5,
      "debug-es6": jadeDebugConfigurationES6
    },

    watch: {
      jade: {
        files: jadeFileSpec,
        tasks: ["jade:debug"]
      },
      "hint-es5": {
        files: "src/**/*.js",
        tasks: ["jshint", "babel"]
      },
      "hint-es6": {
        files: "src/**/*.js",
        tasks: ["jshint"]
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
  Copyright (C) 2015 - 2016 <%= pkg.author %>\n\
  <%= pkg.homepage %>\n\
  <%= pkg.repository.url %>\n\
*/\n",
        separator: ";",
        footer: "Primrose.VERSION = \"v<%= pkg.version %>\";\n" +
        "console.log(\"Using Primrose v<%= pkg.version %>. Find out more at <%= pkg.homepage %>\");"
      },
      default: {
        files: {
          "obj/Primrose.js": ["es5/index.js", "es5/base/**/*.js", "es5/fx/**/*.js", "es5/x/**/*.js"]
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
  grunt.registerTask("debug-es6", ["jshint", "jade:debug-es6", "watch:hint-es6"]);
  grunt.registerTask("debug-es5", ["jshint", "babel", "jade:debug-es5", "watch:hint-es5"]);
  grunt.registerTask("release", ["clean", "jade:release", "cssmin", "jshint", "babel", "concat", "uglify", "copy"]);
  grunt.registerTask("default", ["debug"]);
};
