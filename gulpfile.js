var gulp = require('gulp');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var del = require('del');
var zip = require('gulp-zip');
var amdOptimize = require("amd-optimize");
var merge2 = require('merge2');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var requirejsOptimize = require('gulp-requirejs-optimize');
var edit = require('gulp-edit');
var modify = require('gulp-modify');
var fs = require('fs');
var hogan = require("hogan.js");

gulp.task('serve', function(cb) {
	connect.server({
		port: 9002
	});
});

gulp.task('default', function(cb) {
	runSequence('serve', cb);
});

/*
 * jquery (version 2.1.4)  说明：$ 基本api
 * jquery.nicescroll (version 3.6.8)  说明：美化滚动条
 * json2  说明：JSON.stringify、JSON.parse扩写，相当于Polyfill
 * store (version 2.3.2) 说明：localStorage的封装  https://github.com/jaywcjlove/store.js/blob/HEAD/README-zh.md
 * director (version 1.2.6) 说明：路由Router
 * hogan 
 * lodash (version 3.10.1)
 * globalize
 */

gulp.task('mergelib', function() {
	gulp.src([
			'./lib/jquery.js', 
			'./lib/jquery.nicescroll.js',
			'./lib/json2.js',
			'./lib/store.min.js',
			//'./lib/jquery.fileupload.js',
			'./lib/director.min.js',
			'./lib/hogan-3.0.2.js',
			'./lib/lodash.min.js',
			'./lib/globalize.js',
			'./lib/galleria.js',
			'./lib/galleria.wisedu.js'
		])
		.pipe(concat('commonlib-src.js'))
		.pipe(gulp.dest('dest'))
		.pipe(rename('commonlib.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dest'));
});

gulp.task('amdOpt', function() {
	return gulp.src("src/**/*.js")
		.pipe(amdOptimize.src("index", {
			configFile: "./src/coreConfig.js",
			findNestedDependencies: true,
			exclude: ['config']
		}))
		.pipe(concat("appcore.js"))
		.pipe(gulp.dest("dest/"));
});

gulp.task('generateMockFile', function() {
	fs.writeFileSync('./config.js', "define(function(require, exports, module) {return ''});");
});

gulp.task('mergeWithRequire', function() {
	return gulp.src(['./lib/require.js', './dest/appcore.js'])
		.pipe(concat('appcore.js'))
		.pipe(gulp.dest('dest/'));
});

gulp.task('uglifycore', function() {
	return gulp.src("dest/appcore.js")
		.pipe(concat("appcore-min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("dest/"));
});

gulp.task('clearMockFile', function() {
	return del(['./config.js']);
});

gulp.task('build', function() {
	runSequence('generateMockFile', 'amdOpt', 'mergeWithRequire', 'uglifycore', 'clearMockFile');
});