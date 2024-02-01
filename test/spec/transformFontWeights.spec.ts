import { expect } from '@esm-bundle/chai';
import { transformFontWeights, fontWeightMap } from '../../src/transformFontWeights.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformFontWeights as (value: unknown) => unknown);

describe('transform dimension', () => {
  it('transforms fontweight keynames to fontweight numbers', () => {
    Object.entries(fontWeightMap).forEach(([keyname, number]) => {
      expect(transformFontWeights(keyname)).to.equal(number);
    });
  });

  it('keeps fontweights that are not part of the fontweightmap, as is', () => {
    expect(transformFontWeights('300')).to.equal('300');
    expect(transformFontWeights('foo')).to.equal('foo');
  });

  it('supports case-insensitive input', () => {
    expect(transformFontWeights('Light')).to.equal(300);
  });

  it('supports fontWeights with fontStyles inside of them', () => {
    expect(transformFontWeights('Light normal')).to.equal(`300 normal`);
    expect(transformFontWeights('ExtraBold Italic')).to.equal(`800 italic`);
  });

  it('supports fontWeights with space separators', () => {
    expect(transformFontWeights('Extra Bold')).to.equal(800);
    expect(transformFontWeights('Ultra Black Italic')).to.equal(`950 italic`);
  });
});
