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
app.import('vendor/pickadate/lib/picker.time.js');
app.import('vendor/validatorjs/dist/validator.min.js');
app.import('vendor/select2/select2.js');
app.import('vendor/bootstrap.growl/dist/bootstrap-growl.js');

// This takes files from the bower directory and then copys
// them to the compiled directory in a libs directory
var extraAssets = pickFiles(app.trees.vendor.dir,{
    srcDir: '/',
    files: [
		'modernizr/modernizr.js',
		'ckeditor/ckeditor.js',
		'ckeditor/config.js',
		'ckeditor/styles.js',
		'ckeditor/plugins/sharedspace/plugin.js',
		'ckeditor/skins/moono/**/*.css',
		'ckeditor/skins/moono/**/*.png',
    'ckeditor/lang/en.js'
    ],
    destDir: '/libs'
});

var fonts = pickFiles(app.trees.vendor.dir,{
    srcDir: '/',
    files: [
		'entypo/font/entypo.*'
    ],
    destDir: '/assets'
});

fonts = flatten(fonts, {destDir: '/assets'});

// This combines the output of Ember CLI
// and the extraAssets file picking
module.exports = mergeTrees([app.toTree(), extraAssets, fonts]);
