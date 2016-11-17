const fs = require("fs"),
  path = require("path"),
  get = base => fs.readdirSync(base).map(d => path.join(base, d));
  q = get("src");

while(q.length){
  const entry = q.shift(),
    stat = fs.lstatSync(entry);

  if(stat.isDirectory()){
    const newEntries = get(entry).filter(f => !/[\/\\]index.js$/.test(f));
    q.push.apply(q, newEntries);
    let a = "", b = "";
    newEntries.forEach((file, i) => {
      const parts = path.parse(file);
      a += `import ${parts.name} from "./${parts.name}";\n`;
      b += "  " + parts.name;
      if(i < newEntries.length - 1) {
        b += ",\n";
      }
    });
    const c = `${a}\nexport {\n${b}\n};\n\nexport default {\n${b}\n};`;
    fs.writeFileSync(path.join(entry, "index.js"), c);
  }
}