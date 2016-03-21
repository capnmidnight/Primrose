pliny.function("Primrose.HTTP", {
  name: "getText",
  description: "Get plain text from a server.",
  parameters: [
    { name: "url", type: "String", description: "The resource to which the request is being sent." },
    { name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully, even going so far as to check HTTP status code on the OnLoad event." },
    { name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs." },
    { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }
  ],
  examples: [{
    name: "Make a GET request for plain text.",
    description: "Use this to load arbitrary files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    Primrose.HTTP.getText(\"localFile.json\",\n\
      console.log.bind(console, \"done\"),\n\
      console.error.bind(console),\n\
      console.log.bind(console, \"progress\"));\n\
\n\
## Results:\n\
> \"Object {field1: 1, field2: \\\"Field2\\\"}\""}
  ]
});
Primrose.HTTP.getText = function (url, success, error, progress) {
  Primrose.HTTP.get("text", url, success, error, progress);
};