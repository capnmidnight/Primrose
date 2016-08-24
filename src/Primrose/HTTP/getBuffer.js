pliny.function({
  parent: "Primrose.HTTP",
  name: "getBuffer",
  description: "Get an ArrayBuffer from a server.",
  returns: "Promise",
  parameters: [{
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Make a GET request for an ArrayBuffer.",
    description: "Use this to load audio files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var context = new AudioContext();\n\
  Primrose.HTTP.getBuffer(\"audio.mp3\",\n\
    console.log.bind(console, \"progress\"));,\n\
    function(buffer){\n\
      context.decodeAudioData(\n\
        buffer,\n\
        console.log.bind(console, \"success\"),\n\
        console.error.bind(console, \"error decoding\"));\n\
    },\n\
    console.error.bind(console, \"error loading\")\n"
  }]
});

function getBuffer(url, options) {
  return Primrose.HTTP.get("arraybuffer", url, options);
}