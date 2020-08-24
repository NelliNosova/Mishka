const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Script

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
}

exports.images = images;

// Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"))
    .pipe(gulp.dest("build/img"));
}

exports.webp = createWebp;

// Sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// HTML

const html = () => {
  return gulp.src("source/*.html")
  .pipe(gulp.dest("build"))
  .pipe(sync.stream());
}

exports.html = html;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build/'
    },
    open: true,
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = () => {
  server.reload();
  done();
}

exports.reload = reload;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", {delay: 550}, gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series("scripts"));
  gulp.watch("source/*.html", gulp.series("html", "reload"));
  gulp.watch("source/img/sprite/*.svg", gulp.series("sprite", "html", "reload"));
  gulp.watch("source/img/*.{png,jpg}", gulp.series("images", "webp", "reload"));
  gulp.watch("source/css/*.css", gulp.series("styles"));
}

exports.build = gulp.series(
  clean,
  copy,
  styles,
  scripts,
  images,
  createWebp,
  sprite,
  html
);

exports.start = gulp.series(
  clean,
  copy,
  styles,
  scripts,
  images,
  createWebp,
  sprite,
  html,
  server,
  watcher
);
