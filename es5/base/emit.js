"use strict";

pliny.function({
  name: "emit",
  description: "A shorthand function for triggering events. Can be `.call()`ed on objects that have a `listeners` property.",
  parameters: [{ name: "evt", type: "String", description: "The name of the event to trigger." }, { name: "args", type: "Array", optional: true, description: "Arguments to pass to the event." }],
  examples: [{
    name: "Basic usage",
    description: "    grammar(\"JavaScript\");\n\
    function MyClass(){\n\
      this.listeners = {\n\
        myevent: []\n\
      };\n\
    }\n\
    \n\
    MyClass.prototype.addEventListener = function(evt, thunk){\n\
      this.listeners[evt].push(thunk);\n\
    };\n\
    \n\
    MyClass.prototype.execute = function(){\n\
      emit.call(this, \"myevent\", { a: 1, b: 2});\n\
    };\n\
    \n\
    var obj = new MyClass();\n\
    obj.addEventListener(\"myevent\", function(evt){\n\
      console.assert(evt.a === 1);\n\
      console.assert(evt.b === 2);\n\
    });\n\
    obj.execute();"
  }]
});
function emit(evt, args) {
  var handlers = this.listeners && this.listeners[evt] || this._listeners && this._listeners[evt];
  for (var i = 0; handlers && i < handlers.length; ++i) {
    handlers[i](args);
  }
}