var log = require("../core").log;

var users = {};

module.exports = {
    handshake: "peer",
    bindSocket: function(socket){
        socket.on("joinRequest", function(name){
            if(users[name] === undefined){
                users[name] = [];
            }
            
            var sockets = users[name];
            
            function forAll(thunk){
                for(var i = 0; i < sockets.length; ++i){
                    if(sockets[i]){
                        thunk(sockets[i], i);
                    }
                }
            }
            
            function forOthers(thunk){
                forAll(function(skt, i){
                    if(skt !== socket){
                        thunk(skt, i);
                    }
                });
            }
            
            function removeSocket(){                
                for(var i = 0; i < sockets.length; ++i){
                    if(sockets[i] === socket){
                        sockets[i] = null;
                        break;
                    }
                }
            }
            
            socket.on("error", removeSocket);
            socket.on("disconnect", removeSocket);
            
            ["offer", "answer", "ice"].forEach(function(o){
                socket.on(o, function(obj){
                    var skt = sockets[obj.toIndex];
                    if(skt){
                        skt.emit(o, obj);
                    }
                });
            });
            
            var index;
            for(index = 0; index < sockets.length; ++index){
                if(!sockets[index]){
                    break;
                }
            }
            
            sockets[index] = socket;
            
            forOthers(function(skt, i){
                skt.emit("user", i, index);
                socket.emit("user", index, i);
            });
        });
    }
};
