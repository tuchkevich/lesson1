'use strict';
// подключение плагинов для работы gulp

const gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass')(require('node-sass')),
    prefixer = require('gulp-autoprefixer'),
    terser = require('gulp-terser'),
    htmlmin = require('gulp-htmlmin'),
    rigger = require('gulp-rigger');

// описание путей
const path = {
    build:{
        html:'build/',
        scss:'build/css/',
        js:'build/js/',
        fonts:'build/fonts/',
        img:'build/img/',
    },
    src:{
        html:'src/*.{html,htm}',
        scss:'src/scss/main.scss',
        js:['src/js/libs.js','src/js/app.js'],
        fonts:'src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
        img:'src/img/**/*.{jpg,gif,jpeg,png,svg,webp}',
    }
};

// описание задач
gulp.task('mv:fonts', function(done){
    gulp.src(path.src.fonts)
        // .on('data', function(file) {
        //     // every nodejs stream has a `data` event, so we can make a callback
        //     console.log({
        //         contents: file.contents,
        //         path:     file.path,
        //         cwd:      file.cwd,
        //         base:     file.base,
        //         // path component helpers
        //         relative: file.relative,
        //         dirname:  file.dirname,  // .../src/app
        //         basename: file.basename, // app.js
        //         stem:     file.stem,     // app
        //         extname:  file.extname   // .js
        //     });
        // })
        .pipe(gulp.dest(path.build.fonts));
    done();
});


gulp.task('build:html', function (done){
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments:true,
            useShortDoctype:true
        }))
        .pipe(gulp.dest(path.build.html))
   done();
});

gulp.task('build:scss', function (done){
    gulp.src(path.src.scss)
        .pipe(plumber())
        .pipe(sass({
            outputStyle:'compressed'// nested, expanded, compact, compressed
        }))
        .pipe(prefixer({
            cascade: false,
            remove: true
        }))
        .pipe(gulp.dest(path.build.scss))
    done();
});


// Основная задача
gulp.task('default', gulp.series('mv:fonts'));