pliny.function({
  name: "copyObject",
  description: "Copies properties from one object to another, essentially cloning the source object into the destination object. Uses a local stack to perform recursive copying. Overwrites any fields that already exist in the destination. For convenience, also returns the destination object.",
  parameters: [
    { name: "dest", type: "Object", description: "The object to which to copy fields." },
    { name: "source", type: "Object", description: "The object from which to copy fields." },
    { name: "shallow", type: "Boolean", optional: true, default: "false", description: "Pass true to avoid recursing through object and only perform a shallow clone." }
  ],
  returns: "Object",
  examples: [
    {
      name: "Copy an object.",
      description: "Blah blah blah\n\
\n\
    grammar(\"JavaScript\");\n\
    var dest = {\n\
        a: 1,\n\
        b: 2,\n\
        c: {\n\
          d: 3\n\
        }\n\
      },\n\
      src = {\n\
        b: 5,\n\
        c: {\n\
          e: 6\n\
        },\n\
        f: 7\n\
      };\n\
    \n\
    copyObject(dest, src);\n\
    console.assert(dest.a === 1);\n\
    console.assert(dest.b === 5);\n\
    console.assert(dest.c.d === 3);\n\
    console.assert(dest.c.e === 6);\n\
    console.assert(dest.f === 7);"
    }
  ]
} );
function copyObject ( dest, source, shallow ) {
  var stack = [ {dest: dest, source: source} ];
  while ( stack.length > 0 ) {
    var frame = stack.pop();
    source = frame.source;
    dest = frame.dest;
    for ( var key in source ) {
      if ( shallow || typeof ( source[key] ) !== "object" || source[key] instanceof String ) {
        dest[key] = source[key];
      }
      else {
        if ( !dest[key] ) {
          dest[key] = {};
        }
        stack.push( {dest: dest[key], source: source[key]} );
      }
    }
  }
  return dest;
}