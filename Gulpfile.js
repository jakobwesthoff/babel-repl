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

gulp.task("bundle", function (next) {
    execLive("node_modules/.bin/webpack", next);
});

gulp.task("serve", function (next) {
    execLive("./node_modules/.bin/webpack-dev-server", next);
});

gulp.task("copy:html", function() {
    return gulp.src("*.html")
        .pipe(gulp.dest("Distribution/"));
});

gulp.task("release", function (next) {
    run("default", function() {
        execLive("git branch -D workshop-shell ; \
                  git checkout --orphan workshop-shell && \
                  git rm -r --cached Gulpfile.js  Library  README.md  Styles  webpack.config.js  index.html  package.json .gitignore .babelrc yarn.lock && \
                  rm -rf Gulpfile.js  Library  README.md  Styles  webpack.config.js  index.html  package.json .gitignore .babelrc yarn.lock && \
                  rm -rf node_modules && \
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
        "bundle",
        next
    );
});
