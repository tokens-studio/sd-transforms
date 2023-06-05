import { expect } from '@esm-bundle/chai';
import { transformLineHeight } from '../../src/transformLineHeight.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformLineHeight as (value: unknown) => unknown);

describe('transform line height', () => {
  it('transforms line-height % to unit-less decimal value', () => {
    expect(transformLineHeight('50%')).to.equal(0.5);
  });

  it("does not transform line-height if it doesn't end with %", () => {
    expect(transformLineHeight('100')).to.equal('100');
  });

  it('does not transform line-height if it cannot be parsed as float', () => {
    expect(transformLineHeight('not-a-float%')).to.equal('not-a-float%');
  });
});
