var fmt = require("./core").fmt,
    fs = require("fs");

module.exports = {
    build: function(done, serverError, templateFile){
        var rest = Array.prototype.slice.call(arguments, 3);
        this.dump(templateFile, done, null, serverError, function(file){
            return fmt.bind(global, file).apply(global, rest);
        });
    },
    dump: function(path, sendData, sendStaticFile, serverError, format){
        fs.exists(path, function(yes){
            if(!yes){
                serverError(404);
            }
            else if(format){
                fs.readFile(path, {encoding: "utf8"}, function (err, file){
                    if (err){
                        serverError(500, err);
                    }
                    else{
                        var data = format(file);
                        sendData("text/html", data, data.length);
                    }
                });
            }
            else if(sendStaticFile){
                sendStaticFile(path);
            }
            else{
                serverError(500, "no output function");
            }
        });
    }
};