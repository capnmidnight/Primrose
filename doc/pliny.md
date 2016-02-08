# Writing new documentation with Pliny
Documentation in Primrose is recorded via explicit function calls, rather than
the JavaDoc-style of parsing comment blocks. The documentation pages are built
loading the production Primrose library itself and querying its documentation
database live. New code features and documentation for them are delivered in one
cohesive package.

> NOTE: documentation descriptions support a semi-limited subset of Markdown. Specifically,
> none of the shortcuts for the link/image syntax are supported. Inline-HTML *is*
> supported.

## Example:
    pliny.function( "Primrose.Random", {
      name: "number",
      description: "Returns a random floating-point number on a given range [min, max), i.e. min is inclusive, max is exclusive.",
      parameters: [
        {name: "min", type: "Number", description: "The included minimum side of the range of numbers."},
        {name: "max", type: "Number", description: "The excluded maximum side of the range of numbers."}
      ],
      returns: "A random number as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games."
    });
    Primrose.Random.number = function ( min, max ) {
      return Math.random() * ( max - min ) + min;
    };


With the documentation being built in to the Primrose library itself, the latest
documentation is always accessible from code, even during live-programming sessions,
both in your scripts and in your browser's developer console.

If you ever have a question about how a function works, you can pop open
the console and type in a query to the documentation database with the
object's full-qualified name. For example, to read back the documentation
specified above, we would type `pliny("Primrose.HTTP.XHR")`.

Alternatively, many types of objects (namespaces, functions, classes, enumerations),
have a convenience function added to them to display their own help file,
e.g. `Primrose.HTTP.XHR.help()`.

    [function] Primrose.HTTP.XHR([String] method, [String] type, [String] url, [Object] data, [Function] success, [Function] error, [Function] progress)
      parent: Primrose.HTTP
    
      Wraps up the XMLHttpRequest object into a workflow that is easier for me to handle: a single function call. Can handle both GETs and POSTs, with or  without a payload.
    
      parameters:
        0: [String] method - The HTTP Verb being used for the request.
        1: [String] type - How the response should be interpreted. Defaults to "text". "json", "arraybuffer", and other values are also available. See the ref#[1].
        2: [String] url - The resource to which the request is being sent.
        3: [Object] data - The data object to use as the request body payload, if this is a PUT request.
        4: [Function] success - (Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event.
        5: [Function] error - (Optional) the callback to issue whenever an error occurs.
        6: [Function] progress - (Optional) A callback function to be called as the download from the server progresses.
    
      references:
        0: MDN - XMLHttpRequest - responseType - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype
    
      examples:
        0: Make a GET request. - Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your need...