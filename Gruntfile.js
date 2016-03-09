/* global module */

var fs = require( "fs" ),
    pathX = /.*\/(.*).js/,
    files = [
      "obj/Primrose.js",
      "public/lib/analytics.js",
      "public/lib/ga.js",
      "public/lib/mailchimp.js",
      "public/lib/pliny.js",
      "public/lib/loader.js",
      "public/lib/resizer.js",
      "node_modules/leapjs/leap-0.6.4.js",
      "node_modules/socket.io-client/socket.io.js",
      "node_modules/three/three.js",
      "node_modules/marked/lib/marked.js"
    ],
    buildFiles = {
      "obj/Primrose.js": [ "public/lib/pliny.js", "public/src/index.js", "public/src/fx/**/*.js" ]
    },
uglifyFiles = files.map( function ( s ) {
  return{
    src: s,
    dest: s.replace( pathX, "public/scripts/$1.min.js" )
  };
} ),
    copyFiles = files.map( function ( s ) {
      return {
        src: s,
        dest: s.replace( pathX, "public/scripts/$1.js" )
      };
    } );

copyFiles.push( {
  src: "public/scripts/Primrose.js",
  dest: "public/archive/Primrose-<%= pkg.version %>.js"
} );

copyFiles.push( {
  src: "public/scripts/Primrose.min.js",
  dest: "public/archive/Primrose-<%= pkg.version %>.min.js"
} );


module.exports = function ( grunt ) {
  grunt.initConfig( {
    pkg: grunt.file.readJSON( "package.json" ),
    jshint: {
      default: "public/src/**/*.js",
      options: {
        multistr: true
      }
    },
    clean: [ "obj", "bin" ],
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
  } );

  grunt.loadNpmTasks( "grunt-contrib-clean" );
  grunt.loadNpmTasks( "grunt-exec" );
  grunt.loadNpmTasks( "grunt-contrib-copy" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-contrib-concat" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );

  grunt.registerTask( "default", [ "jshint", "clean", "concat", "uglify", "copy" ] );
};
