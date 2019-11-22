
const es = require("event-stream"),
    Module = require("./lib/module.js"),
    path = require("path"),
    Vinyl = require("vinyl");

const defaultOptions = {
    moduleName: function (filePath) {
        return path.basename(filePath, ".css");
    },
    renameClassNames: true,
    moduleDefinitionGenerators: [require("./lib/generators/cs-module-definition")],
    classNameModifier: function (className, module) {
        return module.name + "-" + className;
    }
};


function CsStyleModules(options) {
    this.options = Object.assign({}, defaultOptions, options || {});
    this.modules = [];

    this.loadModules = loadModules.bind(this);
    this.generateDefinitions = generateDefinitions.bind(this);

    return this;
}

function loadModules() {
    return es.map(function (file, cb) {
        if (file.isBuffer()) {
            var module = new Module(options.moduleName(file.path), file.path, this.options.renameClassNames, this.options.classNameModifier);
            this.modules.push(module);

            var cssString = file.contents.toString();
            const cssClassRegex = /\.([_A-Za-z0-9\-]+)/g;
            var outCssStr = "";

            var pos = 0;
            var match;
            while (match = cssClassRegex.exec(cssString)) {
                //get new classname
                var repl = module.getMappedClassName(match[1]);

                //copy css
                outCssStr += cssString.substring(pos, match.index);
                outCssStr += "." + repl;

                //reposition cursor to end of old class name
                pos = match.index + match[1].length + 1;
            }

            //copy remaining css
            outCssStr += cssString.substring(pos);

            file.contents = Buffer.from(outCssStr);
        }

        cb(null, file);
    });
}

function generateDefinitions() {
    var files = [];

    for (var module of this.modules) {

        for (var generator of this.options.moduleDefinitionGenerators) {
            var gen = new generator(module);
            var content = gen.generate();
            var file = new Vinyl({
                path: gen.fileName,
                contents: Buffer.isBuffer(content) ? content : Buffer.from(content)
            });
            files.push(file);
        }
    }

    return es.readArray(files);
}


module.exports = CsStyleModules;