require('es6-promise').polyfill();
var gulp = require('gulp');

gulp.task('autoprefixer', function() {
    var postcss = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('dakara-client-build/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dakara-client-build'));
});


const babel = require('gulp-babel');

gulp.task('es6toes5', function() {
    return gulp.src('dakara-client-build/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dakara-client-build'))
});

var uglify = require('gulp-uglify');

gulp.task('uglify', function() {
    return gulp.src('dakara-client-build/**/*.js')
        .pipe(uglify({
            compress: {
                pure_funcs: ['console.log', 'log.error']
            }
        }))
        .pipe(gulp.dest('dakara-client-build'));
});