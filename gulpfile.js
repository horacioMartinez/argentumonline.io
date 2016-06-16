require('es6-promise').polyfill();
var gulp = require('gulp');

gulp.task('autoprefixer', function() {
    var postcss = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('dakara-client-build/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({
            browsers: ['last 5 versions']
        })]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dakara-client-build'));
});


const babel = require('gulp-babel');

gulp.task('es6toes5', function() { /* librerias no compilarlas*/
    return gulp.src(['dakara-client-build/**/*.js','!client-temp/**/lib/*','!client-temp/**/build.js','!client-temp/**/home.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dakara-client-build'))
});

gulp.task('es6toes5-tempclient', function() {
    return gulp.src(['client-temp/**/*.js','!client-temp/**/lib/*','!client-temp/**/build.js','!client-temp/**/home.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('client-temp'))
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