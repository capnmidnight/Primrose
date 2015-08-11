/* global module */

var fs = require( "fs" ),
    uglifyFiles = [
      "src/store",
      "obj/Primrose",
      "lib/analytics",
      "lib/ga",
      "lib/mailchimp" ].map( function ( s ) {
  return{
    src: s + ".js",
    dest: s.replace( /^(src|obj|lib)/, "bin" ) + ".min.js"
  };
} ),
    copyFiles = uglifyFiles.map( function ( o ) {
      return { src: o.src, dest: o.src.replace( /^(src|obj|lib)/, "bin" ) };
    } );

module.exports = function ( grunt ) {
  grunt.initConfig( {
    pkg: grunt.file.readJSON( "package.json" ),
    jshint: { default: "src/**/*.js" },
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
        footer: "Primrose.VERSION = \"v<%= pkg.version %>\";"
      },
      default: {
        files: {
          "obj/Primrose.js": [ "src/core.js", "src/fx/**/*.js" ]
        }
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
  } );

  grunt.loadNpmTasks( "grunt-contrib-clean" );
  grunt.loadNpmTasks( "grunt-exec" );
  grunt.loadNpmTasks( "grunt-contrib-copy" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-contrib-concat" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );

  grunt.registerTask( "default", [ "jshint", "concat", "uglify", "copy" ] );

};
