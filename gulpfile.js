var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var ngAnnotate = require('browserify-ngannotate');
var templateCache = require('gulp-angular-templatecache');
var rename = require('gulp-rename');

var jsFiles = "src/**/*.js";
var viewFiles = "src/client/views/templates/**/*.html";

gulp.task('browserify', function() {
    return browserify('./src/client/app.js')
        .transform(ngAnnotate)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./public/'));
});

gulp.task('views', function() {
    return gulp.src(viewFiles)
        .pipe(templateCache({
            standalone: true,
            module: 'mainApp'
        }))
        .pipe(rename("app.mainApp.js"))
        .pipe(gulp.dest('./src/client/views/'));
});

gulp.task('build', ['browserify', 'views'], function() {
     return gulp.src("./public/main.js")
        .pipe(uglify())
        .pipe(gulp.dest('./public/'));
});

