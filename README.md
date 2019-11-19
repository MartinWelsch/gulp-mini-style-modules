# Usage
```JavaScript
const gulp = require("gulp");
const csStyleModules = require("gulp-cs-style-modules");

var csmod = csStyleModules();

function loadModules() {
    return gulp.src("./Components/*.css")
        .pipe(csmod.loadModules())
        .pipe(gulp.dest("./out/"));
}
function generateDefinitions() {
    return csmod.generateDefinitions()
        .pipe(gulp.dest("./Components/"));
}

module.exports = {
    default: gulp.series(loadModules, generateDefinitions)
};
```