import wrap from "./wrap";
import withFileSystemWarning from "./withFileSystemWarning";

export default function http(host, target, redirects) {
  return wrap(withFileSystemWarning(function (data) {
    var req = new XMLHttpRequest();
    req.open("POST", host);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(data));
    return data;
  }), target, redirects);
}
