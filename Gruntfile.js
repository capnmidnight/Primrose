var pkgConfig = require("./package.json");
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: ["src/**/*.js"]
        },
        concat: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n"
                        + "Copyright (C) 2015 <%= pkg.author %>\n"
                        + "<%= pkg.homepage %>*/\n",
                separator: ";",
                footer: "Primrose.VERSION = \"v" + pkgConfig.version + "\";"
            },
            build: {
                files:{
                    "dist/Primrose.js": ["src/**/*.js"]
                }
            }
        },
        uglify: {
            build: {
                files: [{
                        src: "dist/Primrose.js",
                        dest: "dist/Primrose.min.js"
                    }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["jshint", "concat", "uglify"]);

};