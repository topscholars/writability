module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            emberTemplates: {
                files: 'writability/static/src/**/*.hbs',
                tasks: ['emberTemplates']
            },
            concat: {
                files: 'writability/static/src/**/*.js',
                tasks: ['concat'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['writability/static/style/**/*.less'],
                tasks: ['less'],
                options: {
                    livereload: true,
                    nospawn: true
                }
            }
        },
        emberTemplates: {
            compile: {
                options: {
                    precompile: false, // remove for prod
                    templateBasePath: "writability/static/src"
                },
                files: {
                    "writability/static/src/templates.js": "writability/static/src/**/*.hbs"
                }
            }
        },
        concat: {
            options: {
            },
            dist: {
                // the files to concatenate
                src: ['writability/static/src/**/*.js'],
                // the location of the resulting JS file
                dest: 'writability/static/assets/writability.js'
            },
            vendor: {
                // the files to concatenate
                src: [
                    "writability/static/libs/lodash/dist/lodash.compat.js",
                    "writability/static/libs/jquery/dist/jquery.js",
                    "writability/static/libs/handlebars/handlebars.js",
                    "writability/static/libs/ember/ember.js",
                    "writability/static/libs/ember-data/ember-data.js",
                    "writability/static/libs/bootstrap/dist/js/bootstrap.js",
                    "writability/static/libs/momentjs/moment.js",
                    "writability/static/libs/validatorjs/dist/validator.min.js",
                    "writability/static/libs/select2/select2.js",
                    "writability/static/libs/jquery-ui/js/jquery-ui-1.10.4.custom.js",
                    "writability/static/libs/pickadate/lib/picker.js",
                    "writability/static/libs/pickadate/lib/picker.date.js"
                    // "writability/static/libs/ckeditor/ckeditor.js"
                ],
                // the location of the resulting JS file
                dest: 'writability/static/assets/vendors.js'
            },
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                // target.css file: source.less file
                "writability/static/style/css/main.css": "writability/static/style/main.less"
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['emberTemplates', 'concat', 'less']);
};
