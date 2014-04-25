module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            emberTemplates: {
                files: 'writability/static/src/*.hbs',
                tasks: ['emberTemplates']
            },
        },
        emberTemplates: {
            compile: {
                options: {
                    precompile: false, // remove for prod
                    templateBasePath: "writability/static/src"
                },
                files: {
                    "writability/static/src/templates.js": "writability/static/src/*.hbs"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['emberTemplates']);
};

