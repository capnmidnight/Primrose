module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: ["src/**/*.js"]
        },
        clean: ["build"],
        uglify: {
            build: {
                files: [{
                        expand: true,
                        cwd: "src",
                        src: "**/*.js",
                        dest: "build"
                    }]
            }
        },
        concat: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n"
                        + "Copyright (C) 2015 <%= pkg.author %>\n"
                        + "<%= pkg.homepage %>*/\n",
                separator: ";"
            },
            build: {
                src: "build/**/*.js",
                dest: "dist/Primrose.min.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");

    grunt.registerTask("default", ["jshint", "clean", "uglify", "concat"]);

};