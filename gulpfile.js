'use strict';
// подключение плагинов для работы gulp

const gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass')(require('node-sass')),
    prefixer = require('gulp-autoprefixer'),
    terser = require('gulp-terser'),
    header = require('gulp-header'),
    htmlmin = require('gulp-htmlmin'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

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
},
    config ={
    server:{
        baseDir:'build/',
        index:'index.html'
    },
        port:7787
};



/**Returns arguments array passed through the command line after the task name
 * Algorithm compares received arguments and values with normalized ones
 * to find out whether argument name or value is passed into console
 * Afterwards it forms arg[curOpt] element and sets it to 'true',
 * so if an argument name is not provided with value it will have a 'true' value by default
 * Then we check whether the argument value is set and we need to override it
 * @property {object} [argList] arguments array from current node process process.argv
 * @property {number} [a] arguments counter
 * @property {string} [thisOpt] received argument from array
 * @property {string} [opt] argument without '-' or '--'
 * @property {string} [curOpt] current used argument
 * @return {object} [arg] array of argument names and values
 */

const arg = (argList => {
// get arguments passed in node process through process.argv to argList

    let arg = {}, a, opt, thisOpt, curOpt;

    // go through argList
    for (a = 0; a < argList.length; a++) {

        // trim each object element
        thisOpt = argList[a].trim();

        // replace - or -- from key arguments
        opt = thisOpt.replace(/^-+/, '');

        if (opt === thisOpt) {
            // argument value
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
        }
        else {
            // argument name
            curOpt = opt;
            arg[curOpt] = true;
        }
    }
    return arg;
})(process.argv);

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

gulp.task('test',function (done){
    console.log(arg);
    done();
});

gulp.task('addHeader',function (done) {
    let theme;
    if(typeof arg.theme !== 'undefined' &&  arg.theme !== true){
        theme = arg.theme;
        console.log('Using '+arg.theme+' theme!');
    }else{
        theme = 'polytech';
        console.log('Using default theme!');
    }
    gulp.src('src/var/_variables.scss')
        .pipe(header('$theme: '+theme+';'))
        .pipe(gulp.dest('src/scss/'));
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

gulp.task('webserver', function (done){
    browserSync(config);
    done();
})


// Основная задача
gulp.task('default', gulp.series('addHeader', gulp.parallel('build:scss','build:html','mv:fonts'),'webserver'));

