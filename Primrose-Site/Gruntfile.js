module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: ["public/javascripts/**/*.js"]
        },
        clean: ["build"],
        uglify: {
            build: {
                files: [{
                        expand: true,
                        cwd: "src",
                        src: "public/javascripts/**/*.js",
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
                files:{
                    "public/javascripts/Primrose-Site.min.js": ["build/**/*.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-stylus");
    grunt.loadNpmTasks("grunt-contrib-jade");

    grunt.registerTask("default", [
        "jshint", 
        "clean", 
        "uglify", 
        "concat"
    ]);

};