const { src, dest, series, parallel, watch } = require('gulp');

const browsersync = require('browser-sync').create();

const rename = require("gulp-rename");
const jsmin = require('gulp-uglify');
const imgmin = require('gulp-image');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const cssimport = require('gulp-cssimport');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const media = require('postcss-custom-media');

function sync() {
    browsersync.init({
        server: {
            index: './index.html'
        }
    });
}

function html() {
    return src('*.html')

    .pipe(browsersync.stream())
}

function css() {
    return src('src/css/*.css')

    .pipe(cssimport())

    .pipe(postcss([
        autoprefixer(),
        media()
    ]))

    .pipe(sass({
        outputStyle:'compressed'
    }))

    .pipe(rename({
        extname:'.min.css'
    }))

    .pipe(dest('dist/css'))

    .pipe(browsersync.stream())
}

function js() {
    return src('src/js/**/*.js')

    .pipe(babel({
        presets:['@babel/env']
    }))

    .pipe(jsmin())

    .pipe(rename({
        extname:'.min.js'
    }))

    .pipe(dest('dist/js/'))

    .pipe(browsersync.stream())
}

function img() {
    return src('src/img/**')

    .pipe(imgmin())

    .pipe(dest('dist/img'))
}

function att() {
    watch(['./src/css/*.css'], css);

    watch(['./src/js/*.js'], js);

    watch(['./index.html'], html);
}

exports.default = series(
    parallel(html, css, js, img),
    
    parallel(sync, att)
);