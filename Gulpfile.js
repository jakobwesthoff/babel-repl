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

gulp.task("copy:styles", function() {
    return gulp.src("Styles/**/*")
        .pipe(gulp.dest("Distribution/Styles/"));
});

gulp.task("copy:fonts", function() {
    return gulp.src("jspm_packages/npm/font-awesome@4.4.0/fonts/**/*")
        .pipe(gulp.dest("Distribution/jspm_packages/npm/font-awesome@4.4.0/fonts/"));
});

gulp.task("optimize:index", function(next) {
    execLive("./node_modules/.bin/html-dist Distribution/index.html --remove-all --minify --insert bundle.js -o Distribution/index.html", next);
});

gulp.task("release", function (next) {
    run("default", function() {
        execLive("git branch -D workshop-shell ; \
                  git checkout --orphan workshop-shell && \
                  git rm -r --cached Gulpfile.js  Library  README.md  Styles  config.js  index.html  package.json && \
                  rm -rf Gulpfile.js  Library  README.md  Styles  config.js  index.html  package.json && \
                  rm -rf node_modules jspm_packages \
                  mv Distribution/* . && \
                  rm -rf Distribution && \
                  git add * && \
                  git ci -m Release && \
                  git push -f origin workshop-shell && \
                  git checkout master", next);
    });
});


gulp.task("default", function(next) {
    run(
        "clean",
        "copy:html",
        "copy:styles",
        "copy:fonts",
        "optimize:index",
        "bundle",
        "optimize:js",
        next
    );
});
