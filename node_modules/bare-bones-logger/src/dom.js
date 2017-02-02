import wrap from "./wrap";

export default function dom(host, target, redirects) {
  const output = document.querySelector(host);
  return wrap(function (data) {
    const elem = document.createElement("pre");
    elem.appendChild(document.createTextNode(JSON.stringify(data)));
    output.appendChild(elem);
    return data;
  }, target, redirects);
}
