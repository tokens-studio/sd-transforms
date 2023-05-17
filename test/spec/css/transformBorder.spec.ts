import { expect } from '@esm-bundle/chai';
import { transformBorderForCSS } from '../../../src/css/transformBorder.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformBorderForCSS as (value: unknown) => unknown);

describe('transform border', () => {
  it('transforms border object to border shorthand', () => {
    expect(
      transformBorderForCSS({
        width: '5px',
        style: 'dashed',
        color: '#000000',
      }),
    ).to.equal('5px dashed #000000');
  });

  it('keeps string value shadows as is, e.g. if already transformed', () => {
    expect(transformBorderForCSS('1px solid white')).to.equal('1px solid white');
  });

  it('transforms border object props dimensions and hexrgba colors', () => {
    expect(
      transformBorderForCSS({
        width: '5',
        style: 'dashed',
        color: 'rgba(#000000, 1)',
      }),
    ).to.equal('5px dashed rgba(0, 0, 0, 1)');
  });

  it('provides empty string for missing properties', () => {
    expect(
      transformBorderForCSS({
        width: '5',
        style: '',
      }),
    ).to.equal('5px');

    expect(
      transformBorderForCSS({
        color: '#FFFFFF',
      }),
    ).to.equal('#FFFFFF');

    expect(
      transformBorderForCSS({
        style: 'solid',
      }),
    ).to.equal('solid');
  });
});
