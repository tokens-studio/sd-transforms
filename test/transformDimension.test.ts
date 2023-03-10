import { expect } from '@esm-bundle/chai';
import { transformDimension } from '../src/transformDimension';
import { runTransformSuite } from './suites/transform-suite.test';

runTransformSuite(transformDimension as (value: unknown) => unknown);

describe('transform dimension', () => {
  it('transforms unitless dimensions, by suffixing with "px"', () => {
    expect(transformDimension('4')).to.equal('4px');
  });

  it('does not transform a dimension if it already is suffixed with "px"', () => {
    expect(transformDimension('4px')).to.equal('4px');
  });
});
