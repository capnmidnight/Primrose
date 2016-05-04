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

  var docSearch = document.getElementById("docSearch"),
    nav = document.querySelector("#contents nav > ul"),
    doc = document.querySelector("#documentation"),
    main = document.querySelector("main"),
    docoCache = {
      "": doc.innerHTML,
      "#Global": pliny.formats.html.format(pliny.database)
    };

  var groupings = {
    examples: [],
    namespaces: [pliny.database],
    classes: [],
    methods: [],
    events: [],
    functions: [],
    enumerations: [],
    records: []
  };

  function search() {
    var lists = document.querySelectorAll("#contents li ul");
    for (var i = 0; i < lists.length; ++i) {
      var list = lists[i];
      var elems = list.querySelectorAll("li"),
        search = this.value.toLocaleLowerCase(),
        visibleCount = 0,
        searchableCount = 0;
      for (var j = 0; j < elems.length; ++j) {
        var e = elems[j];
        if (e && e.dataset && e.dataset.name) {
          ++searchableCount;
          var b = e.dataset.name.toLocaleLowerCase(),
            visible = (search.length === 0 || b.indexOf(search) > -1);
          if (visible) {
            ++visibleCount;
            e.style.display = "";
          }
          else {
            e.style.display = "none";
          }
        }
      }
      if (searchableCount > 0 && visibleCount === 0) {
        list.parentElement.style.display = "none";
      }
      else {
        list.parentElement.style.display = "";
      }
    }
  }

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

  function createShortcuts() {
    var headers = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    // We want 3 or more headers because A) the first header is the page title,
    // and B) we don't want to handle the trivial situation of only one section.
    if (headers.length > 2) {
      var curLevel = 0,
        lists = [],
        root = document.createElement("nav"),
        elem = root;

      // Start at 1 to skip the page title.
      for (var i = 1; i < headers.length; ++i) {
        var h = headers[i],
          level = parseFloat(h.tagName.match(/\d/)[0]) - 1,
          txt = h.innerText || h.textContent;

        if (level > curLevel) {
          var list = document.createElement("ul");
          elem.appendChild(list);
          lists.push(list);
          ++curLevel;
        }
        else if (level < curLevel) {
          lists.pop();
          --curLevel;
        }

        var curList = lists[lists.length - 1],
          link = document.createElement("a"),
          elem = document.createElement("li");
        link.appendChild(document.createTextNode(txt));
        link.href = "javascript:scroller(\"header" + i + "\")";
        h.id = "header" + i;
        elem.appendChild(link);
        curList.appendChild(elem);
      }

      headers[1].parentElement.insertBefore(root, headers[1]);
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
        createShortcuts();
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
    groupings.examples = pliny.database.examples || [];
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

        output += "<li><h2>" + g + "</h2><ul>";
        for (var i = 0; i < group.length; ++i) {
          var obj = group[i],
            id = "#" + obj.id.trim(),
            doc = docoCache[id];
          output += "<li data-name=\"" + obj.fullName + "\"><a href=\"" + id + "\"";
          if (doc && doc.indexOf("[under construction]") > -1) {
            output += " class=\"incomplete\"";
          }
          output += ">" + obj.fullName + "</a></li>";
        }
        output += "</ul></li>";
      }
    }
    nav.innerHTML += output;
    showHash();
    search.call(docSearch);
    if (isMobile) {
      document.querySelector("#contents > details").open = false;
    }
  }

  // Setup the navigation events
  docSearch.addEventListener("keyup", search, false);
  docSearch.addEventListener("search", search, false);
  window.addEventListener("hashchange", showHash, false);

  renderDocs();
})();