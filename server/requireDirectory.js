var fs = require("fs");

module.exports = function requireDirectory(path, mod){
    mod.exports = [];
    fs.readdir("./src/" + path, function(err, files){
        if(!err){
            var directories = [];
            for(var i = 0; i < files.length; ++i){
                if(/\.js($|\?)/.test(files[i])){
                    mod.exports.push(require("./" + path + "/" + files[i]));
                }
                else{
                    directories.push(files[i]);
                }
            }
            for(var i = 0; i < directories.length; ++i){
                requireDirectory(path + "/" + directories[i], mod);
            }
        }
    });
};