import { expect } from '@esm-bundle/chai';
import { transformHEXRGBa } from '../src/transformHEXRGBa';
import { runTransformSuite } from './suites/transform-suite.test';

runTransformSuite(transformHEXRGBa as (value: unknown) => unknown);

describe('transform HEXRGBa', () => {
  it("transforms Figma's hex code RGBA to actual RGBA format", () => {
    expect(transformHEXRGBa('rgba(#ABC123, 0.5)')).to.equal('rgba(171, 193, 35, 0.5)');
  });

  it('does not transform the color if it doesnt match the regex', () => {
    expect(transformHEXRGBa('foo')).to.equal('foo');
  });
});
