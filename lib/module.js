var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

module.exports =
class Module {

    constructor(name, fileName, renameClassNames, classNameModifier) {
        this.name = name;
        this.fileName = fileName;
        this.renameClassNames = renameClassNames;
        this.classNameModifier = classNameModifier || function(className, _) {return className};
        this.nameMap = {};
        this.currentIdx = 0;
    }

    _addClassName(className) {
        this.nameMap[className] = this.renameClassNames ? this._nextClassName() : className;
    }

    _nextClassName() {
        var name = "";
        var alphabetIdx = this.currentIdx;

        do {
            name = alphabet.charAt(alphabetIdx % alphabet.length) + name;
        } while((alphabetIdx = Math.floor(alphabetIdx / alphabet.length) - 1) >= 0)

        this.currentIdx++;
        return name;
    }
    
    getMappedClassName(className){
        if(!(className in this.nameMap)) {
            this._addClassName(className);
        }
        return this.classNameModifier(this.nameMap[className], this);
    }
};
