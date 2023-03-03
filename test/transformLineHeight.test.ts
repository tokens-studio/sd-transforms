import { expect } from '@esm-bundle/chai';
import { transformLineHeight } from '../src/transformLineHeight';
import { runTransformSuite } from './suites/transform-suite.test';

runTransformSuite(transformLineHeight as (value: unknown) => unknown);

describe('transform line height', () => {
  it('transforms line-height % to unit-less decimal value', () => {
    expect(transformLineHeight('50%')).to.equal(0.5);
  });

  it("does not transform line-height if it doesn't end with %", () => {
    expect(transformLineHeight('100')).to.equal('100');
  });
});
