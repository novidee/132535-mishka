`use strict`;

var gulp = require(`gulp`);
var less = require(`gulp-less`);
var plumber = require(`gulp-plumber`);
var postcss = require(`gulp-postcss`);
var autoprefixer = require(`autoprefixer`);
var minify = require(`gulp-csso`);
var svgstore = require(`gulp-svgstore`);
var imagemin = require(`gulp-imagemin`);
var webp = require(`gulp-webp`);
var rename = require(`gulp-rename`);
var del = require(`del`);
var server = require(`browser-sync`).create();
var run = require(`run-sequence`);

var sourcePath = `source`;
var buildPath = `build`;

gulp.task(`style`, function() {
  gulp.src(`${sourcePath}/less/style.less`)
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(`${buildPath}/css`))
    .pipe(minify())
    .pipe(rename(`style.min.css`))
    .pipe(gulp.dest(`${buildPath}/css`))
    .pipe(server.stream());
});

gulp.task(`images`, function() {
  return gulp.src(`${buildPath}/img/**/*.{png,jpg,svg}`)
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo({
        plugins: [{
          cleanupNumericValues: {
            floatPrecision: 0
          }
        }]
      })
    ]))
    .pipe(gulp.dest(`${buildPath}/img`));
});

gulp.task(`webp`, function() {
  return gulp.src(`${buildPath}/img/**/*.{png,jpg}`)
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(`${buildPath}/img`));
});

gulp.task(`sprite`, function() {
  return gulp.src(`${buildPath}/img/icon-*.svg`)
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [{
          removeAttrs: { attrs: '(stroke|fill)' }
        }]
      })
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`${buildPath}/img`));
});

gulp.task(`serve`, function() {
  server.init({
    server: `${buildPath}`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(`${sourcePath}/less/**/*.less`, [`style`]);
  gulp.watch(`${sourcePath}/*.html`).on(`change`, server.reload);
});

gulp.task(`clean`, function() {
  return del(buildPath);
});

gulp.task(`copy`, function() {
  return gulp.src([
    `${sourcePath}/fonts/**/*.{woff,woff2}`,
    `${sourcePath}/img/**`,
    `${sourcePath}/js/**`,
    `${sourcePath}/*.html`
  ], {
      base: sourcePath
  })
    .pipe(gulp.dest(buildPath));
});

gulp.task(`build`, function(done) {
  run(
    `clean`,
    `copy`,
    `style`,
    `images`,
    `webp`,
    `sprite`,
    done
  );
});
