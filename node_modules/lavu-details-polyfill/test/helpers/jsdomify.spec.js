'use strict';
import 'babel-polyfill';
import jsdomify from 'jsdomify';
import { expect } from 'chai';
import { qs } from './domHelpers';

describe('mocha-jsdom-jsdomify verification tests', () => {

  before ( () => {
    jsdomify.create('<!doctype html><html><body><div id="mount"></div></body></html>');
  });

  beforeEach( () => {
    jsdomify.clear();
  });

  after ( () => {
    jsdomify.destroy()
  }) ;

  it('has document', () => {
    const div = document.createElement('div');
    expect(div.nodeName).eql('DIV');
  });

  it('works', () => {
    const mount = document.querySelector('#mount');
    expect(mount).to.not.be.null;
  });

  it('can render html', () => {
    const greeting = 'Hello, Hola, Hei';
    const p = document.createElement("P");
    const text = document.createTextNode(greeting);
    p.appendChild(text);

    const mount = document.querySelector('#mount');
    mount.appendChild(p);

    const paragraphs = document.querySelectorAll("P");
    expect(document.body.innerHTML).not.to.be.empty;
    expect(paragraphs.length).equal(1);
    expect(paragraphs[0].innerHTML).equal(greeting);
  });

  it('understands insertAdjacentHTML', () => {
    const mount = document.querySelector('#mount');
    mount.insertAdjacentHTML('beforeend', '<p id="foo">FOO</p>');
    const p = qs('#foo');
    expect(p).to.not.be.null;
  });
});
