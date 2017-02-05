'use strict';

// Istanbul can not run coverage without a DOM.
// I don't know how to configure Istanbul to run code before and after Mocha tests, so for now, this is what
// I've come up with. This is not an ideal solution, since we do not get cleaned up after Istanbul has completed.

import jsdomify from 'jsdomify'
jsdomify.create('<!doctype html><html><body><div id="mount"></div></body></html>');

/*
// jsdomify does not understand Element.insertAdjacentHTML, throws error
const mount = document.querySelector('#mount')
mount.insertAdjacentHTML('beforeend', '<p>FOO</p>')
console.log(mount.innerHTML)
*/


/*
// Testcase to verify that Element.insertAdjacentHTML works with jsdom
import jsdom from 'jsdom'

// setup the simplest document possible
const doc = jsdom.jsdom('<!doctype html><html><body><div id="mount"></div></body></html>')

// get the window object out of the document
const win = doc.defaultView

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = doc
global.window = win

const mount = document.querySelector('#mount');
mount.insertAdjacentHTML('beforeend', '<p>FOO</p>')
console.log(mount.innerHTML)
*/
