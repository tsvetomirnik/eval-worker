var gulp = require('gulp');
var jsString = require('gulp-js-string');
var fileinclude = require('gulp-file-include');
var gulpMerge = require('gulp-merge');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

function jsToString (cb) {
	gulp.src('./src/eval-worker.js')
		.pipe(jsString(function(escapedString, file) {
			return '\'' + escapedString + '\'';
		}))
		.pipe(gulp.dest('./dist'))
		.on('end', cb || new Function);
}

function mergeFiles (cb) {
	gulp.src(['./src/index.js', './dist/eval-worker.js'])
		.pipe(fileinclude({
		  prefix: '//@',
		  basepath: '@file'
		}))
		.pipe(gulp.dest('./dist'))
		.on('end', cb || new Function);
}

function clear (cb) {
	gulp.src('./dist/index.js', {read: false})
		.pipe(clean())
		.on('end', cb || new Function);
}

gulp.task('build', function() {
	jsToString(function() {
		mergeFiles(function() {
			// Rename
			gulp.src(['./dist/index.js'])
				.pipe(rename('eval-worker.js'))
				.pipe(gulp.dest('./dist'));
				
			clear();
		});
	});
});

gulp.task('default', ['build']);