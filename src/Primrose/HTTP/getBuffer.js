/*
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
    name: "options",
    type: "Primrose.HTTP.XHR.optionsHash",
    optional: true,
    description: "Options for passing data or tracking progress. See [`Primrose.HTTP.XHR.optionsHash`](#Primrose_HTTP_XHR_optionsHash) for more information."
  }],
  examples: [{
    name: "Make a GET request for an ArrayBuffer.",
    description: `Use this to load audio files and do whatever you want with them.

## Code:

  grammar("JavaScript");
  var context = new AudioContext();
  Primrose.HTTP.getBuffer("audio.mp3",
    console.log.bind(console, "progress"));,
    function(buffer){
      context.decodeAudioData(
        buffer,
        console.log.bind(console, "success"),
        console.error.bind(console, "error decoding"));
    },
    console.error.bind(console, "error loading")\n`
  }]
});
*/

import get from "./get";
export default function getBuffer(url, options) {
  return get("arraybuffer", url, options);
};
