const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

// Импортируем series и parallel из Gulp
const { parallel, series } = require('gulp');

function html() {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
}

function css() {
  return gulp.src('src/blocks/**/*.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
}

function videos() {
  return gulp.src('src/videos/**/*.{mp4,avi,mov,mkv,webm}') // Нечувствительность к регистру
    .pipe(gulp.dest('dist/videos'))
    .pipe(browserSync.stream());
}

function clean() {
  return del('dist');
}

// Убедитесь, что build делает parallel (включая html, css, images и videos)
const build = series(clean, parallel(html, css, images, videos));

function watchFiles() {
  gulp.watch('src/**/*.html', html);
  gulp.watch('src/blocks/**/*.css', css);
  gulp.watch('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}', images);
  gulp.watch('src/videos/**/*.{mp4,avi,mov,mkv,webm}', videos);
}

function serve(done) {
  console.log('Starting local server on port 3001...');
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    port: 3001,
    portscanner: false,
    open: false,
    notify: false,
    ui: false,
  }, done);
}

function stopServer(done) {  
  browserSync.exit();  
  done();  
}  

// Экспортируйте задачи   

// Убедитесь, что watchapp корректно определен
const watchapp = series(build, parallel(watchFiles, serve));

// Экспортируйте задачи
exports.stopServer = stopServer;  
exports.watchapp = watchapp;
exports.default = watchapp;
exports.build = build;
exports.clean = clean;
exports.videos = videos;
exports.images = images;
exports.html = html;
exports.css = css;