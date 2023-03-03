import { expect } from '@esm-bundle/chai';
import { transformShadow } from '../src/transformShadow';
import { runTransformSuite } from './suites/transform-suite.test';

runTransformSuite(transformShadow as (value: unknown) => unknown);

describe('transform shadow', () => {
  it('transforms boxShadow object to shadow shorthand', () => {
    expect(
      transformShadow({
        x: '5px',
        y: '3px',
        blur: '6px',
        spread: '2px',
        color: '#000000',
      }),
    ).to.equal('5px 3px 6px 2px #000000');
  });
});
