import { expect } from '@esm-bundle/chai';
import { transformLetterSpacing } from '../../src/transformLetterSpacing.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformLetterSpacing as (value: unknown) => unknown);

describe('transform letter spacing', () => {
  it('transforms letter spacing % to em', () => {
    expect(transformLetterSpacing('50%')).to.equal('0.5em');
  });

  it("does not transform letter spacing if it doesn't end with %", () => {
    expect(transformLetterSpacing('100')).to.equal('100');
  });
});
