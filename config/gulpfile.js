const _ = require('lodash');
const gulp = require('gulp');
const del = require('del');
const path = require('path');
const concat = require('gulp-concat');
const webpack = require('webpack-stream');
const ts = require('gulp-typescript');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const localPaths = require('./local_paths');

require('dotenv-extended').load({
  silent: false,
  path: path.join(localPaths.ENV_FOLDER, '.env'),
  schema: path.join(localPaths.ENV_FOLDER, '.env.schema'),
  defaults: path.join(localPaths.ENV_FOLDER, '.env.defaults')
});

const webpackConfigDev = require('./webpack.config.dev');
const webpackConfigProd = require('./webpack.config.prod');

if (!process.env.LIBRARY_NAME) {
  throw new Error('LIBRARY_NAME environment variable should be defined');
}

const libNameKebab= _.kebabCase(process.env.LIBRARY_NAME);

gulp.task('clean:dist', () => {
  return del([
    path.join(localPaths.DIST_FOLDER, '/**/*'),
    path.join(localPaths.DIST_FOLDER, '!/.gitkeep')
  ], {
    force: true
  })
    .catch(err => console.error(err.message));
});

gulp.task('clean:es', () => {
  return del([
    path.join(localPaths.ES_FOLDER, '/**/*'),
    path.join(localPaths.ES_FOLDER, '!/.gitkeep')
  ], {
    force: true
  })
    .catch(err => console.error(err.message));
});


gulp.task('clean', gulp.parallel(['clean:dist', 'clean:es']));

gulp.task('bundle:dev', () => {
  return gulp.src(path.join(localPaths.LIB_FOLDER, 'index.ts'))
    .pipe(webpack(webpackConfigDev))
    .pipe(gulp.dest(localPaths.DIST_FOLDER));
});

gulp.task('bundle:prod', () => {
  return gulp.src(path.join(localPaths.LIB_FOLDER, 'index.ts'))
    .pipe(webpack(webpackConfigProd))
    .pipe(gulp.dest(localPaths.DIST_FOLDER));
});

gulp.task('transpile', () => {
  const tsProject = ts.createProject(path.join(__dirname, '../tsconfig.json'));
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest(localPaths.ES_FOLDER));
});

gulp.task('css:transpile', function () {
  return gulp.src(path.join(localPaths.LIB_FOLDER, '**/*.css'))
      .pipe(postcss())
      .pipe(gulp.dest(localPaths.ES_FOLDER));
});

gulp.task('css:concat:dev', function () {
  return gulp.src(path.join(localPaths.LIB_FOLDER, '**/*.css'))
      .pipe(postcss())
      .pipe(concat(`${libNameKebab}.css`))
      .pipe(gulp.dest(localPaths.DIST_FOLDER));
});

gulp.task('css:concat:prod', function () {
  return gulp.src(path.join(localPaths.LIB_FOLDER, '**/*.css'))
      .pipe(postcss())
      .pipe(concat(`${libNameKebab}.min.css`))
      .pipe(cssnano())
      .pipe(gulp.dest(localPaths.DIST_FOLDER));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel([
    'bundle:dev',
    'bundle:prod',
    'transpile',
    'css:transpile',
    'css:concat:dev',
    'css:concat:prod'
  ])
));
