import { expect } from 'chai';
import { transformFontWeight, fontWeightMap } from '../../src/transformFontWeight.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformFontWeight as (value: unknown) => unknown, {});

describe('transform dimension', () => {
  it('transforms fontweight keynames to fontweight numbers', () => {
    Object.entries(fontWeightMap).forEach(([keyname, number]) => {
      expect(transformFontWeight({ value: keyname })).to.equal(number);
    });
  });

  it('keeps fontweights that are not part of the fontweightmap, as is', () => {
    expect(transformFontWeight({ value: '300' })).to.equal('300');
    expect(transformFontWeight({ value: 'foo' })).to.equal('foo');
  });

  it('supports case-insensitive input', () => {
    expect(transformFontWeight({ value: 'Light' })).to.equal(300);
  });

  it('supports fontWeights with fontStyles inside of them', () => {
    expect(transformFontWeight({ value: 'Light normal' })).to.equal(`300 normal`);
    expect(transformFontWeight({ value: 'ExtraBold Italic' })).to.equal(`800 italic`);
  });

  it('supports fontWeights with space separators', () => {
    expect(transformFontWeight({ value: 'Extra Bold' })).to.equal(800);
    expect(transformFontWeight({ value: 'Ultra Black Italic' })).to.equal(`950 italic`);
  });

  describe('composite tokens', () => {
    it('should transforms letter spacing % to em in typography letterSpacing prop', () => {
      expect(
        transformFontWeight({
          type: 'typography',
          value: {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontWeight: 'ExtraBold Italic',
          },
        }),
      ).to.eql({ fontSize: '16px', fontFamily: 'Arial', fontWeight: '800 italic' });
      expect(
        transformFontWeight({
          $type: 'typography',
          $value: {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontWeight: 'Light',
          },
        }),
      ).to.eql({ fontSize: '16px', fontFamily: 'Arial', fontWeight: 300 });
    });

    it('should leave typography fontWeight as is if it has already been stringified', () => {
      expect(
        transformFontWeight({
          type: 'typography',
          value: '300 16px Arial',
        }),
      ).to.eql('300 16px Arial');
    });
  });
});
