Promise.prototype.log = function(args){
  args = args || [];
  return this.then(function(obj) {
    console.log.apply(console, args.concat([obj]));
    return obj;
  });
};

/*
  Helps convert old Node-style callback-based asynchronous functions to the new
  Promise-based style that is nicer to work with and will also work better with
  async/await whenever it perpetuates out into the cosmos.
*/
export default function promisify(thunk, defaultResults) {
  return new Promise((resolve, reject) => {
    const returnValue = thunk(function(err, results) {
      if(err){
        reject(err);
      }
      else{
        resolve(results || returnValue || defaultResults);
      }
    });
  });
}
