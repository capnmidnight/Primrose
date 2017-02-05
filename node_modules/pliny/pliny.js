/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

////////////////////////////////////////////////////////////////////////////////
// start D:\Documents\VR\pliny\src\pliny.js
(function(){"use strict";

/*
 * Copyright (C) 2016 Sean T. McBeth
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

////////////////////////////////////////////////////////////////////////////
// Pliny's author is not smart enough to figure out how to make it        //
// possible to use it to document itself, so here's a bunch of comments.  //
////////////////////////////////////////////////////////////////////////////


// Pliny is a documentation construction system. You create live documentation
// objects on code assets with pliny, then you read back those documentation objects
// with pliny.
//
// Pliny is also capable of generating HTML output for your documentation.
//
// Pliny is named after Gaius Plinius Secundus (https://en.wikipedia.org/wiki/Pliny_the_Elder),
// a scholar and hero, who died trying to save people from the eruption of Mount
// Vesuvius during the destruction of Pompeii. Also, his nephew Gaius Plinius Caecilius Secundus
// (https://en.wikipedia.org/wiki/Pliny_the_Younger), through whom we know his uncle.

// Walks through dot-accessors to retrieve an object out of a root object.
//
// @param {Object} bag - the root object.
// @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
// @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
function openBag(bag, name) {
  // Break up the object path
  return name.split(".")
  // Recurse through objects until we either run out of objects or find the
  // one we're looking for.
  .reduce(function (obj, p) {
    return obj[p];
  }, bag);
}

var pliny = function (require, module) {
  "use strict";

  var markdown = require("marked");

  // The default storage location.
  var database = {
    fieldType: "database",
    fullName: "[Global]",
    id: "Global",
    description: "These are the elements in the global namespace."
  };

  function hash(buf) {
    var s1 = 1,
        s2 = 0,
        buffer = buf.split("").map(function (c) {
      return c.charCodeAt(0);
    });

    for (var n = 0; n < buffer.length; ++n) {
      s1 = (s1 + buffer[n]) % 32771;
      s2 = (s2 + s1) % 32771;
    }
    return s2 << 8 | s1;
  }

  // Figures out if the maybeName parameter is a bag or a string path to a bag,
  // then either gives you back the bag, or finds the bag that the path refers to
  // and gives you that.
  //
  // @param {Object} bag - the root object.
  // @param {String} maybeName - a period-delimited list of object accessors, naming the object we want to access.
  // @returns {Object} - the object we asked for, or undefined, if it doesn't exist.
  function resolveBag(bag, maybeName) {
    if (typeof maybeName === "string" || maybeName instanceof String) {
      return openBag(bag, maybeName);
    } else {
      return maybeName;
    }
  }

  /////
  // Fills in intermediate levels of an object tree to make the full object tree
  // accessible, in the documentation database.
  //
  // @param {String} name - a period-delimited list of object accessors, naming the object we want to fill in.
  // @param {Object} rootObject - the object on which to fill in values.
  // @returns {Object} - the leaf-level filled-in object.
  ///
  function fillBag(name) {
    // Start at the top level.
    var bag = database;
    if (typeof name !== "undefined" && name.length > 0) {
      // Break up the object path.
      var parts = name.split("."),


      // We'll be rebuilding the path as we go, so we can name intermediate objects.
      path = "",


      // The first time we extend the path, it doesn't get a period seperator.
      sep = "";
      // Walk through the object tree.
      for (var i = 0; i < parts.length; ++i) {
        // Fill in any missing objects.
        if (typeof bag[parts[i]] === "undefined") {
          bag[parts[i]] = {};
        }

        path += sep + parts[i];
        sep = ".";

        // Drill down into the tree.
        bag = bag[parts[i]];

        // If we have a name, and the object hasn't already been named, then we
        // give it a name.
        if (path.length > 0 && !bag.name) {
          bag.name = path;
        }
      }
    }
    return bag;
  }

  /////
  // Reads the documentation metadata and builds up the documentation database.
  //
  // @param {String} fieldType - the name of the type of object for which we're reading metadata: function, class, namespace, etc.
  // @param {String} info - the metadata object the user provided us.
  ///
  function analyzeObject(fieldType, info) {
    var i;
    // If the user didn't supply a type for the metadata object, we infer it
    // from context.
    if (typeof info.fieldType === 'undefined') {
      info.fieldType = fieldType;
    }

    // Find out where we're going to store the object in the metadata database and where in the parent object we're going to store the documentation object.
    var parentBag = fillBag(info.parent || ""),
        pluralName = fieldType + "s";
    pluralName = pluralName.replace(/ys$/, "ies").replace(/ss$/, "ses");
    if (!parentBag[pluralName]) {
      parentBag[pluralName] = [];
    }
    var arr = parentBag[pluralName];

    // Make sure we haven't already stored an object by this name.
    var found = false;
    for (i = 0; i < arr.length; ++i) {
      if (arr[i].name === info.name) {
        found = true;
      }
    }

    if (!found) {
      var subArrays = {};

      ["examples", "issues", "comments"].forEach(function (k) {
        if (typeof info[k] !== "undefined") {
          subArrays[k] = info[k];
          delete info[k];
        }
      });

      // After we copy the metadata, we get back the documentation database object
      // that will store the fuller data we get from other objects.
      info = copyObjectMetadata(info);

      arr.push(info);

      // Handle other parent-child relationships.
      if (info.fieldType === "class" && info.baseClass) {
        if (info.parent === undefined) {
          info.parent = info.baseClass;
        }
        pliny.subClass(info);
      }

      for (var k in subArrays) {
        var subArr = subArrays[k],
            type = k.substring(0, k.length - 1);
        for (i = 0; i < subArr.length; ++i) {
          if (subArr[i].parent === undefined) {
            subArr[i].parent = info.fullName.replace(/::/g, ".");
          }
          pliny[type](subArr[i]);
        }
      }
    }
  }

  /////
  // Copies all of the data the user entered for metadata to the documetation
  // object in the documentation database.
  //
  // @param {String} name - a period-delimited list of object accessors, naming the documentation object we want to create.
  // @param {Object} info - the metadata object from the user.
  // @returns the documentation object that we created.
  ///
  function copyObjectMetadata(info) {
    var fullName = (info.parent && info.parent + "." || "") + info.name,
        bag = fillBag(fullName);

    // Make sure we aren't setting the data for a second time.
    if (!bag.fieldType) {

      // Copy all the fields! ALL THE FIELDS!
      // TODO: don't copy metadata directly to bag object. The bag objects are used
      // as the search path for finding code objects, and some of the metadata field
      // names might clash with code object field names. Maybe have a new metadata
      // table.
      for (var k in info) {
        bag[k] = info[k];
      }

      // The fullName is used in titles on documentation articles.
      if (!bag.fullName) {
        if (bag.fieldType === "issue") {
          Object.defineProperty(bag, "issueID", {
            get: function get() {
              return hash(this.parent + "." + this.name);
            }
          });
        }
        Object.defineProperty(bag, "fullName", {
          get: function get() {
            var output = "";
            if (this.parent) {
              output += this.parent;

              // Print the seperator between the parent identifier and the name of
              // the object.
              if (this.fieldType === "method" || this.fieldType === "property" || this.fieldType === "event") {
                // Methods, properties, and events aren't invokable from their class
                // objects, so print them in a different way that doesn't suggest you
                // can dot-access them. I'm using the typical C++ notation for member
                // fields here.
                output += "::";
              } else if (this.fieldType === "example" || this.fieldType === "issue") {
                output += ": ";
              } else {
                output += ".";
              }
            }
            output += this.name;
            return output;
          }
        });
      }

      // The ID is used to make DOM elements.
      if (!bag.id) {
        Object.defineProperty(bag, "id", {
          get: function get() {
            return this.fullName.replace(/(\.|:)/g, "_").replace(/ /g, "");
          }
        });
      }

      // We try to see if the real object exists yet (whether the documentation
      // before or after the object it is documenting). If it doesn't, then we
      // wait a small amount of time for the rest of the script to execute and
      // then pick up where we left off.
      if (!setContextualHelp(fullName)) {
        // The setTimeout is to allow the script to continue to load after this
        // particular function has called, so that more of the script can be
        // inspected.
        setTimeout(setContextualHelp, 1, fullName);
      }
    }
    return bag;
  }

  function setEnumerationValues(name) {
    var enumeration = null;
    try {
      enumeration = require(name);
    } catch (exp) {
      enumeration = null;
    }
    if (!enumeration) {
      setTimeout(setEnumerationValues, 1, name);
    } else {
      for (var key in enumeration) {
        var val = enumeration[key];
        if (enumeration.hasOwnProperty(key) && typeof val === "number") {
          pliny.value({
            parent: name,
            name: key,
            type: "Number",
            description: val.toString(),
            value: val
          });
        }
      }
    }
  }

  var scriptPattern = /\bpliny\s*\.\s*(\w+)/gm;
  /////
  // Finds the actual object in the scope hierarchy, and looks for contextual scripts that might be defined in this object
  //
  // @param {String} name - a period-delimited list of object accessors, naming the real object we want to access.
  // @returns {Object} - the actual object the name refers to, or undefined if such an object exists.
  ///
  function setContextualHelp(name) {
    // Find the real object
    var obj = openBag(database, name);
    if (obj) {
      if (obj.fieldType === "enumeration") {
        setEnumerationValues(obj.parent + "." + obj.name);
      }
      // Look for contextual scripts
      if (typeof obj === "function") {
        var script = obj.toString(),
            match = null;
        while (!!(match = scriptPattern.exec(script))) {
          var fieldType = match[1],
              start = match.index + match[0].length,
              fieldInfo = getFieldInfo(script.substring(start));
          // Shove in the context.
          if (fieldInfo.parent === undefined) {
            fieldInfo.parent = name;
          }

          // And follow the normal documentation path.
          pliny[fieldType].call(null, fieldInfo);
        }
      }
    }
    return obj;
  }

  /////
  // When a documentation script is included inside of a function, we need to
  // read the script and parse out the JSON objects so we can later execute
  // the documentation function safely, i.e. not use eval().
  //
  // @param {String} script - the source code of the containing function.
  // @return {Array} - a list of JSON-parsed objects that are the parameters specified at the documentation function call-site (i.e. sans context)
  ///
  function getFieldInfo(script) {
    var parameters = [],
        start = 0,
        scopeLevel = 0,
        inString = false,
        stringToken = null;

    // Walk over the script...
    for (var i = 0; i < script.length; ++i) {
      // ... a character at a time
      var c = script.charAt(i);

      // Keep track of whether or not we're in a string. We're looking for any
      // quotation marks that are either at the beginning of the string or have
      // not previously been escaped by a backslash...
      if ((inString && c === stringToken || !inString && (c === '"' || c === "'")) && (i === 0 || script.charAt(i - 1) !== '\\')) {
        inString = !inString;
        if (inString) {
          stringToken = c;
        }
      }

      // ... because only then...
      if (!inString) {
        // ... can we change scope level. We're only supporting JSON objects,
        // so no need to go any further than this.
        if (c === '(' || c === '{' || c === '[') {
          ++scopeLevel;
        } else if (c === ')' || c === '}' || c === ']') {
          --scopeLevel;
        }
      }

      // If we've exited the parameter list, or we're inside the parameter list
      // and see a comma that is not inside of a string literal...
      if (scopeLevel === 0 || scopeLevel === 1 && c === ',' && !inString) {
        // ... save the parameter, skipping the first character because it's always
        // either the open paren for the parameter list or one of the commas
        // between parameters.
        parameters.push(parseParameter(script.substring(start + 1, i).trim()));

        // Advance forward the start of the next token.
        start = i;

        // If we left the parameter list, we've found all of the parameters and
        // can quit out of the loop before we get to the end of the script.
        if (scopeLevel === 0) {
          break;
        }
      }
    }
    if (parameters.length !== 1) {
      throw new Error("There should have only been one parameter to the function");
    }
    return parameters[0];
  }

  ////
  // useful in cases where a functional system really just needs to check the
  // value of a collection.
  ///
  function identity(v) {
    return v;
  }

  /////
  // When we've found an individual parameter to a documentation function in a
  // contextual scope, we need to make sure it's valid JSON before we try to
  // convert it to a real JavaScript object.
  //
  // @param {String} script - the subscript portion that refers to a single parameter.
  // @return {Object} - the value that the string represents, parsed with JSON.parse().
  ///
  function parseParameter(script) {
    // Make sure all hash key labels are surrounded in quotation marks.
    var stringLiterals = [];
    var litReplace = function litReplace(str) {
      var name = "&STRING_LIT" + stringLiterals.length + ";";
      if (str[0] === "'") {
        str = str.replace(/\\"/g, "&_DBLQUOTE_;").replace(/\\'/g, "&_SGLQUOTE_;").replace(/"/g, "\\\"").replace(/'/g, "\"").replace(/&_DBLQUOTE_;/g, "\\\"").replace(/&_SGLQUOTE_;/g, "\\'");
      }
      stringLiterals.push(str);
      return name;
    };
    var litReturn = function litReturn(a, b) {
      return stringLiterals[b];
    };
    var param = script.replace(/'(\\'|[^'])+'/g, litReplace).replace(/"(\\"|[^"])+"/g, litReplace).replace(/\b(\w+)\b\s*:/g, "\"$1\":").replace(/&STRING_LIT(\d+);/g, litReturn).replace(/&STRING_LIT(\d+);/g, litReturn).replace(/\\\r?\n/g, "");
    return JSON.parse(param);
  }

  // A collection of different ways to output documentation data.
  var formatters = {
    /////
    // Find a particular object and print out the documentation for it.
    //
    // @param {String} name - a period-delimited list of object accessors, naming the object we want to access.
    ///
    format: function format(name) {
      var obj = null;
      if (typeof name === "string" || name instanceof String) {
        obj = openBag(database, name);
      } else {
        obj = name;
      }
      if (obj) {
        var output = this.shortDescription(true, obj);

        // The array defines the order in which they will appear.
        output += "\n\n" + ["parent", "description", "parameters", "returns", "errors", "namespaces", "classes", "functions", "values", "events", "properties", "methods", "enumerations", "records", "examples", "issues", "comments"].map(formatters.checkAndFormatField.bind(this, obj))
        // filter out any lines that returned undefined because they didn't exist
        .filter(identity)
        // concate them all together
        .join("\n");
        return output;
      }
    },
    checkAndFormatField: function checkAndFormatField(obj, prop) {
      var obj2 = obj[prop];
      if (obj2) {
        return this.formatField(obj, prop, obj2);
      }
    }
  };
  // Make HTML that can be written out to a page
  formatters.html = {
    format: function format(name) {
      var obj = resolveBag(database, name);
      return "<section id=\"" + obj.id + "\" class=\"" + obj.fieldType + "\"><article>" + formatters.format.call(formatters.html, obj) + "</article></section>";
    },
    /////
    // Puts together a string that describes a top-level field out of a documentation
    // object.
    //
    // @param {Object} obj - the documentation object out of which we're retrieving the field.
    // @param {String} p - the name of the field we're retrieving out of the documentation object.
    // @return {String} - a description of the field.
    ///
    formatField: function formatField(obj, propertyName, value) {
      var output = "";
      if (obj.fieldType === "enumeration" && propertyName === "values") {
        output += this.formatEnumeration(obj, propertyName, value);
      } else if (value instanceof Array) {
        output += this.formatArray(obj, propertyName, value);
      } else if (propertyName === "parent") {
        output += "<p>Contained in <a href=\"index.html#" + pliny.get(value).id + "\"><code>" + value + "</code></a></p>";
      } else if (propertyName === "description") {
        output += markdown(value);
      } else if (propertyName === "returns") {
        output += "<h3>Return value</h3>" + markdown(value);
      } else {
        output += "<dl><dt>" + propertyName + "</dt><dd>" + value + "</dd></dl>";
      }
      return output;
    },
    ////
    // Specific fomratting function for Enumerations
    //
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @param {Array} arr - the array from which we're reading values.
    // @return {String} - the formatted description of the array.
    formatEnumeration: function formatEnumeration(obj, arrName, arr) {
      var output = "<table><thead><tr><th>Name</th><th>Value</th><tr><thead><tbody>";
      for (var i = 0; i < arr.length; ++i) {
        var e = arr[i];
        output += "<tr><td>" + e.name + "</td><td>" + e.description + "</td></tr>";
      }
      output += "</tbody></table>";
      return output;
    },
    ////
    // Specific formatting function for Code Example.
    //
    // @param {Array} arr - an array of objects defining programming examples.
    // @return {String} - a summary/details view of the programming examples.
    examplesFormat: function examplesFormat(obj, arr) {
      var output = "";
      for (var i = 0; i < arr.length; ++i) {
        var ex = arr[i];
        output += "<div><h3><a href=\"index.html#" + ex.id + "\">" + ex.name + "</a></h3>" + markdown(ex.description) + "</div>";
      }
      return output;
    },
    ////
    // Specific formatting function for Issues.
    //
    // @param {Array} arr - an array of objects defining issues.
    // @return {String} - a summary/details view of the issues.
    issuesFormat: function issuesFormat(obj, arr) {
      var parts = {
        open: "",
        closed: ""
      };
      for (var i = 0; i < arr.length; ++i) {
        var issue = arr[i],
            str = "<div><h3><a href=\"index.html#" + issue.id + "\">" + issue.issueID + ": " + issue.name + " [" + issue.type + "]</a></h3>" + markdown(issue.description) + "</div>";
        parts[issue.type] += str;
      }
      return parts.open + "<h2>Closed Issues</h2>" + parts.closed;
    },
    ////
    // Specific formatting function for Comments section of Issues.
    //
    // @param {Array} arr - an array of objects defining comments.
    // @return {String} - a summary/details view of the comment.
    commentsFormat: function commentsFormat(obj, arr) {
      var output = "";
      for (var i = 0; i < arr.length; ++i) {
        var comment = arr[i];
        output += "<aside><h3>" + comment.name + "</h3>" + markdown(comment.description);
        if (typeof comment.comments !== "undefined" && comment.comments instanceof Array) {
          output += this.formatArray(comment, "comments", comment.comments);
        }
        output += "</aside>";
      }
      return output;
    },
    /////
    // Puts together lists of parameters for function signatures, as well as
    // lists of properties and methods for classes and the like.
    //
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @param {Array} arr - the array from which we're reading values.
    // @return {String} - the formatted description of the array.
    ///
    formatArray: function formatArray(obj, arrName, arr) {
      var output = "<h2>";
      if (obj.fieldType === "class") {
        if (arrName === "parameters") {
          output += "constructor ";
        } else if (arrName === "functions") {
          output += "static ";
        }
      }

      if (arrName !== "description") {
        output += arrName;
      }

      output += "</h2>";

      var formatterName = arrName + "Format";
      if (this[formatterName]) {
        output += this[formatterName](obj, arr);
      } else {
        output += "<ul class=\"" + arrName + "\">" + arr.map(this.formatArrayElement.bind(this, arrName)).join("") + "</ul>";
      }
      return output;
    },
    /////
    // For individual elements of an array, formats the element so it fits well
    // on the screen.
    //
    // @param {String} arrName - the name of the array from which we retrieved elements.
    // @param {String} n - one of the array elements.
    // @return {String} - the formatted element, including a newline at the end.
    ///
    formatArrayElement: function formatArrayElement(arrName, n) {
      var s = "<li>";
      if (n.description) {
        var desc = n.description;
        if (n.optional) {
          desc = "(Optional) " + desc;
        }

        if (n.default !== undefined) {
          desc += " Defaults to <code>" + n.default + "</code>.";
        }

        s += "<dl><dt>" + this.shortDescription(false, n) + "</dt><dd>" + markdown(desc) + "</dd></dl>";
      } else {
        s += this.shortDescription(false, n);
      }
      s += "</li>";
      return s;
    },
    /////
    // Describe an object by type, name, and parameters (if it's a function-type object).
    // @param {Object} p - the documentation object to describe.
    // @return {String} - the description of the documentation object.
    ///
    shortDescription: function shortDescription(topLevel, p) {
      var output = "",
          tag = topLevel ? "h1" : "span",
          isFunction = p.fieldType === "function" || p.fieldType === "method" || p.fieldType === "event",
          isContainer = isFunction || p.fieldType === "class" || p.fieldType === "namespace" || p.fieldType === "enumeration" || p.fieldType === "subClass" || p.fieldType === "record";

      output += "<" + tag + ">";
      if (isContainer && !topLevel) {
        output += "<a href=\"index.html#" + p.id + "\">";
      }

      output += "<code>" + (topLevel && p.fieldType !== "example" && p.fullName || p.name);

      if (p.type) {
        output += " <span class=\"type\">" + p.type + "</span>";
      }

      // But functions and classes take parameters, so they get slightly more.
      if (isFunction) {
        output += "<ol class=\"signatureParameters\">";
        if (p.parameters) {
          output += "<li>" + p.parameters.map(function (p) {
            return p.name;
          }).join("</li><li>") + "</li>";
        }
        output += "</ol>";
      }

      if (isContainer && !topLevel) {
        output += "</a>";
      }

      return output + "</code></" + tag + ">";
    }
  };

  // Output to the Developer console in the browser directly.
  formatters.console = {
    format: function format(name) {
      return formatters.format.call(formatters.console, name);
    },
    /////
    // Puts together a string that describes a top-level field out of a documentation
    // object.
    //
    // @params {Object} obj - the documentation object out of which we're retrieving the field.
    // @params {String} p - the name of the field we're retrieving out of the documentation object.
    // @return {String} - a description of the field.
    ///
    formatField: function formatField(obj, propertyName, value) {
      if (value instanceof Array) {
        return this.formatArray(obj, propertyName, value);
      } else if (propertyName === "description") {
        return "\t" + value + "\n";
      } else {
        return "\t" + propertyName + ": " + value + "\n";
      }
    },
    /////
    // Puts together lists of parameters for function signatures, as well as
    // lists of properties and methods for classes and the like.
    //
    // @param {Object} obj - the documentation object from which to read an array.
    // @param {String} arrName - the name of the array to read from the documentation object.
    // @return {String} - the formatted description of the array.
    ///
    formatArray: function formatArray(obj, arrName, arr) {
      var output = "\t";
      if (obj.fieldType === "class") {
        if (arrName === "parameters") {
          output += "constructor ";
        } else if (arrName === "functions") {
          output += "static ";
        }
      }

      if (arrName !== "description") {
        output += arrName + ":\n";
      }

      if (arr instanceof Array) {
        output += arr.map(this.formatArrayElement.bind(this, arrName)).join("");
      } else {
        output += arr;
      }
      return output;
    },
    /////
    // For individual elements of an array, formats the element so it fits well
    // on the screen. Elements that are supposed to be inline, but have the ability
    // to be drilled-down into, are truncated if they get to be more than 200
    // characters wide.
    //
    // @param {String} arrName - the name of the array from which we retrieved elements.
    // @param {String} n - one of the array elements.
    // @param {Number} i - the index of the element in the array.
    // @return {String} - the formatted element, including a newline at the end.
    ///
    formatArrayElement: function formatArrayElement(arrName, n, i) {
      var s = "\t\t" + i + ": " + this.shortDescription(false, n);
      if (n.description) {
        s += " - " + n.description;

        if (arrName !== "parameters" && arrName !== "properties" && arrName !== "methods" && s.length > 200) {
          s = s.substring(0, 200) + "...";
        }
      }
      s += "\n";
      return s;
    },
    /////
    // Describe an object by type, name, and parameters (if it's a function-type object).
    // @param {Object} p - the documentation object to describe.
    // @return {String} - the description of the documentation object.
    ///
    shortDescription: function shortDescription(topLevel, p) {
      // This is the basic description that all objects get.
      var output = "";
      if (topLevel || p.type) {
        output += "[" + (p.type || p.fieldType) + "] ";
      }

      output += topLevel ? p.fullName : p.name;

      // But functions and classes take parameters, so they get slightly more.
      if (p.fieldType === "function" || p.fieldType === "method") {
        output += "(";
        if (p.parameters) {
          output += p.parameters.map(this.shortDescription.bind(this, false)).join(", ");
        }
        output += ")";
      }

      return output;
    }
  };

  // The namespacing object we're going to return to the importing script.
  var pliny = formatters.console.format;
  // Give the user access to the database.
  pliny.database = database;
  // Give the user access to all of the formatters.
  pliny.formats = formatters;
  // Just get the raw data
  pliny.get = openBag.bind(null, pliny.database);
  // Forward on the markdown functionality
  pliny.markdown = markdown;
  // Strip pliny calls out of a source file and deposit them into a separate file.
  pliny.carve = function (source, libFile, docFile, callback) {
    var fs = require("fs");
    fs.readFile(source, "utf-8", function (err, txt) {
      var test = /pliny\.\w+/g,
          left = 0,
          outputLeft = "",
          outputRight = "",
          matches = test.exec(txt);
      while (matches) {
        var sub = txt.substring(left, matches.index);
        outputLeft += sub;
        var depth = 0,
            inString = false,
            found = false;
        for (left = matches.index + matches.length; left < txt.length; ++left) {
          if (txt[left] === "\"" && (left === 0 || txt[left - 1] !== "\\")) {
            inString = !inString;
          }
          if (!inString) {
            if (txt[left] === "(") {
              found = true;
              ++depth;
            } else if (txt[left] === ")") {
              --depth;
            }
          }
          if (depth === 0 && found) {
            break;
          }
        }
        while (left < txt.length && /[;\) \r\n]/.test(txt[left])) {
          left++;
        }

        outputRight += txt.substring(matches.index, left);
        matches = test.exec(txt);
      }
      outputLeft += txt.substring(left);
      if (docFile) {
        callback = function (cb) {
          fs.writeFile(docFile, outputRight, cb);
        }.bind(null, callback);
      }
      fs.writeFile(libFile, outputLeft, callback);
    });
  };

  // Create documentation functions for each of the supported types of code objects.
  ["namespace", "event", "function", "value", "class", "property", "method", "enumeration", "record", "subClass", "example", "error", "issue", "comment"].forEach(function (k) {
    pliny[k] = pliny[k] || analyzeObject.bind(null, k);
  });

  if (module) {
    module.exports = pliny;
  }

  return pliny;
}(typeof require !== 'undefined' && require || openBag.bind(null, window), typeof module !== "undefined" && module);
if(typeof window !== "undefined") window.pliny = pliny;
})();
// end D:\Documents\VR\pliny\src\pliny.js
////////////////////////////////////////////////////////////////////////////////