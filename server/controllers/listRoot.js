var fmt = require("../core").fmt,
    master = require("../master"),
    controllers = require("../controllers"),
    fs = require("fs");

module.exports = {
    path: "",
    pattern: /^\/(?:index.html)?$/,
    GET: function(params, sendData, sendStaticFile, serverError){
        fs.readdir("html5", function(err, files){
            if(err){
                serverError(500, err);
            }
            else{
                var paths = files.filter(function(f){
                    return /\.html$/.test(f);
                })
                .concat(controllers.filter(function(c){
                        return c.path && c.path.length > 0;
                    })
                    .map(function(c){
                        return c.path;
                    })
                )
                .map(function(file){
                    return fmt("<a class=\"primary button\" href=\"$1\" style=\"width:100%\">$2</a><br>", file, file.replace(".html", ""));
                });
                
                paths.sort();                
                paths = paths.join("");

                master.build(sendData, serverError, 
                    "src/templates/master.html", 
                    "Root file list", 
                    fmt("<section><h1>JSVR</h1><p>Virtual reality-related HTML5 and JavaScript demos</p><p>$1</p></section>", paths));
            }
        });
    }
};