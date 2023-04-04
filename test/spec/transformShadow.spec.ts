import { expect } from '@esm-bundle/chai';
import { transformShadow } from '../../src/transformShadow.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

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

  it('transforms innerShadow boxShadow object to shadow shorthand', () => {
    expect(
      transformShadow({
        x: '5px',
        y: '3px',
        blur: '6px',
        spread: '2px',
        color: '#000000',
        type: 'innerShadow',
      }),
    ).to.equal('inset 5px 3px 6px 2px #000000');
  });

  it('keeps string value shadows as is, e.g. if already transformed', () => {
    expect(transformShadow('5px 3px 6px 2px #000000')).to.equal('5px 3px 6px 2px #000000');
  });
});
