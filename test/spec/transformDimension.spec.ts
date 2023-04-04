import { expect } from '@esm-bundle/chai';
import { transformDimension } from '../../src/transformDimension.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformDimension as (value: unknown) => unknown);

describe('transform dimension', () => {
  it('transforms unitless dimensions, by suffixing with "px"', () => {
    expect(transformDimension('4')).to.equal('4px');
    expect(transformDimension(4)).to.equal('4px');
  });

  it('does not transform a dimension if it already is suffixed with "px"', () => {
    expect(transformDimension('4px')).to.equal('4px');
  });

  it('does not transform a dimension if it is not numeric', () => {
    expect(transformDimension('4em')).to.equal('4em');
  });

  it('does not transform a dimension if it is 0', () => {
    expect(transformDimension('0')).to.equal('0');
    expect(transformDimension(0)).to.equal('0');
  });
});
