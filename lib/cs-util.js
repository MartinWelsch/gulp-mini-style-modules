const path = require("path"),
      fs   = require("fs");

module.exports = {
    getNamespaceOfFile: function(filePath, extToRemove) {


        //find .csproj file
        var dir = path.dirname(filePath);

        while(dir != "/" && dir != "." && dir != ".." && dir != "~" && !this.dirContainsProjectFile(dir)) {
            dir = path.dirname(dir);
        }

        var nsPath = path.relative(dir, filePath);
        var firstDot = nsPath.indexOf(".");
        if(firstDot >= 0) {
            nsPath = nsPath.substring(0, firstDot);
        }
        return nsPath.replace("/", ".");
    },
    dirContainsProjectFile: function(dirPath) {
        var files = fs.readdirSync(dirPath);
        for(var file of files) {
            if(file.endsWith(".csproj")) {
                return true;
            }
        }
        return false;
    }
}