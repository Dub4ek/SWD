var gulp = require('gulp'),
    browserify = require('browserify'),
    browserSync = require('browser-sync').create(),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    buffer = require('vinyl-buffer');


gulp.task('default', ['browserify', 'styles', 'copy-html', 'watch'], function() {
    browserSync.init({
        server: './build'
    });
});

gulp.task('build', ['browserify', 'styles', 'copy-html']);

gulp.task('watch', function() {
    gulp.watch('./src/main/sass/**/*.scss', ['styles']);
    gulp.watch('./src/main/js/**/*.js', ['js-watch-reload']);
    gulp.watch(['./src/main/index.html', './src/main/template/**/*.html'], ['copy-html']);
    gulp.watch('./build/index.html').on('change', browserSync.reload);
})

gulp.task('js-watch-reload', ['browserify'], browserSync.reload);

gulp.task('clean', function() {
    return del(['./src/main/all.js']);
});

gulp.task('copy-html', function() {
    gulp.src('./src/main/index.html')
        .pipe(gulp.dest('./build'));
    gulp.src('./src/main/template/**/*.html')
        .pipe(gulp.dest('./build/template/'));
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

gulp.task('scripts', ['clean'], function() {
    return gulp.src('./src/main/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./src/main/'));
});

gulp.task('browserify', ['scripts'], function() {
    return browserify('./src/main/all.js')
        .bundle()
        .pipe(source('all.js'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('browserify-dist', ['scripts'], function() {
    return browserify('./src/main/all.js')
        .bundle()
        .pipe(source('all.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});


