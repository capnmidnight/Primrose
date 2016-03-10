/* global module */

var pathX = /.*\/(.*).js/,
    files = [
      "obj/Primrose.js",
      "lib/analytics.js",
      "lib/ga.js",
      "lib/mailchimp.js",
      "lib/pliny.js",
      "lib/loader.js",
      "lib/resizer.js",
      "node_modules/cannon/build/cannon.js",
      "node_modules/leapjs/leap-0.6.4.js",
      "node_modules/socket.io-client/socket.io.js",
      "node_modules/three/three.js",
      "node_modules/marked/lib/marked.js"
    ],
    buildFiles = {
      "obj/Primrose.js": ["lib/pliny.js", "src/index.js", "src/fx/**/*.js"]
    },
    uglifyFiles = files.map(function (s) {
      return {
        src: s,
        dest: s.replace(pathX, "scripts/$1.min.js")
      };
    }),
    copyFiles = files.map(function (s) {
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

var jadeConfiguration = {
  options: {
    data: {
      debug: false,
      version: "<%= pkg.version %>"
    }
  },
  files: [
    {
      expand: true,
      src: ["**/*.jade"],
      dest: "",
      ext: "",
      extDot: "last"
    }
  ]
},
    jadeDebugConfiguration = JSON.parse(JSON.stringify(jadeConfiguration));
jadeDebugConfiguration.options.pretty = true;
jadeDebugConfiguration.options.data.debug = true;

module.exports = function (grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    clean: ["obj", "scripts", "debug", "release"],

    jade: {
      release: jadeConfiguration,
      debug: jadeDebugConfiguration
    },

    jshint: {
      default: "src/**/*.js",
      options: {
        multistr: true
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
        files: buildFiles
      }
    },

    uglify: {
      default: {
        files: uglifyFiles
      }
    },

    copy: {
      default: {
        files: copyFiles
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jade");

  grunt.registerTask("debug", ["jade:debug"]);
  grunt.registerTask("release", ["clean", "jade:release", "jshint", "concat", "uglify", "copy"]);
  grunt.registerTask("default", ["debug"]);
};
