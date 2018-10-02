var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
// var cp = require('child_process');
// var imagemin = require('gulp-imagemin');
// var browserSync = require('browser-sync');

/*
* Compile and minify sass
*/
gulp.task('sass', gulp.series(function(done) {
  gulp.src('src/styles/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('assets/styles/'));
    done();
}));

/**
 * Compile and minify js
 */
gulp.task('js', function(){
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/'))
});

gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  // gulp.watch('src/fonts/**/*.{tff,woff,woff2}', ['fonts']);
  // gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
  // gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], ['jekyll-rebuild']);
});

// Prepares JS & CSS assets
gulp.task('default', gulp.series('sass', 'js'));
