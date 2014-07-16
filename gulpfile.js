var gulp = require('gulp'),
	es6transpiler = require('gulp-es6-module-transpiler'),
	concat = require('gulp-concat')
	handlebars = require('gulp-ember-handlebars'),
	merge = require('merge-stream'),
	livereload = require('gulp-livereload');

var bowerDir = './writability/static/libs/',
	dest = gulp.dest('./writability/static/assets');

var vendorFiles = [
	bowerDir + 'loader/loader.js',
	bowerDir + 'lodash/dist/lodash.compat.js',
	bowerDir + 'jquery/dist/jquery.js',
	bowerDir + 'handlebars/handlebars.js',
	bowerDir + 'ember/ember.js',
	bowerDir + 'ember-resolver/dist/ember-resolver.js',

	bowerDir + 'ember-data/ember-data.js',
	bowerDir + 'bootstrap/dist/js/bootstrap.js',
	bowerDir + 'momentjs/moment.js',
	bowerDir + 'validatorjs/dist/validator.min.js',
	bowerDir + 'select2/select2.js',
	bowerDir + 'jquery-ui/js/jquery-ui-1.10.4.custom.js',
	bowerDir + 'pickadate/lib/picker.js',
	bowerDir + 'pickadate/lib/picker.date.js'
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
		.pipe(dest)
		.pipe(livereload({ auto: false }));;
});

gulp.task('watch', function () {
	livereload.listen();
	gulp.watch(['./writability/ember/**/*.js', './writability/ember/templates/**/*.hbs'], ['ember-app']);
});
