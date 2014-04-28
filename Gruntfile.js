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
                dest: 'writability/static/dist/writability.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['emberTemplates', 'concat']);
};
