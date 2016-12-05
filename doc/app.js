function scroller(id) {
  document.getElementById(id)
    .scrollIntoView({
      block: "top",
      behavior: "smooth"
    });
}

(function () {
  "use strict";

  function replacePreBlocks() {
    var doc = document.querySelector("#documentation") || document.querySelector("main"),
      codeBlocks = doc.querySelectorAll("pre");
    for (var i = 0; i < codeBlocks.length; ++i) {
      var b = codeBlocks[i],
        txt = (b.textContent || b.innerText)
        .trim(),
        grammarSpec = txt.match(GRAMMAR_TEST),
        tokenizer = Primrose.Text.Grammars.PlainText;
      if (grammarSpec) {
        var grammarName = grammarSpec[1];
        tokenizer = Primrose.Text.Grammars[grammarName] || tokenizer;
        txt = txt.replace(GRAMMAR_TEST, "");
      }
      if (Primrose.Text.Themes.Default.regular.backColor) {
        delete Primrose.Text.Themes.Default.regular.backColor;
      }
      b.innerHTML = tokenizer.toHTML(txt);
      b.className = "code-listing";
    }
  }

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
  }

  function showHash(evt) {
    var page = document.location.hash,
      promise = null;
    if (/\.md$/.test(page)) {
      promise = Primrose.HTTP
        .getText("../" + page.substring(1))
        .then(pliny.markdown);
    }
    else if (!docoCache[page]) {
      promise = Promise.reject("Item `" + page + "` does not exist in docoCache.");
    }
    else {
      var p = docoCache[page],
        sections = document.querySelectorAll("#contents > nav > ul > li > details");
      for (var i = 0; i < sections.length; ++i) {
        sections[i].removeAttribute("open");
      }
      openSection(p.obj);
      promise = Promise.resolve(p.doc);
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

  function openSection(head) {
    var links = document.querySelectorAll(".selected"),
      sectionOpen = false;
    for (var i = 0; i < links.length; ++i) {
      links[i].classList.remove("selected");
    }
    while (head) {
      var id = "#" + head.id.trim(),
        elem = document.querySelector("a[href='" + id + "']");
      if (elem) {
        if (!isMobile && !sectionOpen) {
          elem.parentElement.parentElement.parentElement.setAttribute("open", "");
          sectionOpen = true;
        }
        elem.classList.add("selected");
      }

      head = head.parent && pliny.get(head.parent);
    }
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
            group.items.push(obj);
            docoCache["#" + obj.id.trim()] = {
              obj: obj,
              doc: pliny.formats.html.format(obj) + "<a href=\"javascript:scroller('top')\">top</a>"
            };
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
      var group = groupings[g];
      if (group.label) {
        group.items.sort(function (a, b) {
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

        output += "<li><details id=" + group.fieldType + "><summary>" + group.label + "</summary><ul>";
        for (var i = 0; i < group.items.length; ++i) {
          var obj = group.items[i],
            id = "#" + obj.id.trim(),
            doc = docoCache[id].doc;
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
  }

var GRAMMAR_TEST = /^grammar\("(\w+)"\);\r?\n/,
  editors = [],
  groupings = {
    namespaces: {
      label: "Namespaces",
      fieldType: "namespace",
      items: [pliny.database]
    },
    classes: {
      label: "Classes",
      fieldType: "class",
      items: []
    },
    functions: {
      label: "Functions",
      fieldType: "functions",
      items: []
    },
    examples: {
      items: []
    },
    methods: {
      items: []
    },
    properties: {
      items: []
    },
    events: {
      items: []
    },
    records: {
      items: []
    },
    enumerations: {
      items: []
    },
    values: {
      items: []
    }
  };

  var nav, doc, main, docoCache;

  window.addEventListener("hashchange", showHash, false);
  window.addEventListener("load", function() {
    nav = document.querySelector("#contents nav > ul");
    doc = document.querySelector("#documentation");
    if(doc){
      main = document.querySelector("main");
      docoCache = {
        "": {
          obj: null,
          doc: doc.innerHTML
        },
        "#Global": {
          obj: pliny.database,
          doc: pliny.formats.html.format(pliny.database)
        }
      };
      renderDocs();
    }
    else{
      replacePreBlocks();
    }
  });
})();