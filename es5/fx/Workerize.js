"use strict";

Primrose.Workerize = function () {
  pliny.class({
    parent: "Primrose",
    name: "Workerize",
    description: "Builds a WebWorker thread out of a JavaScript class's source code, and attempts to create a message interface that matches the message-passing interface that the class already uses.\n\
\n\
Automatically workerized classes should have methods that take a single array for any parameters and return no values. All return results should come through an Event that the class emits.",
    parameters: [{ name: "func", type: "Function", description: "The class function to workerize" }],
    examples: [{
      name: "Create a basic workerized class.",
      description: "Classes in JavaScript are created by adding new functions to the `prototype` of another function, then instantiating objects from that class with `new`. When creating such a class for automatic workerization, a few restrictions are required:\n\
* All methods in the class must be on the prototype. Any methods created and assigned in the constructor will not be available to the message passing interface.\n\
* All interaction with objects of the class must be through these publically accessible methods. This includes initialization.\n\
* All methods should take at most a single arguemnt. If you need multiple arguments, pack them into an array.\n\
* The methods cannot return any values. If a value must be returned to the calling context, it must be done through an event callback.\n\
* The class must assign handlers to events through an addEventListener method that mirrors the standard interface used in DOM. Workerize will not respect the 3rd `bubbles` parameter that is so often ommitted when programming against DOM.\n\
\n\
Assuming the following class:\n\
\n\
    grammar(\"JavaScript\");\n\
    function MyClass(){\n\
      this.listeners = {\n\
        complete: []\n\
      };\n\
      this.objects = [];\n\
    }\n\
\n\
    MyClass.prototype.addEventListener = function(evt, handler){\n\
      if(this.listeners[evt]){\n\
        this.listeners[evt].push(handler);\n\
      }\n\
    };\n\
\n\
    MyClass.prototype.addObject = function(obj){\n\
      this.objects.push(obj);\n\
    };\n\
\n\
    MyClass.prototype.update = function(dt){\n\
      // we can make essentially arbitrarily small timeslice updates\n\
      var SLICE = 0.1;\n\
      for(var ddt = 0; ddt < dt; ddt += SLICE){\n\
        for(var i = 0; i < this.objects.length; ++i){\n\
          var o = this.objects[i];\n\
          o.x += o.vx * SLICE;\n\
          o.y += o.vy * SLICE;\n\
          o.z += o.vz * SLICE;\n\
        }\n\
      }\n\
      // prepare our return state for the UI thread.\n\
      var returnValue = [];\n\
      for(var i = 0; i < this.objects.length; ++i){\n\
        returnValue.push([o.x, o.y, o.z]);\n\
      }\n\
      // and emit the event to all of the listeners.\n\
      for(var i = 0; i < this.listeners.complete.length; ++i){\n\
        this.listeners.complete[i](returnValue);\n\
      }\n\
    };\n\
\n\
Then we can create and use an automatically workerized version of it as follows.\n\
\n\
    grammar(\"JavaScript\");\n\
    var phys = new Primrose.Workerize(MyClass);\n\
    // we keep a local copy of the state so we can perform other operations on it.\n\
    var objects = [];\n\
    for(var i = 0; i < 10; ++i){\n\
      var obj = {\n\
        // random values between -1 and 1\n\
        x: 2 * Math.random() - 1,\n\
        y: 2 * Math.random() - 1,\n\
        z: 2 * Math.random() - 1,\n\
        vx: 2 * Math.random() - 1,\n\
        vy: 2 * Math.random() - 1,\n\
        vz: 2 * Math.random() - 1\n\
      };\n\
      objects.push(obj);\n\
      phys.addObject(obj);\n\
    }\n\
    \n\
    // this flag lets us keep track of whether or not we know that the worker is in the middle of an expensive operation.\n\
    phys.ready = true;\n\
    phys.addEventListener(\"complete\", function(newPositions){\n\
      // We update the state in the UI thread with the expensively-computed values.\n\
      for(var i = 0; i < newPositions.length; ++i){\n\
        objects[i].x = newPositions[i][0];\n\
        objects[i].y = newPositions[i][1];\n\
        objects[i].z = newPositions[i][2];\n\
      }\n\
      phys.ready = true;\n\
    });\n\
    \n\
    var lt = null;\n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      if(lt === undefined || lt === null){\n\
        lt = t;\n\
      } else {\n\
        var dt = t - lt;\n\
        if(phys.ready){\n\
          phys.ready = false;\n\
          phys.update(dt);\n\
          lt = t;\n\
        }\n\
        for(var i = 0; i < objects.length; ++i){\n\
          var o = objects[i];\n\
          // We can even perform a much cheaper position update to smooth over the blips in the expensive update on the worker thread.\n\
          drawObjectAt(o.x + o.vx * dt, o.y + o.vy * dt, o.z + o.vz * dt);\n\
        }\n\
      }\n\
    }\n\
    requestAnimationFrame(paint);" }]
  });
  function Workerize(func) {
    // First, rebuild the script that defines the class. Since we're dealing
    // with pre-ES6 browsers, we have to use ES5 syntax in the script, or invoke
    // a conversion at a point post-script reconstruction, pre-workerization.

    // start with the constructor function
    var script = func.toString(),

    // strip out the name in a way that Internet Explorer also undrestands
    // (IE doesn't have the Function.name property supported by Chrome and
    // Firefox)
    matches = script.match(/function\s+(\w+)\s*\(/),
        name = matches[1],
        k;

    // then rebuild the member methods
    for (k in func.prototype) {
      // We preserve some formatting so it's easy to read the code in the debug
      // view. Yes, you'll be able to see the generated code in your browser's
      // debugger.
      script += "\n\n" + name + ".prototype." + k + " = " + func.prototype[k].toString() + ";";
    }

    // Automatically instantiate an object out of the class inside the worker,
    // in such a way that the user-defined function won't be able to get to it.
    script += "\n\n(function(){\n  var instance = new " + name + "(true);";

    // Create a mapper from the events that the class defines to the worker-side
    // postMessage method, to send message to the UI thread that one of the
    // events occured.
    script += "\n  if(instance.addEventListener){\n" + "    self.args = [null, null];\n" + "    for(var k in instance.listeners) {\n" + "      instance.addEventListener(k, function(eventName, args){\n" + "        self.args[0] = eventName;\n" + "        self.args[1] = args;\n" + "        postMessage(self.args);\n" + "      }.bind(this, k));\n" + "    }\n" + "  }";

    // Create a mapper from the worker-side onmessage event, to receive messages
    // from the UI thread that methods were called on the object.
    script += "\n\n  onmessage = function(evt){\n" + "    var f = evt.data[0],\n" + "        t = instance[f];\n" + "    if(t){\n" + "      t.call(instance, evt.data[1]);\n" + "    }\n" + "  };\n\n" + "})();";

    // The binary-large-object can be used to convert the script from text to a
    // data URI, because workers can only be created from same-origin URIs.
    pliny.property({
      name: "worker",
      type: "WebWorker",
      description: "The worker thread containing our class."
    });
    this.worker = Workerize.createWorker(script, false);

    pliny.property({
      name: "args",
      type: "Array",
      description: "Static allocation of an array to save on memory usage when piping commands to a worker."
    });
    this.args = [null, null];

    // create a mapper from the UI-thread side onmessage event, to receive
    // messages from the worker thread that events occured and pass them on to
    // the UI thread.
    pliny.property({
      name: "listeners",
      type: "Object",
      description: "A bag of arrays of callbacks for each of the class' events."
    });
    this.listeners = {};

    this.worker.onmessage = function (e) {
      emit.call(this, e.data[0], e.data[1]);
    }.bind(this);

    // create mappers from the UI-thread side method calls to the UI-thread side
    // postMessage method, to inform the worker thread that methods were called,
    // with parameters.
    pliny.property({
      name: "&lt;mappings for each method in the original class&gt;",
      type: "Function",
      description: "Each mapped function causes a message to be posted to the worker thread with its arguments packed into an array."
    });
    for (k in func.prototype) {
      // we skip the addEventListener method because we override it in a
      // different way, to be able to pass messages across the thread boundary.
      if (k !== "addEventListener" && k[0] !== '_') {
        // make the name of the function the first argument, no matter what.
        this[k] = this.methodShim.bind(this, k);
      }
    }

    this.ready = true;
  }

  pliny.method({
    parent: "Primrose.Workerize",
    name: "methodShim",
    description: "Posts messages to the worker thread by packing arguments into an array. The worker will receive the array and interpret the first value as the name of the method to invoke and the second value as another array of parameters.",
    parameters: [{ name: "methodName", type: "String", description: "The method inside the worker context that we want to invoke." }, { name: "args", type: "Array", description: "The arguments that we want to pass to the method that we are calling in the worker context." }]
  });
  Workerize.prototype.methodShim = function (eventName, args) {
    this.args[0] = eventName;
    this.args[1] = args;
    this.worker.postMessage(this.args);
  };

  pliny.method({
    parent: "Primrose.Workerize",
    name: "addEventListener",
    description: "Adding an event listener just registers a function as being ready to receive events, it doesn't do anything with the worker thread yet.",
    parameters: [{ name: "evt", type: "String", description: "The name of the event for which we are listening." }, { name: "thunk", type: "Function", description: "The callback to fire when the event occurs." }]
  });
  Workerize.prototype.addEventListener = function (evt, thunk) {
    if (!this.listeners[evt]) {
      this.listeners[evt] = [];
    }
    this.listeners[evt].push(thunk);
  };

  pliny.function({
    parent: "Primrose.Workerize",
    name: "createWorker",
    description: "A static function that loads Plain Ol' JavaScript Functions into a WebWorker.",
    parameters: [{ name: "script", type: "(String|Function)", description: "A String defining a script, or a Function that can be toString()'d to get it's script." }, { name: "stripFunc", type: "Boolean", description: "Set to true if you want the function to strip the surround function block scope from the script." }],
    returns: "The WebWorker object."
  });
  Workerize.createWorker = function (script, stripFunc) {
    if (typeof script === "function") {
      script = script.toString();
    }

    if (stripFunc) {
      script = script.trim();
      var start = script.indexOf('{');
      script = script.substring(start + 1, script.length - 1);
    }

    var blob = new Blob([script], {
      type: "text/javascript"
    }),
        dataURI = URL.createObjectURL(blob);

    return new Worker(dataURI);
  };

  return Workerize;
}();