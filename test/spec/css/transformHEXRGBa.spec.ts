import { expect } from '@esm-bundle/chai';
import { transformHEXRGBaForCSS } from '../../../src/css/transformHEXRGBa.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformHEXRGBaForCSS as (value: unknown) => unknown);

describe('transform HEXRGBa', () => {
  it("transforms Figma's hex code RGBA to actual RGBA format", () => {
    expect(transformHEXRGBaForCSS('rgba(#ABC123, 0.5)')).to.equal('rgba(171, 193, 35, 0.5)');
  });

  it("transforms Figma's hex code RGBA to actual RGBA format regardless of whitespacing", () => {
    expect(transformHEXRGBaForCSS('rgba( #ABC123 , 0.5)')).to.equal('rgba(171, 193, 35, 0.5)');
  });

  it('does not transform the color if it doesnt match the regex', () => {
    expect(transformHEXRGBaForCSS('foo')).to.equal('foo');
  });

  it("does not transform if it's already rgba() format", () => {
    expect(transformHEXRGBaForCSS('rgba(0,0,0,1)')).to.equal('rgba(0,0,0,1)');
  });

  it('does not transform if the hex value cannot be interpreted properly', () => {
    expect(transformHEXRGBaForCSS('rgba(#000000abcd, 0.3)')).to.equal('rgba(#000000abcd, 0.3)');
  });
});
