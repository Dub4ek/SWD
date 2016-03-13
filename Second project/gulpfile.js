var gulp = require('gulp'),
    browserify = require('browserify'),
    browserSync = require('browser-sync').create(),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('browserify-ngannotate'),
    serve = require('gulp-serve'),
    buffer = require('vinyl-buffer');


gulp.task('default', ['browserify', 'styles', 'copy-html', 'copy-serviceWorker', 'copy-images', 'watch'], function() {
    browserSync.init({
        server: './build',
        middleware: function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        }
    });
});

gulp.task('build', ['browserify-dist', 'styles', 'copy-html', 'copy-serviceWorker', 'copy-images', 'start-server']);

gulp.task('start-server', serve({
    root: 'build'
}));

gulp.task('watch', function() {
    gulp.watch('./src/main/sass/**/*.scss', ['styles']);
    gulp.watch('./src/main/js/**/*.js', ['js-watch-reload']);
    gulp.watch(['./src/main/index.html'], ['copy-html']);
    gulp.watch('./build/index.html').on('change', browserSync.reload);
})

gulp.task('js-watch-reload', ['browserify'], browserSync.reload);

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

gulp.task('copy-images', function() {
    gulp.src('./src/main/images/**')
        .pipe(gulp.dest('./build/images'))
});

gulp.task('copy-serviceWorker', function() {
    gulp.src('./src/main/js/sw/**')
        .pipe(gulp.dest('./build/js/'))
});

gulp.task('browserify', function() {
    return browserify('./src/main/js/app.js')
        .bundle()
        .pipe(source('all.js'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('browserify-dist', function() {
    return browserify({
        entries: './src/main/js/app.js',
        transform: [ngAnnotate]
    })
        .bundle()
        .pipe(source('all.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});


