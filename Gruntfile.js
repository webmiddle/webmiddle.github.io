/*
 * Generated on 2014-06-08
 * generator-assemble v0.4.11
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

var Prism = require('prismjs');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-json');
require('prismjs/components/prism-bash');

module.exports = function(grunt) {
  grunt.option('stack', true);

  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'src',
      dist: 'dist'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/**'],
        tasks: ['assemble']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: ['<%= config.dist %>/assets/**', '<%= config.dist %>/**/*.{html,xml}'],

    copy: {
      // Copy assets directory from src to dist folder
      assets: {
          expand: true, 
          cwd: '<%= config.src %>',
          src: ['assets/**'], 
          dest: '<%= config.dist %>',
      }
    },

    assemble: {
      options: {
        flatten: true,
        assets: '<%= config.dist %>/assets',
        layoutdir: '<%= config.src %>/templates/layouts',
        layout: 'default.hbs',
        data: '<%= config.src %>/data/*.{json,yml}',
        partials: '<%= config.src %>/templates/partials/*.hbs',
        helpers: '<%= config.src %>/helpers/*.js',
        marked: {
          highlight: function(code, lang) {
            return Prism.highlight(code, Prism.languages[lang]);
          },
        }
      },
      pages: {
        files: {
          '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
        }
      },
      documentation: {
        options: {
          layout: 'docs.hbs'
        },
        files: {
          '<%= config.dist %>/docs/': ['<%= config.src %>/templates/pages/docs/*.hbs'],
          '<%= config.dist %>/docs/advanced/': ['<%= config.src %>/templates/pages/docs/advanced/*.hbs'],
          '<%= config.dist %>/docs/example/': ['<%= config.src %>/templates/pages/docs/example/*.hbs'],
          '<%= config.dist %>/docs/example/site_webmiddles/': ['<%= config.src %>/templates/pages/docs/example/site_webmiddles/*.hbs'],
          '<%= config.dist %>/docs/example/project_webmiddle/': ['<%= config.src %>/templates/pages/docs/example/project_webmiddle/*.hbs'],
        }
      }
    },

    // to deploy the dist site to the gh-pages branch
    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:webmiddle/webmiddle.github.io.git',
          branch: 'master'
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-build-control');

  grunt.registerTask('server', [
    'clean',
    'copy:assets',
    'assemble',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy:assets',
    'assemble',
  ]);

  grunt.registerTask('deploy', [
    'build',
    'buildcontrol:pages'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
