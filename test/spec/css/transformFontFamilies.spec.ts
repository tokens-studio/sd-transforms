import { expect } from '@esm-bundle/chai';
import { processFontFamily, escapeApostrophes } from '../../../src/css/transformTypography.js';

describe('process font family', () => {
  it('transforms font-family to have single quotes around multi-word font-families', () => {
    expect(processFontFamily('')).to.equal(`sans-serif`);
    expect(processFontFamily('Arial, sans-serif')).to.equal(`Arial, sans-serif`);
    expect(processFontFamily('Arial Black, sans-serif')).to.equal(`'Arial Black', sans-serif`);
    expect(processFontFamily('Arial Black, Times New Roman, Foo, sans-serif')).to.equal(
      `'Arial Black', 'Times New Roman', Foo, sans-serif`,
    );
    expect(processFontFamily(`'Arial Black', Times New Roman, Foo, sans-serif`)).to.equal(
      `'Arial Black', 'Times New Roman', Foo, sans-serif`,
    );
  });
});

describe('escape apostrophes', () => {
  it('should escape single apostrophes in strings', () => {
    expect(escapeApostrophes("Suisse Int'l")).to.equal("Suisse Int\\'l");
    expect(escapeApostrophes("Font's Example")).to.equal("Font\\'s Example");
    expect(escapeApostrophes('NoEscape')).to.equal('NoEscape');
  });
});
