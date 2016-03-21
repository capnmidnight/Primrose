pliny.function("Primrose.HTTP", {
  name: "getBuffer",
  description: "Get an ArrayBuffer from a server.",
  returns: "If no success function is provide, returns a Promise. Otherwise, returns undefined.",
  parameters: [
    { name: "url", type: "String", description: "The resource to which the request is being sent." },
    { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." },
    { name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event." },
    { name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs." }
  ],
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
      console.error.bind(console, \"error loading\")\n"}
  ]
});
Primrose.HTTP.getBuffer = function (url, progress, success, error) {
  return Primrose.HTTP.get("arraybuffer", url, progress, success, error);
};