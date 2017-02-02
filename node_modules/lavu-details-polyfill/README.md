# Details Element Polyfill

![details](./etc/details-element.png)

[![travis build](https://img.shields.io/travis/leifoolsen/lavu-details-polyfill.svg?style=flat-square)](https://travis-ci.org/leifoolsen/lavu-details-polyfill)
[![codecov coverage](https://img.shields.io/codecov/c/github/leifoolsen/lavu-details-polyfill.svg?style=flat-square)](https://codecov.io/github/leifoolsen/lavu-details-polyfill)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![version](https://img.shields.io/npm/v/lavu-details-polyfill.svg?style=flat-square)](http://npm.im/lavu-details-polyfill)

The `<details>` element specifies additional details that the user can view or hide on demand. 
The `<summary>` element defines a visible heading for the `<details>` element. 
The heading can be clicked to show/hide the details.

The `<details>` element currently has very limited cross-browser support. 
This polyfill provides support for the &lt;details&gt; element across all modern browsers.

The polyfill is based on the spec for the details element.
* [WhatWG, 4.11.1 The details element](http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html)
* [W3C Markup, details – control for additional on-demand information](http://dev.w3.org/html5/markup/details.html)
* [HTML/Elements/details Wiki](http://www.w3.org/wiki/HTML/Elements/details)

If you'd like to use the details element and don't know where to start, take a look at this tutorial 
[The details and summary elements](http://html5doctor.com/the-details-and-summary-elements/) at the html5doctor, 
[read the tests](https://github.com/leifoolsen/lavu-details-polyfill/blob/master/test/details-polyfill.spec.js) 
or clone this repo and [try out the demo](https://github.com/leifoolsen/lavu-details-polyfill/blob/master/src/snippets/). 

## Features
* keyboard and ARIA-friendly
* fires `click` event when open state changes
* fully customisable via CSS

## Install
```sh
$ npm install --save lavu-details-polyfill
```

## Usage
**Use it in your page**
```html
<script type="text/javascript" 
        src="node_modules/lavu-details-polyfill/lib/index.min.js"
        charset="utf-8">
</script>
```

**... or require the polyfill**
```javascript
var polyfillDetails = require('lavu-details-polyfill');
```

**... or import the polyfill**
```javascript
import { polyfillDetails } from 'lavu-details-polyfill';
```

### Start using it
```html
<details role="group">
  <summary role="button">Show/Hide me</summary>
  <section>
    <p>Some content.</p>
  </section>
</details>
```

The script uses the `load` event to polyfill the `<details>` elements.

If you load HTML fragments dynamically, e.g. in a single page application, 
then you must call the polyfill after loading the HTML.
```javascript
polyfillDetails(content);
```

Where `content` is the parent node of the loaded HTML fragment.


## Notes
The polyfill provides a minimal CSS meant to mimic the default unstyled 
browser look which you can override in your own CSS/SASS/LESS module. [
Code that overrides the default CSS is provided in the snippets example](https://github.com/leifoolsen/lavu-details-polyfill/blob/master/src/snippets/details-element-demo.html).
```CSS
details, details>summary {
  display: block;
}
details > summary {
  min-height: 1.4em;
  padding: 0.125em;
}
details > summary:before {
  content:"►";
  font-size: 1em;
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 0.3em;
  -webkit-transform-origin: 0.4em 0.6em;
     -moz-transform-origin: 0.4em 0.6em;
      -ms-transform-origin: 0.4em 0.6em;
          transform-origin: 0.4em 0.6em;
}
details[open] > summary:before {
  content:"▼"
}
details > *:not(summary) {
  display: none;
  opacity: 0;
}
details[open] > *:not(summary) {
  display: block;
  opacity: 1;
}
```

The polyfill does not preserve the child elements layout when toggeling the details.
Also, there is no guarantee that a browser's native implementation of the `<details>` element will
respect it's child elements layout when toggeling the details. To preserve the child elements layout,
you should always wrap the child elements inside a block element, e.g. `<div>, <article>, <section>` etc.

```html
<style>
  .inline-element { display : inline-block; }
</style>
<details role="group">
  <summary role="button">Show/Hide me</summary>
  <article>
    <div class="inline-element">
      <p>Some content ..... etc.</p>
    </div>
  </article>
</details>
```

### Credits: The `<details>` polyfill is partly based on/inspired by the following sources:
* https://github.com/jordanaustin/Details-Expander
* https://github.com/chemerisuk/better-details-polyfill
* http://codepen.io/stevef/pen/jiCBE
* http://blog.mxstbr.com/2015/06/html-details/
* http://html5doctor.com/the-details-and-summary-elements/
* http://zogovic.com/post/21784525226/simple-html5-details-polyfill
* http://www.sitepoint.com/fixing-the-details-element/
* https://www.smashingmagazine.com/2014/11/complete-polyfill-html5-details-element/

## Licence
[MIT Licence](http://www.opensource.org/licenses/mit-license.php) 2016 © Leif Olsen
