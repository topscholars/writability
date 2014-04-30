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
                tasks: ['concat']
            }
        },
        emberTemplates: {
            compile: {
                options: {
                    precompile: false, // remove for prod
                    templateBasePath: "writability/static/src/views"
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
                    "writability/static/libs/bootstrap/dist/js/bootstrap.js"
                ],
                // the location of the resulting JS file
                dest: 'writability/static/assets/vendors.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['emberTemplates', 'concat']);
};
