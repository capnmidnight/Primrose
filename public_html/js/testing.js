var Assert = {
    ALPHA: 0.0000000000001,
    areEqual: function(expected, actual, msg){
        if(expected !== actual
            && (typeof(expected) !== "number"
                || typeof(actual) !== "number"
                || Math.abs(actual - expected)
            || (Number.isNaN(expected)
                ^ Number.isNaN(actual))) > Assert.ALPHA){
            throw new Error(fmt("$3(expected value) $1 != $2 (actual value)", expected, actual, msg ? "[" + msg + "]" : ""));
        }
    },

    throwsError: function(thunk){
        var errored;
        try{
            thunk();
            errored = false;
        }
        catch(exp){
            errored = true;
        }
        if(!errored){
            throw new Error("Excpected an error but there was none");
        }
    },

    isNotNull: function(obj){
        if(obj === null || obj === undefined){
            throw new Error("object was null");
        }
    }
};

function test(func, printer){
    if(func.tests){
        var results = {
            success: {},
            failure: {},
            total: 0,
            failed: 0,
            succeeded: 0
        };
        for(var key in func.tests){
            if(func.tests[key]
                && typeof(func.tests[key]) === "function"){
                if(printer){
                    printer(fmt("Running $1:", key));
                }
                var start = Date.now();
                ++results.total;
                try{
                    func.tests[key]();
                    ++results.succeeded;
                    var end = Date.now();
                    results.success[key] = {dt: (end - start)};
                }
                catch(exp){
                    ++results.failed;
                    var end = Date.now();
                    results.failure[key] = {dt: (end - start), msg: exp.message, stack: exp.stack || false};
                }
            }
        }
    }
    return results;
}

function consoleTest(func){
    if(func){
        var result = test(func, console.log.bind(console)),
            nameMatch = /function (\w+)\(/,
            matches = func.toString().match(nameMatch),
            name = matches && matches[1],
            beam = "";
        for(var i = 0; i < result.total; ++i){
            beam += i < result.succeeded
                ? "-"
                : "x";
        }
        console.log(fmt("Test results for $1: [$2] $3 succeeded, $4 failed", name, beam, result.succeeded, result.failed));

        console.log("Details:");
        if(result.succeeded > 0){
            console.log("\tSuccesses:");
            for(var key in result.success){
                if(result.success[key]){
                    console.log(fmt("\t\t$1 succeeded after $2ms", key, result.success[key].dt));
                }
            }
        }

        if(result.failed > 0){
            console.log("\Failures:");
            for(var key in result.failure){
                if(result.failure[key]){
                    var val = result.failure[key];
                    console.log(fmt("\t\t$1 FAILED after $2ms: $3", key, val.dt, val.msg));
                    if(val.stack && val.stack.indexOf("at Object.Assert") === -1){
                        console.log(fmt("\t\t$1", val.stack));
                    }
                }
            }
        }
    }
}