var args = process.argv.splice(2);
if (process.env.PORT) {
  args.push("--port");
  args.push(process.env.PORT);
}
require("child_process").execFile("quickstart/StartHere.exe", args);