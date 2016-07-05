function scroller(id) {
  document.getElementById(id).scrollIntoView({
    block: "top",
    behavior: "smooth"
  });
}

var GRAMMAR_TEST = /^grammar\("(\w+)"\);\r?\n/;
function replacePreBlocks() {
  var doc = document.querySelector("#documentation"),
    codeBlocks = doc.querySelectorAll("pre");
  for (var i = 0; i < codeBlocks.length; ++i) {
    var b = codeBlocks[i],
      txt = (b.textContent || b.innerText).trim(),
      grammarSpec = txt.match(GRAMMAR_TEST),
      tokenizer = Primrose.Text.Grammars.PlainText;
    if (grammarSpec) {
      var grammarName = grammarSpec[1];
      tokenizer = Primrose.Text.Grammars[grammarName] || tokenizer;
      txt = txt.replace(GRAMMAR_TEST, "");
    }

    b.innerHTML = tokenizer.toHTML(txt);
  }
}

(function () {
  "use strict";

  var nav = document.querySelector("#contents nav > ul"),
    doc = document.querySelector("#documentation"),
    main = document.querySelector("main"),
    docoCache = {
      "": doc.innerHTML,
      "#Global": pliny.formats.html.format(pliny.database)
    };

  var groupings = {
    namespaces: [pliny.database],
    classes: [],
    methods: [],
    events: [],
    functions: []
  };

  var editors = [];

  function editorFocused(evt) {
    for (var i = 0; i < editors.length; ++i) {
      if (editors[i] !== evt.target) {
        editors[i].blur();
      }
    }
  }

  function fixLinks() {
    var links = doc.querySelectorAll("a");
    for (var i = 0; i < links.length; ++i) {
      var link = links[i],
        url = new URL(link.href);
      if (url.host !== document.location.host) {
        link.target = "_blank";
      }
    }
    links = nav.querySelectorAll("a");
    for (var i = 0; i < links.length; ++i) {
      var link = links[i],
        url = new URL(link.href);
      if (url.host === document.location.host && url.pathname === document.location.pathname) {
        if (url.hash === document.location.hash && !link.classList.contains("selected")) {
          link.classList.add("selected");
        }
        else if (url.hash !== document.location.hash && link.classList.contains("selected")) {
          link.classList.remove("selected");
        }
      }
    }
  }

  function showHash(evt) {
    var page = document.location.hash,
      promise = null;
    if (/\.md$/.test(page)) {
      promise = Primrose.HTTP
        .getText("/" + page.substring(1))
        .then(pliny.markdown);
    }
    else {
      promise = Promise.resolve(docoCache[page].toString());
    }

    promise
      .catch(function (err) {
        console.error(err);
        return "Not found: " + page;
      })
      .then(function (html) {
        doc.innerHTML = html;
        replacePreBlocks();
        fixLinks();
        if (evt) {
          scroller("documentation");
        }
      });
  }

  // Walk the documentation database, grouping different objects by type.
  function buildDocumentation() {
    var stack = [pliny.database];
    while (stack.length > 0) {
      var collections = stack.shift();
      for (var key in collections) {
        if (groupings[key]) {
          var collection = collections[key],
            group = groupings[key];
          for (var i = 0; i < collection.length; ++i) {
            var obj = collection[i];
            group.push(obj);
            docoCache["#" + obj.id.trim()] = pliny.formats.html.format(obj) + "<a href=\"javascript:scroller('top')\">top</a>";
            // This is called "trampolining", and is basically a way of performing
            // recursion in languages that do not support automatic tail recursion.
            // Which is ECMAScript 5. Supposedly it's coming in ECMAScript 6. Whatever.
            stack.push(obj);
          }
        }
      }
    }
  }

  function renderDocs() {
    buildDocumentation();
    // Build the menu.
    var output = "";
    for (var g in groupings) {
      if (g !== "methods" && g !== "events") {
        var group = groupings[g];
        group.sort(function (a, b) {
          var c = a.fullName,
            d = b.fullName;
          if (c === "[Global]") {
            c = "A" + c;
          }
          if (d === "[Global]") {
            d = "A" + d;
          }
          if (c > d) {
            return 1;
          }
          else if (c < d) {
            return -1;
          }
          else {
            return 0;
          }
        });

        output += "<li><details><summary>" + g + "</summary><ul>";
        for (var i = 0; i < group.length; ++i) {
          var obj = group[i],
            id = "#" + obj.id.trim(),
            doc = docoCache[id];
          output += "<li><a href=\"" + id + "\"";
          if (doc && doc.indexOf("[under construction]") > -1) {
            output += " class=\"incomplete\"";
          }
          output += ">" + obj.fullName + "</a></li>";
        }
        output += "</details></ul></li>";
      }
    }
    nav.innerHTML += output;
    showHash();
    if (isMobile) {
      document.querySelector("#contents > details").open = false;
    }
  }

  // Setup the navigation events
  window.addEventListener("hashchange", showHash, false);

  renderDocs();
})();