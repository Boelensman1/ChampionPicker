/*global module:false*/
module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true,
            },
            components: {
                src: ['bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
                    'bower_components/bootstrap-sidebar/dist/js/sidebar.js',
                    'bower_components/jquery.debouncedresize/js/jquery.debouncedresize.js',
                    'bower_components/jquery-cookie/jquery.cookie.js',
                    'bower_components/jQuery-Storage-API/jquery.storageapi.min.js'],
                dest: 'dist/<%= pkg.name %>-components.js'
            },
            componentsAfter: {
                src: ['bower_components/bootstrap-sass/dist/js/bootstrap.min.js',
                    'bower_components/pnotify/pnotify.core.js',
                    'bower_components/pnotify/pnotify.nonblock.js',
                    'bower_components/bootstrap-confirmation2/bootstrap-confirmation.min.js',
                    'bower_components/FitText.js/jquery.fittext.js',
                    'bower_components/jquery.transit/jquery.transit.js',
                    'js/extra/centerModal.js'],
                dest: 'dist/<%= pkg.name %>-componentsAfter.js'
            }
        }, concat_css: {
            options: {},
            dist: {
                src: [
                    'dist/<%= pkg.name %>.css',
                    'bower_components/bootstrap/dist/css/bootstrap-theme.css',
                    'bower_components/bootstrap-sidebar/dist/css/sidebar.css',
                    'bower_components/pnotify/pnotify.core.css',
                    'bower_components/pnotify/pnotify.nonblock.css'
                ],
                dest: "dist/<%= pkg.name %>.css"
            }
        },
        uglify: {
            options: {
                drop_console: true
            },
            components: {
                src: '<%= concat.components.dest %>',
                dest: 'dist/<%= pkg.name %>-components.min.js'
            },
            componentsAfter: {
                src: '<%= concat.componentsAfter.dest %>',
                dest: 'dist/<%= pkg.name %>-after.min.js'
            },
            init: {
                options: {
                    sourceMap: true,
                    banner: '<%= banner %>'
                },
                files: {
                    'dist/<%= pkg.name %>-init.min.js': ['js/init.js']
                }
            },
            modernizr: {
                files: {
                    'dist/modernizr.min.js': 'bower_components/modernizr/modernizr.js'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/<%= pkg.name %>.min.css': ['dist/<%= pkg.name %>.css']
                }
            }
        },
        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'index.html': 'index.max.html'     // 'destination': 'source'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'js/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    $: false
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },
        clean: {
            dist: {
                src: ["fonts", "dist"]
            }
        },
        copy: {
            dist: {
                files: [{
                    cwd: 'bower_components/bootstrap-sass/assets/fonts/',  // set working folder / root to copy
                    src: '*',           // copy all files and subfolders
                    dest: 'fonts/',    // destination folder
                    expand: true           // required when using cwd
                }]
            },
            watch: {
                files: {
                    'dist/<%= pkg.name %>.min.css': 'dist/<%= pkg.name %>.css',
                    'dist/<%= pkg.name %>.min.js': 'js/main.js',
                    'dist/<%= pkg.name %>-init.min.js': 'js/init.js',
                    'dist/<%= pkg.name %>-components.min.js': 'dist/<%= pkg.name %>-components.js',
                    'dist/<%= pkg.name %>-after.min.js': 'dist/<%= pkg.name %>-componentsAfter.js',
                    'dist/modernizr.min.js': 'bower_components/modernizr/modernizr.js',
                    'index.html': 'index.max.html'
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.css': 'sass/main.scss'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: 'js/*.js',
                tasks: ['jshint', 'concat', 'copy:watch']
            },
            sass: {
                files: 'sass/*.scss',
                tasks: ['sass','concat_css', 'copy:watch']
            },
            html: {
                files: 'index.max.html',
                tasks: ['copy:watch']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');


    // Default task.
    grunt.registerTask('default', ['clean', 'jshint', 'concat', 'sass','concat_css', 'sass', 'copy:dist', 'uglify', 'cssmin', 'htmlmin']);
    grunt.registerTask('start watch', ['clean', 'jshint', 'concat', 'sass','concat_css', 'copy:dist', 'copy:watch', 'watch']);

};
