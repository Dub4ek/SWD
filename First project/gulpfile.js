var gulp = require('gulp'),
    browserify = require('browserify'),
    browserSync = require('browser-sync').create(),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del');
    uglify = require('gulp-uglify');


gulp.task('default', ['scripts','browserify', 'styles', 'copy-html', 'clean'], function() {
    gulp.watch('./src/main/sass/**/*.scss', ['styles']);
    gulp.watch('./src/main/js/**/*.js', ['scripts', 'browserify', 'clean']);
    gulp.watch('./src/main/index.html', ['copy-html']);
    gulp.watch('./build/index.html').on('change', browserSync.reload);

    browserSync.init({
        server: './build'
    });
});

gulp.task('clean', function() {
    del(['./src/main/js/all.js']);
});

gulp.task('copy-html', function() {
    gulp.src('./src/main/index.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('styles', function() {
    gulp.src('./src/main/sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    gulp.src('./src/main/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./src/main/js/'));
});

gulp.task('scripts-dist', function() {
    gulp.src('./src/main/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('browserify', function() {
    return browserify('./src/main/js/all.js')
        .bundle()
        .pipe(source('all.js'))
        .pipe(gulp.dest('./build/js/'));
});


