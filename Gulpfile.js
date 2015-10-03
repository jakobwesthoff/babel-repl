/*eslint-env node */
"use strict";

var gulp = require("gulp");
var $$ = require("gulp-load-plugins")();
var exec = require("child_process").exec;
var run = require("run-sequence");

function execLive(command, next) {
    var child = exec(command, {maxBuffer: Number.MAX_SAFE_INTEGER}, next);

    child.stdout.on("data", function (data) {
        process.stdout.write(data);
    });

    child.stderr.on("data", function (data) {
        process.stderr.write(data);
    });
}

gulp.task("clean", function() {
    return gulp.src(["Distribution/"])
        .pipe($$.rimraf());
});

gulp.task("install", function (next) {
    execLive("./node_modules/.bin/jspm install", next);
});

gulp.task("bundle", function (next) {
    execLive("./node_modules/.bin/jspm bundle-sfx Library/App.js Distribution/bundle.js ", next);
});

gulp.task("optimize:js", function() {
    return gulp.src('Distribution/*.js')
        .pipe($$.uglify())
        .pipe($$.rename({
             extname: ".min.js"
        }))
        .pipe(gulp.dest("Distribution/"));
});

gulp.task("serve", function (next) {
    execLive("./node_modules/.bin/http-server -c-1 .", next);
});

gulp.task("copy:html", function() {
    return gulp.src("*.html")
        .pipe(gulp.dest("Distribution/"));
});

gulp.task("optimize:index", function(next) {
    execLive("./node_modules/.bin/html-dist Distribution/index.html --remove-all --minify --insert bundle.js -o Distribution/index.html", next);
});


gulp.task("default", function(next) {
    run(
        "clean",
        "copy:html",
        "optimize:index",
        "bundle",
        "optimize:js", 
        next
    );
});
