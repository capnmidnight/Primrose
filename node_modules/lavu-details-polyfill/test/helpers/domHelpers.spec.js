'use strict';
import 'babel-polyfill';
import jsdomify from 'jsdomify';
import { expect } from 'chai';
import { qs, qsa, parent, removeChilds } from './domHelpers';

describe('domHelpers', () => {

  const fixture = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Fixture</title>
</head>
<body>
<main id='mount'>
  <p>Paragraph #1</p>
  <p>Paragraph #2</p>
  <section>
    <p>Paragraph #3</p>
    <p class='foo'>Paragraph #4</p>
    <article>
      <p>Paragraph #5</p>
    </article>
  </section>
  <section>
    <p>Paragraph #6</p>
    <p class='foo'>Paragraph #7</p>
  </section>
</main>
</body>
</html>`;

  before ( () => {
    jsdomify.create(fixture);
  });

  after ( () => {
    jsdomify.destroy()
  });

  describe('#qs', () => {
    it('should find element by id', () => {
      const el = qs('#mount');
      expect(el).to.not.be.null;
      expect(el).equal(document.querySelector('#mount'));
    });

    it('should find one element by name', () => {
      const el = qs('p');
      expect(el).to.not.be.null;
      expect(el.nodeName).equal('P');
    });

    it('should find one element by class', () => {
      const el = qs('section p.foo');
      expect(el).to.not.be.null;
      expect(el.nodeName).to.equal('P');
    });

    it('should find paragraph via section element', () => {
      const section = qs('section');
      const p = qs('p', section);
      expect(p).to.not.be.null;
      expect(p.nodeName).to.equal('P');
    });

    it('should find nothing', () => {
      const nothing = qs('#fizzbuzz');
      expect(nothing).to.be.null;
    });

  });

  describe('#qsa', () => {
    it('should find element by id', () => {
      const elements = qsa('#mount');
      expect(elements).to.have.lengthOf(1);
    });

    it('should find at least four paragraphs', () => {
      const elements = qsa('p');
      expect(elements).to.have.length.of.at.least(4);
    });

    it('should find at least two elements by class', () => {
      const elements = qsa('.foo');
      expect(elements).to.have.length.of.at.least(2);
    });

    it('should find paragraphs via section element', () => {
      const section = qs('section');
      const elements = qsa('p', section);
      expect(elements).to.have.length.of.at.least(2);
    });

    it('should find nothing', () => {
      const nothing = qsa('#fizzbuzz');
      expect(nothing).to.have.lengthOf(0);
    });
  });

  describe('#parent', () => {
    it('should have parent with tagName section', () => {
      const p = qs('article p');
      const section = parent(p, 'section');
      expect(section).to.not.be.null;
    });
    it('should have no parent with given tagName', () => {
      const p = qs('section p');
      const article = parent(p, 'article');
      expect(article).to.be.null;
    });
  });

  describe('#removeChilds', () => {

    after( () => {
      // Restore fixture in case this suite is not the last to execute
      jsdomify.clear();
    });

    it('should remove child elements', () => {
      let element = removeChilds(qs('#mount'));
      expect(element.childNodes).to.have.lengthOf(0);
    });

    it('should remove child elements with reflow = false', () => {
      let element = removeChilds(qs('#mount'), false);
      expect(element.childNodes).to.have.lengthOf(0);
    });

  });

});
