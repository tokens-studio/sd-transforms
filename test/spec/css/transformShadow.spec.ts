import { expect } from '@esm-bundle/chai';
import { transformShadowForCSS } from '../../../src/css/transformShadow.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformShadowForCSS as (value: unknown) => unknown);

describe('transform shadow', () => {
  it('transforms boxShadow object to shadow shorthand', () => {
    expect(
      transformShadowForCSS({
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
      transformShadowForCSS({
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
    expect(transformShadowForCSS('5px 3px 6px 2px #000000')).to.equal('5px 3px 6px 2px #000000');
  });

  it('transforms dimensions and hexrgba colors', () => {
    expect(
      transformShadowForCSS({
        x: '5',
        y: '3',
        blur: '6',
        spread: '2',
        color: 'rgba(#000000, 1)',
      }),
    ).to.equal('5px 3px 6px 2px rgba(0, 0, 0, 1)');
  });

  it('provides empty string or 0 for missing properties', () => {
    expect(transformShadowForCSS({})).to.equal('0 0 0 rgba(0, 0, 0, 1)');

    expect(transformShadowForCSS({ x: '5', y: '' })).to.equal('5px 0 0 rgba(0, 0, 0, 1)');

    expect(transformShadowForCSS({ spread: '5', color: 'rgba(#000000, 0.5)' })).to.equal(
      '0 0 0 5px rgba(0, 0, 0, 0.5)',
    );
  });
});
