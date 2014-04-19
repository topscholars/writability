require.config({
    shim: {
        'ember': {
            deps: ['handlebars', 'jquery'],
            exports: 'Ember'
        }
    },
    paths: {
        modernizr: "/static/libs/modernizr/modernizr",
        lodash: "/static/libs/lodash/dist/lodash.compat",
        jquery: "/static/libs/jquery/dist/jquery",
        handlebars: "/static/libs/handlebars/handlebars",
        ember: "/static/libs/ember/ember"
    }
});

require([
    // application
    'app',
    // one time libraries that modify other libraries

], function () {
});
