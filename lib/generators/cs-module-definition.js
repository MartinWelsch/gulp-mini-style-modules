const cs = require("../cs-util");

function cs_module_definition(module) {
};

class CsModuleDefinitionGenerator {


    constructor(module) {
        this.module = module;
        this.fileName = module.name + "Style.cs";
    }

    generate() {

        var csCode = "";

        csCode += `namespace ${cs.getNamespaceOfFile(this.module.fileName, ".css")} {\n`;
        csCode += `\tpublic static class ${this.module.name}Style {\n`;

        for(var origClassName in this.module.nameMap) {
            var sanitized = this.sanitizeClassName(origClassName);
            var newClassName = this.module.getMappedClassName(origClassName);
            
            csCode += `\n\t\tpublic static string ${sanitized} => "${newClassName}";`;
        }

        csCode += "\n\t}\n}\n";

        return csCode;
    }

    sanitizeClassName(className) {
        var sanitized = "";
        var cap = true;
        for (var c of className) {
            if (c == "-") {
                cap = true;
            }
            else if (cap) {
                cap = false;
                sanitized += c.toUpperCase();
            }
            else {
                sanitized += c;
            }
        }
        return sanitized;
    }
}


module.exports = CsModuleDefinitionGenerator;