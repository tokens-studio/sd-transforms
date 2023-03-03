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
});
