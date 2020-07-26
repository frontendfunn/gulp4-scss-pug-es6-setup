const gulp = require("gulp");
const path = require("path");

// BROWSER SYNC
var browserSync = require("browser-sync").create();

// SCSS
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

// PUG
const pug = require("gulp-pug");

// JS
const babel = require("gulp-babel");
const concat = require("gulp-concat");

// PRETTY
var prettyHtml = require("gulp-pretty-html");

const srcPaths = {
  scss: path.join(__dirname, "src", "scss"),
  js: path.join(__dirname, "src", "js"),
  pug: path.join(__dirname, "src"),
};

const distPaths = {
  css: path.join(__dirname, "dist", "css"),
  js: path.join(__dirname, "dist", "js"),
  html: path.join(__dirname, "dist"),
};

// SCSS TASK
function scssTask() {
  return gulp
    .src(path.join(srcPaths.scss, "**/*.scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(distPaths.css))
    .pipe(browserSync.stream());
}

function scssWatcher() {
  return gulp
    .watch(path.join(srcPaths.scss, "**/*.scss"), scssTask)
    .on("change", browserSync.reload);
}

// PUG TASK
function pugTask() {
  return gulp
    .src(path.join(srcPaths.pug, "/*.pug"))
    .pipe(pug())
    .pipe(gulp.dest(distPaths.html));
}
function pugWatcher() {
  return gulp.watch(srcPaths.pug, pugTask).on("change", browserSync.reload);
}

// JS TASK
function jsTask() {
  return gulp
    .src(path.join(srcPaths.js, "/*.js"))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("script.js"))
    .pipe(gulp.dest(distPaths.js));
}

function jsWatcher() {
  return gulp.watch(srcPaths.js, jsTask).on("change", browserSync.reload);
}

// HTML

function htmlTask() {
  return gulp
    .src(path.join(srcPaths.pug, "/*.html"))
    .pipe(prettyHtml())
    .pipe(gulp.dest(distPaths.html));
}

function htmlWatcher() {
  return gulp.watch(srcPaths.pug, htmlTask).on("change", browserSync.reload);
}

// browsersync
function liveReload() {
  browserSync.init({
    server: distPaths.html,
  });
}

exports.default = gulp.parallel(
  liveReload,
  htmlWatcher,
  scssWatcher,
  pugWatcher,
  jsWatcher
);
