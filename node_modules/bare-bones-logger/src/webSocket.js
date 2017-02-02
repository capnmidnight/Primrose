import wrap from "./wrap";
import withFileSystemWarning from "./withFileSystemWarning";

export default function webSocket(host, target, redirects) {
  const socket = new WebSocket(host);
  return wrap(withFileSystemWarning(function (data) {
    socket.send(JSON.stringify(data));
    return data;
  }), target, redirects);
}
