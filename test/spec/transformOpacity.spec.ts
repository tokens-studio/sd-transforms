import { expect } from '@esm-bundle/chai';
import { transformOpacity } from '../../src/transformOpacity.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformOpacity as (value: unknown) => unknown);

describe('transform opacity', () => {
  it('transforms opacity % to unit-less decimal value', () => {
    expect(transformOpacity('50%')).to.equal(0.5);
  });

  it("does not transform opacity if it doesn't end with %", () => {
    expect(transformOpacity('100')).to.equal('100');
  });

  it('does not transform opacity if it cannot be parsed as float', () => {
    expect(transformOpacity('not-a-float%')).to.equal('not-a-float%');
  });
});
