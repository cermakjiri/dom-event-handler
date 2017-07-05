const { exec } = require("child_process");

const gulp = require("gulp");
const uglifyjs = require("uglify-es");
const composer = require("gulp-uglify/composer");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const mocha = require("gulp-mocha");
const browserSync = require("browser-sync").create();
const pkg = require("./package.json");

const minify = composer(uglifyjs, console);

const presets = pkg.babel.presets;

function compileCore() {
    return browserify({
        entries: "src/index.js",
        debug: false,
        standalone: pkg.name
    })
        .transform("babelify", {
            presets: presets,
            sourceMaps: false
        })
        .bundle()
        .pipe(source(`${pkg.name}.js`))
        .pipe(buffer())
        .pipe(gulp.dest("./"));
}

function compileLab() {
    return browserify({
        entries: "lab/src/index.js",
        debug: true,
        standalone: pkg.name
    })
        .transform("babelify", {
            presets: presets
        })
        .bundle()
        .pipe(source(`bundle.js`))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(
            rename({
                basename: "bundle"
            })
        )
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("lab/build"));
}

function clean() {
    return exec(`rm -f ./${pkg.name}.js`);
}

function serve() {
    browserSync.init({
        notify: false,
        logPrefix: pkg.name,
        logLevel: "info",
        open: false,
        server: "./lab/build"
    });
}

function watch() {
    gulp.watch(
        ["src/*.js", "!src/*.test.js"],
        gulp.parallel(compileLab, compileCore)
    );

    gulp.watch("lab/src/*.js", compileLab, browserSync.reload);

    const testWatcher = gulp.watch(["src/*.test.js", "test/*.js"]);

    testWatcher.on("change", (path, stats) => {
        return gulp.src(path, { read: false }).pipe(
            mocha({
                compilers: "js:babel-core/register"
            })
        );
    });
}

function test() {
    return gulp.src(["src/*.test.js", "test/*.js"], { read: false }).pipe(
        mocha({
            compilers: "js:babel-core/register"
        })
    );
}

gulp.task(clean);

gulp.task("build", gulp.series(clean, compileCore));

gulp.task("watch", watch);

gulp.task("serve", gulp.parallel(serve, watch));

gulp.task("test", test);

gulp.task("default", gulp.series("serve"));
