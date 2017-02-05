function identity(data) {
  return data;
}

export default function withFileSystemWarning(thunk) {
  const isBad = location.protocol === "file:";

  if(isBad) {
    console.warn("Can't perform HTTP requests from the file system. Not going to setup the error proxy, but will setup the error catch-all.");
  }

  return isBad ? identity : thunk;
};