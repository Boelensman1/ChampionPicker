/*global module:false*/
module.exports = function (grunt) {

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
                stripBanners: true
            },
            dist: {
                src: ['bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/bootstrap-sidebar/dist/js/sidebar.js',
                    'bower_components/jquery.debouncedresize/js/jquery.debouncedresize.js',
                    'bower_components/jquery-cookie/jquery.cookie.js',
                    'bower_components/jQuery-Storage-API/jquery.storageapi.min.js',
                    'bower_components/pnotify/pnotify.core.js',
                    'bower_components/pnotify/pnotify.nonblock.js',
                    'js/main.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            dist2: {
                src: ['bower_components/bootstrap-confirmation2/bootstrap-confirmation.min.js',
                    'bower_components/FitText.js/jquery.fittext.js',
                    'bower_components/jquery.transit/jquery.transit.js',
                    'js/init.js',
                    'js/extra/centerModal.js'],
                dest: 'dist/<%= pkg.name %>-after.js'
            }
        },  concat_css: {
            options: {},
            dist: {
                src: ['bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
                    'bower_components/bootstrap-sidebar/dist/css/sidebar.css',
                    'bower_components/pnotify/pnotify.core.css',
                    'bower_components/pnotify/pnotify.nonblock.css',
                    "css/*.css"
                ],
                dest: "dist/<%= pkg.name %>.css"
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
            dist2: {
                src: '<%= concat.dist2.dest %>',
                dest: 'dist/<%= pkg.name %>-after.min.js'
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
                    'dist/ChampionPick.min.css': ['dist/ChampionPick.css']
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
        copy: {
            files: {
                cwd: 'bower_components/bootstrap/dist/fonts/',  // set working folder / root to copy
                src: '*',           // copy all files and subfolders
                dest: 'dist/fonts/',    // destination folder
                expand: true           // required when using cwd
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: 'js/*.js',
                tasks: ['jshint', 'concat', 'uglify']
            },
            css: {
                files: 'css/*.css',
                tasks: ['concat_css', 'cssmin']
            },
            html: {
                files: 'index.max.html',
                tasks: ['htmlmin:dist']
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


    // Default task.
    grunt.registerTask('default', ['jshint', 'concat','concat_css','copy', 'uglify','cssmin','htmlmin']);
    grunt.registerTask('start watch', ['default','watch']);

};
