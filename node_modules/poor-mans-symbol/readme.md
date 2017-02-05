# poor-mans-symbol

> Poor man's Symbol implementation, not compliant. Uses `window.Symbol` if present

[![gzipped size](https://badges.herokuapp.com/size/github/bfred-it/poor-mans-symbol/master/dist/poor-mans-symbol.browser.js?gzip=true&label=gzipped%20size)](#readme) [![Travis build status](https://api.travis-ci.org/bfred-it/poor-mans-symbol.svg?branch=master)](https://travis-ci.org/bfred-it/poor-mans-symbol) [![gzipped size](https://img.shields.io/npm/v/poor-mans-symbol.svg)](https://www.npmjs.com/package/poor-mans-symbol) 

This is not a polyfill, it's only good to be used to generate pseudo-[private property keys.](http://www.2ality.com/2014/12/es6-symbols.html#symbols_as_property_keys)

## Usage with npm and ES2015

```sh
npm install --save poor-mans-symbol
```
```js
import PoorSymbol from './poor-mans-symbol';
const ಠ = PoorSymbol('my-nice-module');
el[ಠ] = 'Some private stuff';
```

## Usage without build tools

Copy the content of the file `dist/poor-mans-symbol.browser.js` into your code, don't load that file separately, it's too small. Then:

```js
var ಠ = PoorSymbol('my-nice-module');
el[ಠ] = 'Some private stuff';
```

## License

MIT © [Federico Brigante](http://twitter.com/bfred_it)
