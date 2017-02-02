import wrap from "./wrap";

export default function user(host, target, redirects) {
  if (!(host instanceof Function)) {
    console.warn("The host parameter was expected to be a function, but it was", host);
  }
  else {
    return wrap(host, target, redirects);
  }
}