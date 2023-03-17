import { expect } from '@esm-bundle/chai';
import { transformFontWeights, fontWeightMap } from '../src/transformFontWeights';
import { runTransformSuite } from './suites/transform-suite.test';

runTransformSuite(transformFontWeights as (value: unknown) => unknown);

describe('transform dimension', () => {
  it('transforms fontweight keynames to fontweight numbers', () => {
    Object.entries(fontWeightMap).forEach(([keyname, number]) => {
      expect(transformFontWeights(keyname)).to.equal(`${number}`);
    });
  });

  it('keeps fontweights that are not part of the fontweightmap, as is', () => {
    expect(transformFontWeights('300')).to.equal('300');
    expect(transformFontWeights('foo')).to.equal('foo');
  });

  it('supports case-insensitive input', () => {
    expect(transformFontWeights('Light')).to.equal('300');
  });
});
