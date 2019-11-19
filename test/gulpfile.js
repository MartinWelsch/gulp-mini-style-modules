const gulp = require("gulp");
const cs_style_modules = require("../index.js");

var csmod = cs_style_modules();

function loadModules() {
    return gulp.src("./Components/*.css")
        .pipe(csmod.loadModules())
        .pipe(gulp.dest("./out/"));
}
function generateDefinitions() {
    return csmod.generateDefinitions()
        .pipe(gulp.dest("./out/def/"));
}

module.exports = {
    default: gulp.series(loadModules, generateDefinitions)
};