import { expect } from 'chai';
import { percentageToDecimal } from '../../../src/utils/percentageToDecimal.js';

describe('percentage to decimal', () => {
  it('converts percentage strings to decimal numbers', () => {
    expect(percentageToDecimal('100%')).to.equal(1);
    expect(percentageToDecimal('50%')).to.equal(0.5);
  });

  it('ignores values that do not end with a percentage character', () => {
    expect(percentageToDecimal('100')).to.equal('100');
    expect(percentageToDecimal('foo')).to.equal('foo');
  });

  it('returns NaN if percentage cannot be parsed as a float', () => {
    expect(percentageToDecimal('foo%')).to.be.NaN;
  });
});
