var gulp = require('gulp'),
	es6transpiler = require('gulp-es6-module-transpiler'),
	concat = require('gulp-concat')
	handlebars = require('gulp-ember-handlebars'),
	merge = require('merge-stream');

var bowerDir = './writability/static/libs/',
	dest = gulp.dest('./writability/static/assets');

var vendorFiles = [
	bowerDir + 'loader.js/loader.js',
	bowerDir + 'jquery/dist/jquery.js',
	bowerDir + 'handlebars/handlebars.js',
	bowerDir + 'ember/ember.js',
	bowerDir + 'ember-resolver/dist/ember-resolver.js'
];

gulp.task('vendor', function() {
	gulp.src(vendorFiles)
		.pipe(concat('vendor-new.js'))
		.pipe(dest)
});

gulp.task('ember-app', function() {
	var app = gulp.src('./writability/ember/**/*.js')
		.pipe(es6transpiler({
			type: 'amd',
			prefix: 'writability'
		}));

	var templates = gulp.src('./writability/ember/templates/**/*.hbs')
		.pipe(handlebars({
			outputType: 'amd'
		}));

	return merge(app, templates)
		.pipe(concat('app-new.js'))
		.pipe(dest);
});

gulp.task('watch', function () {
	gulp.watch(['./writability/ember/**/*.js', './writability/ember/templates/**/*.hbs'], ['ember-app']);
});
