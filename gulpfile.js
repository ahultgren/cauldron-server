'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var eslint = require('gulp-eslint');

var jsGlob = ['gulpfile.js', 'app/**/*.js', 'app/**/*.js'];

function handleError (error) {
  util.log(error.message);
}

gulp.task('lint', function() {
  return gulp.src(jsGlob)
    .pipe(eslint())
    .on('error', handleError)
    .pipe(eslint.format());
});

gulp.task('watch', function () {
  gulp.watch(jsGlob, ['lint']);
});

gulp.task('build', ['build_js']);
gulp.task('build_js', ['lint']);

gulp.task('default', ['build', 'watch']);
