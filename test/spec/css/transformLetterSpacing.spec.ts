import { expect } from '@esm-bundle/chai';
import { transformLetterSpacingForCSS } from '../../../src/css/transformLetterSpacing.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformLetterSpacingForCSS as (value: unknown) => unknown);

describe('transform letter spacing', () => {
  it('transforms letter spacing % to em', () => {
    expect(transformLetterSpacingForCSS('50%')).to.equal('0.5em');
  });

  it("does not transform letter spacing if it doesn't end with %", () => {
    expect(transformLetterSpacingForCSS('100')).to.equal('100');
  });

  it('does not transform letter spacing if it cannot be parsed as float', () => {
    expect(transformLetterSpacingForCSS('not-a-float%')).to.equal('not-a-float%');
  });
});
