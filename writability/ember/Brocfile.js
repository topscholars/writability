/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles   = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var flatten = require('broccoli-flatten');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.
app.import('vendor/momentjs/moment.js');
app.import('vendor/pickadate/lib/picker.js');
app.import('vendor/pickadate/lib/picker.date.js');
app.import('vendor/validatorjs/dist/validator.min.js');
app.import('vendor/select2/select2.js');

var extraAssets = pickFiles(app.trees.vendor.dir,{
    srcDir: '/',
    files: [
		'modernizr/modernizr.js',
		'ckeditor/ckeditor.js',
		'ckeditor/config.js',
		'ckeditor/skins/moono/editor.css',
		'ckeditor/lang/en.js'
    ],
    destDir: '/libs'
});
extraAssets = flatten(extraAssets, { destDir: '/libs' });

module.exports = mergeTrees([app.toTree(), extraAssets]);
