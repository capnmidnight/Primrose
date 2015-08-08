/* global module */

var fs = require( "fs" );

module.exports = function ( grunt ) {
  // Project configuration.
  var banner =
      "/*\n\
  <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today(\"yyyy-mm-dd\") %>\n\
  <%= pkg.license.type %>\n\
  Copyright (C) 2015 <%= pkg.author %>\n\
  <%= pkg.homepage %>\n\
  <%= pkg.repository.url %>\n\
*/\n",
      execConfig = { },
      copyConfig = { };

  var execConfig = { },
      copyConfig = { };

  function copyFile ( name, fileName ) {
    if ( fs.existsSync( fileName ) ) {
      copyConfig["copy_" + name] = {
        files: [
          {
            expand: true,
            flatten: true,
            src: [ fileName ],
            dest: 'obj/',
            filter: 'isFile'
          }
        ]
      };
    }
  }

  function depend ( name, rootDir, buildDir, buildCmd, binDir ) {
    if ( !fs.existsSync( rootDir ) ) {
      console.log( name +
          " is not installed. Need to clone the git repository." );
    }
    else {
      console.log( "including " + name );
      execConfig["build_" + name] = "cd " + rootDir + "/" + buildDir + " && " +
          buildCmd;
      copyFile( name, rootDir + "/" + binDir + "/*" );
    }
  }

  depend( "THREE", "../three.js", "utils/build", "build.bat", "build" );
  depend( "cannon.js", "../cannon.js", "", "grunt", "build" );
  copyFile( "THREE/ColladaLoader",
      "../three.js/examples/js/loaders/ColladaLoader.js" );

  grunt.initConfig( {
    pkg: grunt.file.readJSON( "package.json" ),
    exec: execConfig,
    copy: copyConfig,
    jshint: "src/**/*.js",
    concat: {
      options: {
        banner: banner,
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
       files: [
          "Primrose",
          "ga",
          "mailchimp",
          "store",
          "three",
          "ColladaLoader",
          "cannon" ].map( function ( s ) {
          var f = "obj/" + s + ".js",
              exists = fs.existsSync( f );
          if ( !exists ) {
            console.error( "Couldn't find file: " + o.src );
          }
          return{
            src: f,
            dest: "bin/" + s + ".min.js"
          };
        } )
            .filter( function ( o ) {
              return o;
            } )
      }
    }
  } );

  grunt.loadNpmTasks( "grunt-contrib-clean" );
  grunt.loadNpmTasks( "grunt-exec" );
  grunt.loadNpmTasks( "grunt-contrib-copy" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-contrib-concat" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );

  grunt.registerTask( "buildall",
      [ "exec", "copy", "jshint", "concat", "uglify" ] );

  grunt.registerTask( "default",
      [ "copy", "jshint", "concat", "uglify" ] );

};
